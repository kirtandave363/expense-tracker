"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Check, Calendar, Clock } from "lucide-react";
import { updateEMIAction, deleteEMIAction } from "@/actions/emiActions";

interface EMICardProps {
  emi: {
    _id: string;
    title: string;
    amount: number;
    startDate: string;
    endDate: string;
    dayOfMonth: number;
    isActive: boolean;
  };
}

export default function EMICard({ emi }: EMICardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: emi.title,
    amount: emi.amount.toString(),
    startDate: new Date(emi.startDate).toISOString().split("T")[0],
    endDate: new Date(emi.endDate).toISOString().split("T")[0],
    dayOfMonth: emi.dayOfMonth.toString(),
    isActive: emi.isActive,
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateEMIAction(emi._id, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        dayOfMonth: parseInt(formData.dayOfMonth),
        isActive: formData.isActive,
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
      await deleteEMIAction(emi._id);
    } catch (error) {
      console.error("Delete error:", error);
      setLoading(false);
    }
  };

  const toggleActive = async () => {
    setLoading(true);
    try {
      await updateEMIAction(emi._id, {
        isActive: !emi.isActive,
      });
    } catch (error) {
      console.error("Toggle error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthsRemaining = () => {
    const now = new Date();
    const end = new Date(emi.endDate);
    const monthsDiff =
      (end.getFullYear() - now.getFullYear()) * 12 +
      (end.getMonth() - now.getMonth());
    return Math.max(0, monthsDiff);
  };

  const calculateTotalPaid = () => {
    const now = new Date();
    const start = new Date(emi.startDate);
    const monthsPaid = Math.max(
      0,
      (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth())
    );
    return monthsPaid * emi.amount;
  };

  const calculateTotalAmount = () => {
    const start = new Date(emi.startDate);
    const end = new Date(emi.endDate);
    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return totalMonths * emi.amount;
  };

  // Edit Mode
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-indigo-300">
        <div className="space-y-3">
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={loading}
            placeholder="EMI Title"
          />
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={loading}
            placeholder="Monthly Amount"
          />
          <input
            type="number"
            min="1"
            max="31"
            value={formData.dayOfMonth}
            onChange={(e) =>
              setFormData({ ...formData, dayOfMonth: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={loading}
            placeholder="Payment Day (1-31)"
          />
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={loading}
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={loading}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <div className="flex gap-2 pt-2">
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
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-300">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          Delete "{emi.title}"?
        </p>
        <p className="text-xs text-gray-500 mb-4">
          This will remove the EMI but keep existing expense entries.
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
  const monthsRemaining = calculateMonthsRemaining();
  const totalPaid = calculateTotalPaid();
  const totalAmount = calculateTotalAmount();
  const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border transition-all ${
        emi.isActive
          ? "border-indigo-200 hover:shadow-md"
          : "border-gray-200 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-800">{emi.title}</h3>
            {emi.isActive ? (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                Active
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                Inactive
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-indigo-600">
            ₹{emi.amount.toLocaleString("en-IN")}
            <span className="text-sm text-gray-500 font-normal">/month</span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Paid: ₹{totalPaid.toLocaleString("en-IN")}</span>
          <span>Total: ₹{totalAmount.toLocaleString("en-IN")}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <Calendar size={14} />
            <span>Payment Day</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {emi.dayOfMonth}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <Clock size={14} />
            <span>Remaining</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {monthsRemaining} months
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="text-xs text-gray-500 mb-4">
        <p>
          Start:{" "}
          {new Date(emi.startDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p>
          End:{" "}
          {new Date(emi.endDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <button
          onClick={toggleActive}
          disabled={loading}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            emi.isActive
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          } disabled:opacity-50`}
        >
          {loading ? "..." : emi.isActive ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="Edit EMI"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setIsDeleting(true)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete EMI"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
