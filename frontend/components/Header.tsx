import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-orange-500 transition">
          Skiniify 🔪
        </Link>
        
        <div className="flex gap-4">
          <Link 
            href="/calculator"
            className="text-gray-300 hover:text-white transition"
          >
            Calculator
          </Link>
          
          <Link 
            href="/inventory"
            className="text-gray-300 hover:text-white transition"
          >
            Inventory
          </Link>
          
          <a 
            href="#"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium text-sm"
          >
            Discord Community
          </a>
        </div>
      </nav>
    </header>
  )
}