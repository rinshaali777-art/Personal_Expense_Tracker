
import mongoose, { Schema, Model } from "mongoose"

export interface Expense {
  title: string
  description: string
  amount: number
  category: string
  expenseDate: Date
  paymentMethod: string
}

const expenseSchema = new Schema<Expense>(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Healthcare",
        "Education",
        "Others",
      ],
    },

    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
      ],
    },
  },
  {
    timestamps: true,
  }
)

const Expense: Model<Expense> =
  mongoose.models.Expense ||
  mongoose.model<Expense>("Expense", expenseSchema)

export default Expense
