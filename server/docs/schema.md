# Database Schema

This document outlines the PostgreSQL database schema for GlobeTrotter.

## Entity Relationship Diagram

```text
countries ─1:N─ cities ─1:N─ activities ─N:1─ activity_categories
                  │                │
                  │                └──────────────┐
                  │                               │
users ─1:N─ trips ─1:N─ trip_stops ─1:N─ trip_activities
  │           │              (city_id ─┘)
  │           ├─1:N─ trip_expenses
  │           └─1:N─ trip_views
  ├─1:N─ refresh_tokens
  ├─1:N─ password_reset_tokens
  ├─N:M─ cities  (via saved_cities)
  └─1:N─ activity_log
```

## Table Specifications

### Core Entities
*   **`users`**: Stores user accounts, authentication credentials (hashed), and basic profile information.
*   **`refresh_tokens`**: Manages active sessions with rotation and revocation support to maintain secure persistent logins.
*   **`password_reset_tokens`**: Stores short-lived, single-use tokens for the password recovery flow.

### Catalogue (Reference Data)
*   **`countries`**: A reference list of countries and their regions to group cities.
*   **`cities`**: The core destinations available to add to a trip, complete with coordinates, cost indices, and images.
*   **`activity_categories`**: Standardized classifications for things to do (e.g., Food & Drink, Sightseeing).
*   **`activities`**: Specific catalogued experiences in a given city with estimated costs and durations.

### Trip Planning
*   **`trips`**: The primary container for a user's planned journey, defining the date range, overall budget, and visibility.
*   **`trip_stops`**: Represents a specific leg of a trip in a single city, tracking arrival/departure dates and fixed transport/accommodation costs.
*   **`trip_activities`**: Individual activities scheduled on a specific day within a stop, either linked to the catalogue or custom-created.
*   **`trip_expenses`**: Ad-hoc spending (meals, misc) that aren't formal scheduled activities but count against the trip budget.

### Engagement & Analytics
*   **`saved_cities`**: A join table mapping users to their wish-listed cities.
*   **`trip_views`**: Analytics table recording public visits to shared trips using hashed IPs for privacy.
*   **`activity_log`**: An audit trail of key user actions (signups, trip creation, sharing) to power the admin dashboard feed.
