import React from "react";

function ProtectedRoute() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="max-w-2xl">
        <div className="flex justify-center items-center mb-7">
          <img
            src="./images/something-went-wrong.png"
            alt=""
            className="max-w-sm"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-[#00898B] font-bold text-4xl">
            Opps! Something Went Wrong
          </h2>
          <p className="text-[#8D8D8D] text-base">
            You didn’t break the internet, but we can’t find what are you
            looking for.
          </p>
          <button className="bg-[#00898B] text-white text-base capitalize px-7 py-2.5 rounded-md">
            try again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
