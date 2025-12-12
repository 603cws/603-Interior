function DashboardInbox({ viewDetails, products }) {
  const filteredpending = products
    ?.filter((product) => product.status === "pending")
    .slice(0, 20);

  return (
    <div className="bg-white rounded-sm shadow-sm font-Poppins lg:h-[300px] overflow-y-auto scrollbar-hide border p-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#252733]">Inbox</h3>
          <p className="text-[#9FA2B4] text-xs capitalize">
            Waiting:<span className="text-[#4B506D]">for approve</span>
          </p>
        </div>
        <button
          onClick={viewDetails}
          className="text-[#3751FF] hover:text-blue-700 font-bold hover:underline"
        >
          View All
        </button>
      </div>
      {!filteredpending && <div>Loading .......</div>}
      <div className="overflow-y-auto h-96 mb-3 lg:mb-0">
        {filteredpending?.map((product) => {
          return (
            <div
              key={product.id}
              className="flex gap-3 justify-between items-center my-5 py-2 border-b-2 hover:bg-gray-100"
            >
              <p className="text-[#252733]">
                {product.products?.subcategory1}-{product.title}
              </p>
              <span className="text-[#9FA2B4]">
                {product.created_at.split("T")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardInbox;
