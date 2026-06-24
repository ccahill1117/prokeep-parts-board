import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'
import path from 'path'

export type Category = 'hvac' | 'plumbing' | 'automotive'
export type Status = 'pending' | 'filled' | 'shipped'

export interface PartRequest {
  id: string
  category: Category
  partName: string
  quantity: number
  notes: string
  status: Status
  createdAt: string
  updatedAt: string
}

interface Row {
  id: string
  category: Category
  part_name: string
  quantity: number
  notes: string
  status: Status
  created_at: string
  updated_at: string
}

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'parts_board.db')

const db = new Database(DB_PATH)

db.exec(`
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
  )
`)

function toRequest(r: Row): PartRequest {
  return {
    id: r.id,
    category: r.category,
    partName: r.part_name,
    quantity: r.quantity,
    notes: r.notes,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function getRequests(
  filters: { status?: string; category?: string } = {}
): Promise<PartRequest[]> {
  const conditions: string[] = []
  const values: unknown[] = []

  if (filters.status) { conditions.push('status = ?'); values.push(filters.status) }
  if (filters.category) { conditions.push('category = ?'); values.push(filters.category) }

  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : ''
  const rows = db.prepare(`SELECT * FROM part_requests${where} ORDER BY created_at DESC`).all(...values) as Row[]
  return rows.map(toRequest)
}

export async function addRequest(
  data: Pick<PartRequest, 'category' | 'partName' | 'quantity' | 'notes'>
): Promise<PartRequest> {
  const id = randomUUID()
  const now = new Date().toISOString()

  db.prepare(
    `INSERT INTO part_requests (id, category, part_name, quantity, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.category, data.partName, data.quantity, data.notes, now, now)

  return toRequest(db.prepare('SELECT * FROM part_requests WHERE id = ?').get(id) as Row)
}

export async function setStatus(id: string, status: Status): Promise<PartRequest | null> {
  const now = new Date().toISOString()
  const result = db.prepare(
    'UPDATE part_requests SET status = ?, updated_at = ? WHERE id = ?'
  ).run(status, now, id)

  if (result.changes === 0) return null
  return toRequest(db.prepare('SELECT * FROM part_requests WHERE id = ?').get(id) as Row)
}
