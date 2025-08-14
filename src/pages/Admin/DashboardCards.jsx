import Spinner from "../../common-components/Spinner";

function DashboardCards({
  totalclients,
  totalVendors,
  vendors,
  clients,
  products,
  addons,
  handleproduct,
}) {
  if (!totalclients || !totalVendors) {
    return <Spinner />;
  }

  const pendingproduct = products.filter(
    (product) => product.status === "pending"
  );

  const pendingAddons = addons.filter((addon) => addon.status === "pending");

  return (
    // <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        onClick={clients}
        className="bg-gradient-to-r from-[#6BE4FC] to-[#4AF3DF] text-white p-5  flex flex-col gap-3 justify-between w-full h-full relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer rounded-sm"
      >
        <h2 className="self-start text-xl font-bold">Client</h2>
        <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
          {totalclients.length}
        </h1>
        <img
          src="/images/dashboard-client.png"
          alt=""
          className="absolute left-2 bottom-4 h-32 w-32 opacity-50"
        />
      </div>

      <div
        onClick={vendors}
        className="bg-gradient-to-r from-[#6BAAFC] to-[#4A80F3] text-white p-7 flex flex-col gap-3 justify-betweenw-full h-full relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer rounded-sm"
      >
        <h2 className="self-start text-xl font-bold">Vendor</h2>
        <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
          {totalVendors.length}
        </h1>
        <img
          src="/images/dashboard-vendor.png"
          alt=""
          className="absolute left-2 bottom-4 h-32 w-32 opacity-50"
        />
      </div>

      <div
        onClick={handleproduct}
        className="bg-gradient-to-br from-[#EF5E7A] to-[#D35385] text-white p-7 flex flex-col gap-3 justify-between w-full h-full relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer rounded-sm"
      >
        <h2 className="self-start text-xl font-bold">Pending Products</h2>
        <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
          {pendingproduct.length}
        </h1>
        <img
          src="/images/dashboard-orders.png"
          alt=""
          className="absolute left-2  bottom-4 h-32 w-32 opacity-50"
        />
      </div>

      <div
        onClick={handleproduct}
        className="bg-gradient-to-br from-[#D623FE] to-[#A530F2] text-white p-7 flex flex-col gap-3 justify-between w-full h-full relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer rounded-sm"
      >
        <h2 className="self-start text-xl font-bold">Pending Addons</h2>
        <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
          {pendingAddons.length}
        </h1>
        <img
          src="/images/dashboard-new-orders.png"
          alt=""
          className="absolute left-2  bottom-4 h-32 w-32 opacity-50"
        />
      </div>
    </div>
    // </div>
  );
}

export default DashboardCards;
