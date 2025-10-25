function SalesSection() {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4">
      <h2 className="font-semibold text-gray-700 mb-4">Last 7 Days Sales</h2>
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-sm text-gray-500">Items Sold</p>
          <p className="text-lg font-semibold text-gray-800">1,259</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-lg font-semibold text-gray-800">$12,546</p>
        </div>
      </div>
      {/* Bar chart mockup */}
      <div className="h-40 flex items-end justify-between">
        {[40, 70, 55, 85, 65, 95, 80].map((h, i) => (
          <div
            key={i}
            className="w-6 bg-blue-600 rounded-t-md relative"
            style={{ height: `${h}%` }}
          >
            {i === 4 && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1">
                $2,525
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesSection;
