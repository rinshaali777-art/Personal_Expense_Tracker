
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type ExpenseForm = {
  title: string
  description: string
  amount: string
  category: string
  expenseDate: string
  paymentMethod: string
}

export default function AddExpense() {
  const router = useRouter()

  const [expense, setExpense] = useState<ExpenseForm>({
    title: "",
    description: "",
    amount: "",
    category: "",
    expenseDate: "",
    paymentMethod: "",
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string>("")

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setMessage("")
    setError("")

    if (
      !expense.title ||
      !expense.description ||
      !expense.amount ||
      !expense.category ||
      !expense.expenseDate ||
      !expense.paymentMethod
    ) {
      setError("Please fill all the fields")
      return
    }

    // Validate amount
    const amount = Number(expense.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero")
      return
    }

    try {
      setLoading(true)

      // POST API request
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: expense.title.trim(),
          description: expense.description.trim(),
          amount,
          category: expense.category,
          expenseDate: expense.expenseDate,
          paymentMethod: expense.paymentMethod,
        }),
      })

      const result = await response.json()
      console.log(result)
      if (!response.ok) {
        throw new Error(result.message || "Failed to add expense")
      }

      setMessage("Expense added successfully!")

      setExpense({
        title: "",
        description: "",
        amount: "",
        category: "",
        expenseDate: "",
        paymentMethod: "",
      })

      // Redirect to dashboard
      router.push("/")
      router.refresh()

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong"

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Expense Tracker
            </h1>

            <p className="text-sm text-gray-500">
              Manage your daily expenses
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Form container */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Expense
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your expense details below.
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Expense title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Expense Title *
              </label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter expense title"
                value={expense.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Enter expense description"
                rows={4}
                value={expense.description}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Amount (₹) *
              </label>

              <input
                id="amount"
                type="number"
                name="amount"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={expense.amount}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={expense.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Expense date */}
            <div>
              <label
                htmlFor="expenseDate"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Expense Date *
              </label>

              <input
                id="expenseDate"
                type="date"
                name="expenseDate"
                value={expense.expenseDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Payment method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Payment Method *
              </label>

              <select
                id="paymentMethod"
                name="paymentMethod"
                value={expense.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Adding Expense..." : "Add Expense"}
              </button>

              <Link
                href="/"
                className="flex-1 rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Link>

            </div>

          </form>

        </div>
      </div>

    </main>
  )
}
