import BestSellingSection from "./BestSellingSection";
import SalesSection from "./SalesSection";
import StatsSection from "./StatsSection";
import Transactions from "./Transactions";

function EcomDashHome({
  allusers,
  sidebarDispatch,
  setSelectedOrder,
  handleProductPreview,
}) {
  return (
    <>
      <StatsSection allusers={allusers} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Transactions
          sidebarDispatch={sidebarDispatch}
          onOrderSelect={(order) => {
            setSelectedOrder(order);
            sidebarDispatch({
              type: "TOGGLE_SECTION",
              payload: "Orders",
            });
          }}
        />
        <SalesSection />
      </div>
      <BestSellingSection
        sidebarDispatch={sidebarDispatch}
        handleProductPreview={handleProductPreview}
      />
    </>
  );
}

export default EcomDashHome;
