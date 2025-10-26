import { getAllEMIs } from "@/actions/emiActions";
import AddEMIForm from "@/components/AddEMIForm";
import EMICard from "@/components/EMICard";
import { getUserFromToken } from "@/lib/auth";

export default async function EMIsPage() {
  const [user, data] = await Promise.all([getUserFromToken(), getAllEMIs()]);

  const firstName = user?.name.split(" ")[0] || "User";
  const activeEMIs = data.emis.filter((emi) => emi.isActive);
  const inactiveEMIs = data.emis.filter((emi) => !emi.isActive);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">EMI Management 💳</h1>
        <p className="text-indigo-100">
          Manage your recurring payments, {firstName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total EMIs</p>
          <p className="text-3xl font-bold text-gray-800">{data.emis.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active EMIs</p>
          <p className="text-3xl font-bold text-green-600">
            {activeEMIs.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Monthly Total</p>
          <p className="text-3xl font-bold text-indigo-600">
            ₹
            {activeEMIs
              .reduce((sum, emi) => sum + emi.amount, 0)
              .toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add EMI Form */}
        <div className="lg:col-span-1">
          <AddEMIForm />
        </div>

        {/* EMI Lists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active EMIs */}
          {activeEMIs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Active EMIs ({activeEMIs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeEMIs.map((emi) => (
                  <EMICard key={emi._id} emi={emi} />
                ))}
              </div>
            </div>
          )}

          {/* Inactive EMIs */}
          {inactiveEMIs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Inactive EMIs ({inactiveEMIs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inactiveEMIs.map((emi) => (
                  <EMICard key={emi._id} emi={emi} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.emis.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No EMIs Yet
              </h3>
              <p className="text-gray-600">
                Add your first EMI to start automatic expense tracking!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
