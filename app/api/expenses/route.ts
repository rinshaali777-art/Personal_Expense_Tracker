import { NextRequest, NextResponse } from "next/server"
import {connectDB} from "@/lib/db"
import Expense from "@/models/Expense"

// GET /api/expenses - Get all expenses
export async function GET() {
  try {
    await connectDB()

    const expenses = await Expense.find().sort({
      expenseDate: -1,
      createdAt: -1,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Expenses fetched successfully",
        data: expenses,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET expenses error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch expenses",
      },
      { status: 500 }
    )
  }
}

// POST /api/expenses - Add a new expense
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const {
      title,
      description,
      amount,
      category,
      expenseDate,
      paymentMethod,
    } = body

    // Check required fields
    if (
      !title?.trim() ||
      !description?.trim() ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !category ||
      !expenseDate ||
      !paymentMethod
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      )
    }

    // Validate amount
    const expenseAmount = Number(amount)

    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be a positive number",
        },
        { status: 400 }
      )
    }

    // Validate date
    const parsedDate = new Date(expenseDate)

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid expense date",
        },
        { status: 400 }
      )
    }

    // Create expense
    const newExpense = await Expense.create({
      title: title.trim(),
      description: description.trim(),
      amount: expenseAmount,
      category,
      expenseDate: parsedDate,
      paymentMethod,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Expense added successfully",
        data: newExpense,
      },
      { status: 201 }
    )
  } catch (error) {
  console.error("POST expense error:", error)

  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown server error",
    },
    { status: 500 }
  )
}
}