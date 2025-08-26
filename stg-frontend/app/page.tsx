import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            StitchGrab Platform
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/store" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">Store</h2>
              <p className="text-gray-600">Customer storefront</p>
            </Link>
            <Link href="/drivers" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">Drivers</h2>
              <p className="text-gray-600">Driver dashboard</p>
            </Link>
            <Link href="/vendors" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
              <p className="text-gray-600">Vendor dashboard</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
