/**
 * 1_no_op — First migration to prove the migration runner is working.
 * Phase 1 will add real migrations (001_extensions, 002_users, …).
 */
export const up = (_pgm) => {
  // intentionally empty — this migration only proves the runner is configured
};

export const down = (_pgm) => {
  // intentionally empty
};
