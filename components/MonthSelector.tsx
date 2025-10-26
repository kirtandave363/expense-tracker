"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthSelector({
  currentMonth,
  currentYear,
}: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleMonthChange = (newMonth: number, newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth.toString());
    params.set("year", newYear.toString());
    router.push(`/dashboard?${params.toString()}`);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      handleMonthChange(12, currentYear - 1);
    } else {
      handleMonthChange(currentMonth - 1, currentYear);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      handleMonthChange(1, currentYear + 1);
    } else {
      handleMonthChange(currentMonth + 1, currentYear);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    handleMonthChange(now.getMonth() + 1, now.getFullYear());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear()
    );
  };

  // Generate year options (current year ± 5 years)
  const currentYearNow = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => currentYearNow - 5 + i
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left: Arrow Navigation */}
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Center: Dropdowns */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          {/* Month Dropdown */}
          <div className="relative">
            <select
              value={currentMonth}
              onChange={(e) =>
                handleMonthChange(parseInt(e.target.value), currentYear)
              }
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={currentYear}
              onChange={(e) =>
                handleMonthChange(currentMonth, parseInt(e.target.value))
              }
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Go to Current Month Button */}
          {!isCurrentMonth() && (
            <button
              onClick={goToCurrentMonth}
              className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center gap-2 whitespace-nowrap"
              title="Jump to current month"
            >
              <Calendar size={16} />
              <span className="hidden sm:inline">Go to Current Month</span>
              <span className="sm:hidden">Today</span>
            </button>
          )}
        </div>

        {/* Right: Arrow Navigation */}
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
