// import { IndianRupee, TrendingUp, Calendar } from "lucide-react";

// interface StatsCardsProps {
//   totalAmount: number;
//   totalExpenses: number;
//   month: string;
// }

// export default function StatsCards({
//   totalAmount,
//   totalExpenses,
//   month,
// }: StatsCardsProps) {
//   const averagePerDay = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//       {/* Total Spent */}
//       <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium opacity-90">Total Spent</span>
//           <div className="p-2 bg-white bg-opacity-20 rounded-lg">
//             <IndianRupee size={20} />
//           </div>
//         </div>
//         <h3 className="text-3xl font-bold">
//           ₹{totalAmount.toLocaleString("en-IN")}
//         </h3>
//         <p className="text-sm opacity-75 mt-1">{month}</p>
//       </div>

//       {/* Total Expenses */}
//       {/* Total Expenses - FIXED SVG */}
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium text-gray-600">
//             Total Expenses
//           </span>
//           <div className="p-2 bg-blue-100 rounded-lg">
//             <svg
//               className="w-5 h-5 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
//               />
//             </svg>
//           </div>
//         </div>
//         <h3 className="text-3xl font-bold text-gray-800">{totalExpenses}</h3>
//         <p className="text-sm text-gray-500 mt-1">Transactions</p>
//       </div>

//       {/* Average */}
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium text-gray-600">Average</span>
//           <div className="p-2 bg-green-100 rounded-lg">
//             <TrendingUp size={20} className="text-green-600" />
//           </div>
//         </div>
//         <h3 className="text-3xl font-bold text-gray-800">
//           ₹{Math.round(averagePerDay).toLocaleString("en-IN")}
//         </h3>
//         <p className="text-sm text-gray-500 mt-1">Per expense</p>
//       </div>
//     </div>
//   );
// }

import { IndianRupee, TrendingUp, Receipt } from "lucide-react";

interface StatsCardsProps {
  totalAmount: number;
  totalExpenses: number;
  month: string;
}

export default function StatsCards({
  totalAmount,
  totalExpenses,
  month,
}: StatsCardsProps) {
  const averagePerDay = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Spent */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Total Spent</span>
          <div className="p-2 bg-opacity-20 rounded-lg">
            <IndianRupee size={20} />
          </div>
        </div>
        <h3 className="text-3xl font-bold">
          ₹{totalAmount.toLocaleString("en-IN")}
        </h3>
        <p className="text-sm opacity-75 mt-1">{month}</p>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Total Expenses
          </span>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Receipt size={20} className="text-blue-600" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800">{totalExpenses}</h3>
        <p className="text-sm text-gray-500 mt-1">Transactions</p>
      </div>

      {/* Average */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Average</span>
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp size={20} className="text-green-600" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800">
          ₹{Math.round(averagePerDay).toLocaleString("en-IN")}
        </h3>
        <p className="text-sm text-gray-500 mt-1">Per expense</p>
      </div>
    </div>
  );
}
