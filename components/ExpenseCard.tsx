"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import {
  updateExpenseAction,
  deleteExpenseAction,
} from "@/actions/expenseActions";

const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Shopping",
  "Health",
  "Other",
  "EMI",
];

interface ExpenseCardProps {
  expense: {
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
    emiId?: string | null;
  };
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    category: expense.category,
    date: new Date(expense.date).toISOString().split("T")[0],
    description: expense.description || "",
  });

  const isEMI = !!expense.emiId;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateExpenseAction(expense._id, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      });

      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteExpenseAction(expense._id);
      // Page will auto-refresh due to revalidatePath
    } catch (error) {
      console.error("Delete error:", error);
      setLoading(false);
    }
  };

  const categoryColors: Record<string, string> = {
    Food: "bg-green-100 text-green-700 border-green-200",
    Transport: "bg-blue-100 text-blue-700 border-blue-200",
    Bills: "bg-red-100 text-red-700 border-red-200",
    Entertainment: "bg-purple-100 text-purple-700 border-purple-200",
    Shopping: "bg-pink-100 text-pink-700 border-pink-200",
    Health: "bg-orange-100 text-orange-700 border-orange-200",
    EMI: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Other: "bg-gray-100 text-gray-700 border-gray-200",
  };

  // Edit Mode
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-purple-300">
        <div className="space-y-3">
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            disabled={loading || isEMI}
            placeholder="Title"
          />
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            disabled={loading || isEMI}
            placeholder="Amount"
          />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            disabled={loading || isEMI}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            disabled={loading}
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            rows={2}
            disabled={loading}
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1 transition"
            >
              <Check size={16} />
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center gap-1 transition"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Delete Confirmation
  if (isDeleting) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-red-300">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          Delete "{expense.title}"?
        </p>
        <p className="text-xs text-gray-500 mb-4">
          This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={() => setIsDeleting(false)}
            disabled={loading}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Normal View
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {expense.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(expense.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-right ml-2">
          <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
            ₹{expense.amount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {expense.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {expense.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
            categoryColors[expense.category] || categoryColors.Other
          }`}
        >
          {expense.category}
        </span>

        <div className="flex items-center gap-1">
          {isEMI ? (
            <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">
              Auto EMI
            </span>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                title="Edit expense"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setIsDeleting(true)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                title="Delete expense"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
