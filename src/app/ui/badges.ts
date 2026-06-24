import { Category, Status } from '../lib/store'

export const CATEGORY_LABELS: Record<Category, string> = {
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  automotive: 'Automotive',
}

export const CATEGORY_STYLES: Record<Category, string> = {
  hvac: 'bg-sky-100 text-sky-700',
  plumbing: 'bg-teal-100 text-teal-700',
  automotive: 'bg-orange-100 text-orange-700',
}

export const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  filled: 'Filled',
  shipped: 'Shipped',
}

export const STATUS_STYLES: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-700',
  filled: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-emerald-100 text-emerald-700',
}
