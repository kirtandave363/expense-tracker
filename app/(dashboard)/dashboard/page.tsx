import { getExpensesForMonth } from "@/actions/expenseActions";
import AddExpenseForm from "@/components/AddExpenseForm";
import DailyExpenseChart from "@/components/DailyExpenseChart";
import MonthSelector from "@/components/MonthSelector";
import StatsCards from "@/components/StatsCards";
import ExpenseCard from "@/components/ExpenseCard";
import AdSense from "@/components/AdSense";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

interface DashboardPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : undefined;
  const year = params.year ? parseInt(params.year) : undefined;

  // Fetch expenses from server
  const data = await getExpensesForMonth(month, year);

  const user = await getUserFromToken();

  // Get first name from full name
  const firstName = user?.name.split(" ")[0] || "User";

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-purple-100">
          Here's your expense summary for {MONTHS[data.month - 1]} {data.year}
        </p>
      </div>

      {/* Month Selector */}
      <MonthSelector currentMonth={data.month} currentYear={data.year} />

      {/* Stats Cards */}
      <StatsCards
        totalAmount={data.totalAmount}
        totalExpenses={data.totalExpenses}
        month={MONTHS[data.month - 1]}
      />

      {/* AdSense Banner Ad - Between Stats and Main Content */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200"
        style={{
          height: "130px",
          maxHeight: "130px",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AdSense format="horizontal" minHeight="100px" minWidth="100%" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add Expense Form */}
        <div className="lg:col-span-1">
          <AddExpenseForm />
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-2">
          <DailyExpenseChart
            dailyTotals={data.dailyTotals}
            month={data.month}
            year={data.year}
          />
        </div>
      </div>

      {/* Expenses List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Expenses</h2>
          <span className="text-sm text-gray-500">
            {data.totalExpenses}{" "}
            {data.totalExpenses === 1 ? "expense" : "expenses"}
          </span>
        </div>

        {data.expenses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No expenses yet
            </h3>
            <p className="text-gray-600">
              Add your first expense to start tracking!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.expenses.map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} />
            ))}
          </div>
        )}

        {/* AdSense Ad - After Expenses List */}
        {data.expenses.length > 0 && (
          <div
            className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200"
            style={{
              height: "130px",
              maxHeight: "130px",
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AdSense format="horizontal" minHeight="100px" minWidth="100%" />
          </div>
        )}
      </div>
    </div>
  );
}
