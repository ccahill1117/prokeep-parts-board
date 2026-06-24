-- SQLite schema (auto-applied on startup via db.ts — this file is for reference only)
CREATE TABLE IF NOT EXISTS part_requests (
  id         TEXT    PRIMARY KEY,
  category   TEXT    NOT NULL CHECK (category IN ('hvac', 'plumbing', 'automotive')),
  part_name  TEXT    NOT NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  notes      TEXT    NOT NULL DEFAULT '',
  status     TEXT    NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'filled', 'shipped')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
