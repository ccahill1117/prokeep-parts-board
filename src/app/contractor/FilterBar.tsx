import Link from 'next/link'
import { CATEGORY_LABELS, STATUS_LABELS } from '../ui/badges'

interface Props {
  filterStatus?: string
  filterCategory?: string
}

function pillClass(isActive: boolean) {
  return `rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
    isActive
      ? 'bg-gray-900 text-white border-gray-900'
      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
  }`
}

export default function FilterBar({ filterStatus, filterCategory }: Props) {
  function href(status: string, category: string) {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (category) params.set('category', category)
    const qs = params.toString()
    return `/contractor${qs ? '?' + qs : ''}`
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-gray-600">Filter:</span>

      <div className="flex flex-wrap gap-2">
        {(['', 'pending', 'filled', 'shipped'] as const).map((s) => (
          <Link
            key={s}
            href={href(s, filterCategory ?? '')}
            className={pillClass((filterStatus ?? '') === s)}
          >
            {s === '' ? 'All statuses' : STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(['', 'hvac', 'plumbing', 'automotive'] as const).map((c) => (
          <Link
            key={c}
            href={href(filterStatus ?? '', c)}
            className={pillClass((filterCategory ?? '') === c)}
          >
            {c === '' ? 'All types' : CATEGORY_LABELS[c]}
          </Link>
        ))}
      </div>
    </div>
  )
}
