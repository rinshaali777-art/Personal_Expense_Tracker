
import Link from "next/link"

export default function Header() {
  return (
    <header className="flex flex-col gap-4 border-b bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Expense Tracker
        </h1>
        {/* <p className="text-sm text-gray-500">
          Manage your daily expenses
        </p> */}
      </div>

      <Link
        href="/add"
        className="rounded-lg bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
      >
        + Add Expense
      </Link>
    </header>
  )
}
