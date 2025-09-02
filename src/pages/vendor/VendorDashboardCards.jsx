import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import Spinner from "../../common-components/Spinner";
import { useApp } from "../../Context/Context";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { baseImageUrl } from "../../utils/HelperConstant";
import RejectedProduct from "./RejectedProduct";
function VendorDashboardCards({ handleproduct }) {
  // loading
  const [isloading, setIsloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [pendingproducts, setPendingproducts] = useState([]);
  const [pendingAddons, setPendingAddons] = useState([]);
  const [rejectedProductView, setRejectedProductView] = useState(false);
  const [rejectedProduct, setRejectedProduct] = useState();

  const { accountHolder } = useApp();
  // Fetch Products from Supabase
  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*")
        .eq("vendor_id", accountHolder.userId);

      const getpendingproducts = data.filter((el) => el.status === "pending");

      setPendingproducts(getpendingproducts);

      setProducts(data);

      console.log(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data } = await supabase
        .from("addon_variants")
        .select("*")
        .eq("vendorId", accountHolder.userId);
      console.log(data);

      const getpendingAddons = data.filter((el) => el.status === "pending");

      setAddons(data);
      setPendingAddons(getpendingAddons);
      console.log("Addons: ", data);
    } catch (error) {
      console.log("Error fetching addons:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAddons();
  }, []);

  const cardsDetails = [
    {
      id: 1,
      item: products,
      title: "products",
      imgpath: "/images/vendorproduct.png",
      className: "bg-[#B4DFFF]",
    },
    {
      id: 2,
      item: addons,
      title: "addons",
      imgpath: "/images/vendoraddon.png",
      className: "bg-[#D8FFD8]",
    },
    {
      id: 3,
      item: pendingproducts,
      title: "pending products",
      imgpath: "/images/dashboard-orders.png",
      className: "bg-[#D8F7FF]",
    },
    {
      id: 4,
      item: pendingAddons,
      title: "pending Addons",
      imgpath: "/images/dashboard-orders.png",
      className: "bg-[#D8F7FF]",
    },
  ];

  function handlerejectedProduct(item) {
    setRejectedProduct(item);
    setRejectedProductView((prev) => !prev);
  }

  if (isloading) {
    return <Spinner />;
  }
  return (
    <div className="text-[#194F48]">
      <div className="flex flex-col gap-4 overflow-auto h-[calc(100vh-170px)] scrollbar-hide sm:h-auto mb-6">
        <div className="grid grid-cols-2 md:flex   gap-4 font-Poppins">
          {cardsDetails.map((card) => (
            <Card
              handleproduct={handleproduct}
              item={card?.item}
              imgpath={card?.imgpath}
              className={card?.className}
              title={card?.title}
              key={card?.id}
            />
          ))}
        </div>
        {products?.concat(addons)?.length > 0 && (
          <div className="flex justify-center sm:block">
            <ProductTable
              products={products}
              addons={addons}
              handlerejectedProduct={handlerejectedProduct}
            />
          </div>
        )}
      </div>

      {rejectedProductView && (
        <RejectedProduct
          onClose={() => setRejectedProductView(false)}
          product={rejectedProduct}
        />
      )}
    </div>
  );
}

const products = [
  {
    title: "Handmade Pouch",
    price: "$121.00",
    status: "Unapproved",
    date: "12 Dec 2023",
  },
  {
    title: "Smartwatch E2",
    price: "$590.00",
    status: "Unapproved",
    date: "1 Dec 2023",
  },
  {
    title: "Smartwatch E1",
    price: "$125.00",
    status: "Pending",
    date: "10 Nov 2023",
  },
  {
    title: "Headphone G1 Pro",
    price: "$348.00",
    status: "Pending",
    date: "2 Nov 2023",
  },
  {
    title: "Iphone X",
    price: "$607.00",
    status: "Completed",
    date: "7 Sep 2023",
  },

  // Extra unique products
  {
    title: "Gaming Laptop X15",
    price: "$1,250.00",
    status: "Pending",
    date: "14 Jan 2024",
  },
  {
    title: "Bluetooth Speaker Mini",
    price: "$80.00",
    status: "Completed",
    date: "5 Feb 2024",
  },
  {
    title: "4K Monitor UltraWide",
    price: "$740.00",
    status: "Unapproved",
    date: "21 Mar 2024",
  },
  {
    title: "Ergonomic Chair",
    price: "$299.00",
    status: "Pending",
    date: "8 Apr 2024",
  },
  {
    title: "Mechanical Keyboard RGB",
    price: "$150.00",
    status: "Completed",
    date: "18 Apr 2024",
  },
  {
    title: "Drone Pro 2",
    price: "$980.00",
    status: "Pending",
    date: "9 May 2024",
  },
  {
    title: "Portable Power Bank 20000mAh",
    price: "$45.00",
    status: "Completed",
    date: "22 May 2024",
  },
  {
    title: "Smart Home Hub",
    price: "$210.00",
    status: "Unapproved",
    date: "4 Jun 2024",
  },
  {
    title: "Noise Cancelling Earbuds",
    price: "$130.00",
    status: "Pending",
    date: "15 Jun 2024",
  },
  {
    title: "Fitness Tracker Band 5",
    price: "$55.00",
    status: "Completed",
    date: "25 Jun 2024",
  },
  {
    title: "Smart Coffee Maker",
    price: "$165.00",
    status: "Unapproved",
    date: "1 Jul 2024",
  },
  {
    title: "Portable Projector Mini",
    price: "$420.00",
    status: "Pending",
    date: "9 Jul 2024",
  },
  {
    title: "Electric Scooter X7",
    price: "$750.00",
    status: "Completed",
    date: "18 Jul 2024",
  },
  {
    title: "Action Camera 4K",
    price: "$310.00",
    status: "Pending",
    date: "3 Aug 2024",
  },
  {
    title: "Wireless Charging Pad",
    price: "$35.00",
    status: "Completed",
    date: "12 Aug 2024",
  },
  {
    title: "Smart LED Light Strip",
    price: "$29.00",
    status: "Unapproved",
    date: "20 Aug 2024",
  },
  {
    title: "VR Headset Pro",
    price: "$680.00",
    status: "Pending",
    date: "30 Aug 2024",
  },
  {
    title: "Air Purifier Max",
    price: "$240.00",
    status: "Completed",
    date: "5 Sep 2024",
  },
];

const statusColors = {
  rejected: "bg-orange-100 text-orange-600",
  pending: "bg-sky-100 text-sky-600",
  approved: "bg-green-100 text-green-600",
};

// Function to convert ISO string to "DD Mon YYYY"
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProductTable({ products, addons, handlerejectedProduct }) {
  const items = products?.concat(addons) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(items?.length / itemsPerPage || 1);

  const paginatedProducts = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className=" max-w-xs sm:max-w-none  bg-white p-4 rounded-lg shadow border  md:h-[calc(100vh-350px)] flex flex-col">
      {/* <div className="bg-white p-4 rounded-lg shadow border h-[400px] flex flex-col"> */}
      {/* Top header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Product Review</h2>
        {/* <div className="flex gap-2">
          <button className="border px-3 py-1 rounded text-sm">
            Select Date
          </button>
          <button className="border px-3 py-1 rounded text-sm">Filters</button>
        </div> */}
      </div>

      {/* Scrollable table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b sticky top-0 bg-white z-10">
            <tr>
              <th className="py-3 px-2">Item</th>
              <th className="py-3 px-2">Price</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts?.map((product, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="py-3 px-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded">
                    <img
                      src={`${baseImageUrl}/${product?.image}`}
                      alt="product "
                      className="w-full h-full"
                    />
                  </div>
                  {product?.title}
                </td>
                <td className="py-3 px-2">{product?.price}</td>
                <td className="py-3 px-2">
                  <div
                    onClick={() =>
                      product?.status === "rejected" &&
                      handlerejectedProduct(product)
                    }
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[product?.status]
                      } ${product?.status === "rejected" && "cursor-pointer"} `}
                    >
                      {product?.status}
                    </span>
                  </div>
                </td>
                {/* <td className="py-3 px-2">
                  {product?.created_at || product?.date}
                </td> */}
                <td className="py-3 px-2">{formatDate(product?.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center mt-4 text-sm text-gray-500">
        <p>
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, items.length)} from{" "}
          {items.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          {/* {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))} */}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1) ? (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-blue-600 text-white" : ""
                }`}
              >
                {page}
              </button>
            ) : page === currentPage + 2 || page === currentPage - 2 ? (
              <span key={page} className="px-2">
                ...
              </span>
            ) : null
          )}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ handleproduct, item, imgpath, className, title }) {
  return (
    <div
      onClick={() => handleproduct()}
      className={`rounded-lg p-7 flex flex-col justify-between lg:h-48 lg:w-40 xl:h-48 xl:w-52 relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer  ${className}`}
    >
      <h2 className="self-center text-xl tracking-wide font-medium capitalize">
        {title}
      </h2>
      <h1 className="self-end justify-end  font-medium text-3xl xl:text-6xl">
        {item?.length}
      </h1>
      <img
        src={imgpath}
        alt="vendor products"
        className="absolute left-2 bottom-6 lg:bottom-10 h-18 w-20 lg:h-24 lg:w-24 opacity-50"
      />
    </div>
  );
}

export default VendorDashboardCards;
