
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Header from "./components/Header"

type Expense = {
  _id: string
  title: string
  description: string
  amount: number
  category: string
  expenseDate: string
  paymentMethod: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [today, setToday] = useState<Date | null>(null)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [paymentMethod, setPaymentMethod] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")

 
  const fetchExpenses = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/expenses", {
        cache: "no-store",
      })
      const result = await response.json()
      console.log(result)
      setExpenses(result.data || [])
    } catch (error) {
      console.error("Fetch error:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load expenses"
      )
    } finally {
      setLoading(false)
    }
  }


 useEffect(() => {
  setToday(new Date())
  fetchExpenses()
}, [])

  
  const deleteExpense = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?")
    if (!confirmed) return
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()
      alert("Expense deleted successfully!")
      await fetchExpenses()
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    }
  }


  
const filteredExpenses = useMemo(() => {
  return expenses.filter((item) => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      item.title.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText)

    const matchesCategory =
      category === "All Categories" ||
      item.category === category

    const matchesPayment =
      paymentMethod === "All" ||
      item.paymentMethod === paymentMethod

    const expenseDate = new Date(item.expenseDate)

    let matchesDate = true

    // Apply date filters only after today's date is available
    if (today && dateFilter === "Today") {
      matchesDate =
        expenseDate.getFullYear() === today.getFullYear() &&
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getDate() === today.getDate()
    }

    if (today && dateFilter === "This Week") {
      const startOfWeek = new Date(today)
      const day = today.getDay()

      startOfWeek.setDate(today.getDate() - day)
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 7)

      matchesDate =
        expenseDate >= startOfWeek &&
        expenseDate < endOfWeek
    }

    if (today && dateFilter === "This Month") {
      matchesDate =
        expenseDate.getFullYear() === today.getFullYear() &&
        expenseDate.getMonth() === today.getMonth()
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPayment &&
      matchesDate
    )
  })
}, [
  expenses,
  search,
  category,
  paymentMethod,
  dateFilter,
  today,
])


 

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <Header />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* Dashboard Heading */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="mt-1 text-gray-500">
            Track and manage your personal expenses.
          </p>
        </div>

        

        {/* Search and Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Search and Filters
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <input
              type="text"
              placeholder="Search title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All Categories">
                All Categories
              </option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>

            {/* Payment Method */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>

          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearch("")
              setCategory("All Categories")
              setPaymentMethod("All")
              setDateFilter("All")
            }}
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Clear Filters
          </button>

        </div>

        {/* Expense Records */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Expense Records
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {filteredExpenses.length} expenses found
              </p>
            </div>

            {/* Correct Add Expense Route */}
            <Link
              href="/add"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Add Expense
            </Link>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading expenses...
            </div>
          ) : error ? (

            /* Error */
            <div className="p-10 text-center text-red-600">
              {error}

              <button
                onClick={fetchExpenses}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>

          ) : filteredExpenses.length === 0 ? (

            /* Empty State */
            <div className="p-10 text-center text-gray-500">
              <p className="text-lg font-semibold">
                No expenses found
              </p>

              <p className="mt-2 text-sm">
                Add a new expense or clear your filters.
              </p>
            </div>

          ) : (

            /* Expense Table */
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Title
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Payment
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredExpenses.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >

                      {/* Title */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.description}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ₹{Number(item.amount).toFixed(2)}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-600">
                        {new Date(item.expenseDate).toLocaleDateString("en-IN")}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4 text-gray-600">
                        {item.paymentMethod}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <Link
                            href={`edit/${item._id}`}
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => deleteExpense(item._id)}
                            className="font-semibold text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  )
}
