
"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

type ExpenseForm = {
  title: string
  description: string
  amount: string
  category: string
  expenseDate: string
  paymentMethod: string
}

type ExpenseResponse = {
  success: boolean
  message: string
  data?: {
    _id: string
    title: string
    description: string
    amount: number
    category: string
    expenseDate: string
    paymentMethod: string
  }
}

const initialForm: ExpenseForm = {
  title: "",
  description: "",
  amount: "",
  category: "",
  expenseDate: "",
  paymentMethod: "",
}

// Page wrapper with Suspense
export default function EditExpensePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          Loading edit page...
        </div>
      }
    >
      <EditExpense />
    </Suspense>
  )
}

// Edit Expense Component
function EditExpense() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const router = useRouter()

  const [expense, setExpense] = useState<ExpenseForm>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Fetch existing expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`/api/expenses/${id}`)
        const result: ExpenseResponse = await response.json()

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Expense not found")
        }

        setExpense({
          title: result.data.title,
          description: result.data.description,
          amount: String(result.data.amount),
          category: result.data.category,
          expenseDate: new Date(result.data.expenseDate)
            .toISOString()
            .slice(0, 10),
          paymentMethod: result.data.paymentMethod,
        })
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load expense"
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchExpense()
    }
  }, [id])

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

  // Update expense
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError("")

    if (
      !expense.title.trim() ||
      !expense.description.trim() ||
      !expense.amount ||
      !expense.category ||
      !expense.expenseDate ||
      !expense.paymentMethod
    ) {
      setError("Please fill in all fields")
      return
    }

    const amount = Number(expense.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero")
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...expense,
          amount,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update expense"
        )
      }

      alert("Expense updated successfully!")

      router.push("/")
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading expense...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Expense
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update your expense details
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Expense Title
            </label>

            <input
              type="text"
              name="title"
              value={expense.title}
              onChange={handleChange}
              placeholder="Enter expense title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={expense.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>

            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={expense.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Expense Date
            </label>

            <input
              type="date"
              name="expenseDate"
              value={expense.expenseDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Method
            </label>

            <select
              name="paymentMethod"
              value={expense.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              required
            >
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating..." : "Save Changes"}
            </button>

            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
