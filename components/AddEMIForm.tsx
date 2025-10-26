"use client";

import { useState } from "react";
import { createEMIAction } from "@/actions/emiActions";
import { Plus } from "lucide-react";

export default function AddEMIForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    startDate: "",
    endDate: "",
    dayOfMonth: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await createEMIAction({
        title: formData.title,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        dayOfMonth: parseInt(formData.dayOfMonth),
      });

      if (!result.success) {
        setError(result.error || "Failed to create EMI");
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
        title: "",
        amount: "",
        startDate: "",
        endDate: "",
        dayOfMonth: "1",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Plus size={20} className="text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add New EMI</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
          ✓ EMI created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            EMI Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            placeholder="Car Loan"
            disabled={loading}
          />
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Monthly Amount (₹) *
          </label>
          <input
            id="amount"
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            placeholder="5000"
            disabled={loading}
          />
        </div>

        {/* Day of Month */}
        <div>
          <label
            htmlFor="dayOfMonth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Day *
          </label>
          <input
            id="dayOfMonth"
            type="number"
            required
            min="1"
            max="31"
            value={formData.dayOfMonth}
            onChange={(e) =>
              setFormData({ ...formData, dayOfMonth: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            placeholder="5"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Day of the month for EMI deduction (1-31)
          </p>
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date *
          </label>
          <input
            id="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            disabled={loading}
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date *
          </label>
          <input
            id="endDate"
            type="date"
            required
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={18} />
              Create EMI
            </>
          )}
        </button>
      </form>
    </div>
  );
}
