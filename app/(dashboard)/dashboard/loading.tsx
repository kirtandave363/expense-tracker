export default function DashboardLoading() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-pulse">
      {/* Month Selector Skeleton */}
      <div className="bg-white rounded-xl shadow-sm h-16"></div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-200 rounded-xl h-32"></div>
        <div className="bg-gray-200 rounded-xl h-32"></div>
        <div className="bg-gray-200 rounded-xl h-32"></div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-200 rounded-xl h-96"></div>
        <div className="lg:col-span-2 bg-gray-200 rounded-xl h-96"></div>
      </div>

      {/* Expenses List Skeleton */}
      <div className="space-y-4">
        <div className="bg-gray-200 rounded h-8 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
