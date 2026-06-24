import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Parts Request Board</h1>
        <p className="mt-3 text-lg text-gray-500">HVAC · Plumbing · Automotive</p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <div className="grid grid-cols-2 gap-4 w-full">
          <Link
            href="/contractor"
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl group-hover:bg-blue-100 transition-colors">
              🔧
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">Contractor</p>
              <p className="mt-0.5 text-xs text-gray-500">Submit &amp; track requests</p>
            </div>
          </Link>

          <Link
            href="/distributor"
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl group-hover:bg-emerald-100 transition-colors">
              📦
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">Distributor</p>
              <p className="mt-0.5 text-xs text-gray-500">Fill &amp; ship requests</p>
            </div>
          </Link>
        </div>

        <Link
          href="/board"
          className="group flex items-center justify-center gap-3 w-full rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 shadow-sm transition-all hover:border-violet-500 hover:shadow-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-lg group-hover:bg-violet-100 transition-colors">
            ⚡
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Side-by-side view</p>
            <p className="text-xs text-gray-500">Both panels at once</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
