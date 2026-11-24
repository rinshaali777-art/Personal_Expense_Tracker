import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import {connectDB }from "@/lib/db"
import Expense from "@/models/Expense"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

// GET /api/expenses/[id] - Get a single expense
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expense ID",
        },
        { status: 400 }
      )
    }

    const expense = await Expense.findById(id)

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Expense fetched successfully",
        data: expense,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET single expense error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch expense",
      },
      { status: 500 }
    )
  }
}

// PUT /api/expenses/[id] - Update an expense
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expense ID",
        },
        { status: 400 }
      )
    }

    const body = await request.json()

    const {
      title,
      description,
      amount,
      category,
      expenseDate,
      paymentMethod,
    } = body

    // Validate required fields
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

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        amount: expenseAmount,
        category,
        expenseDate: parsedDate,
        paymentMethod,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Expense updated successfully",
        data: updatedExpense,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("PUT expense error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update expense. Check the submitted data.",
      },
      { status: 400 }
    )
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expense ID",
        },
        { status: 400 }
      )
    }

    const deletedExpense = await Expense.findByIdAndDelete(id)

    if (!deletedExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Expense deleted successfully",
        data: deletedExpense,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("DELETE expense error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete expense",
      },
      { status: 500 }
    )
  }
}