import React from "react";

function DashboardInbox({ viewDetails, products }) {
  console.log("products", products);

  const filteredpending = products.filter(
    (product) => product.status === "pending"
  );

  console.log(filteredpending);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-10 font-Poppins lg:h-[240px] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#252733]">Inbox</h3>
          <p className="text-[#9FA2B4] text-xs">
            Waiting:<span className="text-[#4B506D]">for approve</span>
          </p>
        </div>
        <button
          onClick={viewDetails}
          className="text-[#3751FF] hover:text-blue-700 font-bold"
        >
          View Details
        </button>
      </div>
      {/* <div className="flex gap-3 justify-between items-center my-5 py-2 border-b-2 hover:bg-gray-100">
        <p className="text-[#252733]">Waiting for approve product#12345</p>
        <span className="text-[#9FA2B4]">4:39</span>
      </div>
      <div className="flex gap-3 justify-between items-center my-5 py-2 border-b-2 hover:bg-gray-100">
        <p className="text-[#252733]">Waiting for approve order#22234</p>
        <span className="text-[#9FA2B4]">11:07</span>
      </div> */}

      {filteredpending.map((product) => {
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
  );
}

export default DashboardInbox;
