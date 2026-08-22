/**
 * 8_views
 * The six aggregate views from §5.5.
 * The budget screen, dashboard, and admin dashboard read these directly —
 * no totals are recomputed in JavaScript.
 *
 * Views:
 *   v_trip_activity_cost   — per trip: SUM of trip_activities.cost
 *   v_trip_cost_breakdown  — per (trip_id, category): unioned transport/stay/activities/meals/misc
 *   v_trip_totals          — per trip: total_cost, duration_days, cost_per_day, stop_count,
 *                            activity_count, budget_limit, is_over_budget
 *   v_trip_daily_cost      — per (trip_id, day): cost for that calendar day
 *   v_city_usage           — how many trip_stops reference each city (for admin top-cities)
 *   v_activity_usage       — how many trip_activities reference each catalogue activity
 */

export const up = (pgm) => {
  // ── v_trip_activity_cost ───────────────────────────────────────────────────
  pgm.sql(`
    CREATE OR REPLACE VIEW v_trip_activity_cost AS
    SELECT
      ts.trip_id,
      COALESCE(SUM(ta.cost), 0)::NUMERIC(12,2) AS activity_cost
    FROM trip_stops ts
    LEFT JOIN trip_activities ta ON ta.trip_stop_id = ts.id
    GROUP BY ts.trip_id
  `);

  // ── v_trip_cost_breakdown ──────────────────────────────────────────────────
  // Unions four sources into one (trip_id, category, total) shape:
  //   1. Activities → category = 'activities'
  //   2. Transport costs from stops → category = 'transport'
  //   3. Accommodation costs from stops → category = 'stay'
  //   4. Expenses rows → category from trip_expenses.category
  pgm.sql(`
    CREATE OR REPLACE VIEW v_trip_cost_breakdown AS

    -- Activities
    SELECT ts.trip_id, 'activities' AS category, COALESCE(SUM(ta.cost), 0)::NUMERIC(12,2) AS total
    FROM trip_stops ts
    LEFT JOIN trip_activities ta ON ta.trip_stop_id = ts.id
    GROUP BY ts.trip_id

    UNION ALL

    -- Transport (cost of getting TO each stop)
    SELECT trip_id, 'transport' AS category, COALESCE(SUM(transport_cost), 0)::NUMERIC(12,2)
    FROM trip_stops
    GROUP BY trip_id

    UNION ALL

    -- Accommodation / stay
    SELECT trip_id, 'stay' AS category, COALESCE(SUM(accommodation_cost), 0)::NUMERIC(12,2)
    FROM trip_stops
    GROUP BY trip_id

    UNION ALL

    -- Expenses (meals, misc, extra transport recorded as trip_expenses)
    SELECT trip_id, category, COALESCE(SUM(amount), 0)::NUMERIC(12,2)
    FROM trip_expenses
    GROUP BY trip_id, category
  `);

  // ── v_trip_totals ──────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE OR REPLACE VIEW v_trip_totals AS
    SELECT
      t.id                                        AS trip_id,
      t.name,
      t.start_date,
      t.end_date,
      t.budget_limit,
      t.visibility,
      t.user_id,
      -- Duration in days (inclusive)
      (t.end_date - t.start_date + 1)             AS duration_days,
      -- Stop count
      COUNT(DISTINCT ts.id)                       AS stop_count,
      -- Activity count
      COUNT(DISTINCT ta.id)                       AS activity_count,
      -- Total cost = activity costs + transport + accommodation + expenses
      COALESCE(
        (SELECT SUM(cost) FROM trip_activities ta2
         JOIN trip_stops ts2 ON ts2.id = ta2.trip_stop_id WHERE ts2.trip_id = t.id), 0
      ) +
      COALESCE((SELECT SUM(transport_cost)     FROM trip_stops WHERE trip_id = t.id), 0) +
      COALESCE((SELECT SUM(accommodation_cost) FROM trip_stops WHERE trip_id = t.id), 0) +
      COALESCE((SELECT SUM(amount) FROM trip_expenses WHERE trip_id = t.id), 0)
        AS total_cost,
      -- cost_per_day (avoid division by zero for same-day trips)
      ROUND(
        (
          COALESCE((SELECT SUM(cost) FROM trip_activities ta2
                    JOIN trip_stops ts2 ON ts2.id = ta2.trip_stop_id WHERE ts2.trip_id = t.id), 0) +
          COALESCE((SELECT SUM(transport_cost)     FROM trip_stops WHERE trip_id = t.id), 0) +
          COALESCE((SELECT SUM(accommodation_cost) FROM trip_stops WHERE trip_id = t.id), 0) +
          COALESCE((SELECT SUM(amount) FROM trip_expenses WHERE trip_id = t.id), 0)
        ) / GREATEST((t.end_date - t.start_date + 1), 1)
      , 2) AS cost_per_day,
      -- is_over_budget: true only if budget_limit is set AND total exceeds it
      CASE
        WHEN t.budget_limit IS NOT NULL AND (
          COALESCE((SELECT SUM(cost) FROM trip_activities ta2
                    JOIN trip_stops ts2 ON ts2.id = ta2.trip_stop_id WHERE ts2.trip_id = t.id), 0) +
          COALESCE((SELECT SUM(transport_cost)     FROM trip_stops WHERE trip_id = t.id), 0) +
          COALESCE((SELECT SUM(accommodation_cost) FROM trip_stops WHERE trip_id = t.id), 0) +
          COALESCE((SELECT SUM(amount) FROM trip_expenses WHERE trip_id = t.id), 0)
        ) > t.budget_limit
        THEN TRUE
        ELSE FALSE
      END AS is_over_budget
    FROM trips t
    LEFT JOIN trip_stops ts ON ts.trip_id = t.id
    LEFT JOIN trip_activities ta ON ta.trip_stop_id = ts.id
    GROUP BY t.id
  `);

  // ── v_trip_daily_cost ──────────────────────────────────────────────────────
  // One row per (trip_id, calendar day): sum of activity costs scheduled on that day.
  // The calendar screen uses this to flag over-average days.
  pgm.sql(`
    CREATE OR REPLACE VIEW v_trip_daily_cost AS
    SELECT
      ts.trip_id,
      ta.scheduled_date          AS day,
      SUM(ta.cost)::NUMERIC(12,2) AS day_cost
    FROM trip_activities ta
    JOIN trip_stops ts ON ts.id = ta.trip_stop_id
    GROUP BY ts.trip_id, ta.scheduled_date
  `);

  // ── v_city_usage ──────────────────────────────────────────────────────────
  // How many trip_stops reference each city — drives the admin top-cities list.
  pgm.sql(`
    CREATE OR REPLACE VIEW v_city_usage AS
    SELECT
      c.id          AS city_id,
      c.name        AS city_name,
      co.name       AS country_name,
      COUNT(ts.id)  AS stop_count
    FROM cities c
    JOIN countries co ON co.id = c.country_id
    LEFT JOIN trip_stops ts ON ts.city_id = c.id
    GROUP BY c.id, c.name, co.name
    ORDER BY stop_count DESC
  `);

  // ── v_activity_usage ──────────────────────────────────────────────────────
  // How many trip_activities reference each catalogue activity — drives the admin top-activities list.
  pgm.sql(`
    CREATE OR REPLACE VIEW v_activity_usage AS
    SELECT
      a.id          AS activity_id,
      a.name        AS activity_name,
      c.name        AS city_name,
      ac.name       AS category_name,
      COUNT(ta.id)  AS usage_count
    FROM activities a
    JOIN cities c ON c.id = a.city_id
    JOIN activity_categories ac ON ac.id = a.category_id
    LEFT JOIN trip_activities ta ON ta.activity_id = a.id
    GROUP BY a.id, a.name, c.name, ac.name
    ORDER BY usage_count DESC
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP VIEW IF EXISTS v_activity_usage`);
  pgm.sql(`DROP VIEW IF EXISTS v_city_usage`);
  pgm.sql(`DROP VIEW IF EXISTS v_trip_daily_cost`);
  pgm.sql(`DROP VIEW IF EXISTS v_trip_totals`);
  pgm.sql(`DROP VIEW IF EXISTS v_trip_cost_breakdown`);
  pgm.sql(`DROP VIEW IF EXISTS v_trip_activity_cost`);
};
