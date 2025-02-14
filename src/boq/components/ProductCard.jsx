import { useEffect, useState } from "react";
import { useApp } from "../../Context/Context";

function ProductCard({
  products,
  selectedProductView,
  setSelectedProductView,
  setShowProductView,
  userResponses,
}) {
  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    selectedPlan,
  } = useApp();

  const productsInCategory = products[selectedCategory?.category];
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({}); // Track image loading

  const productsInSubCategory = productsInCategory[selectedSubCategory];

  // Move `filteredProducts` ABOVE useEffect
  const filteredProducts = productsInSubCategory
    .filter((product) => {
      if (selectedCategory.category === "HVAC") {
        if (userResponses.hvacType === "Centralized") {
          return product.subcategory1 === "Centralized AC";
        } else {
          return product.subcategory1 === selectedSubCategory1;
        }
      } else {
        return product.subcategory1 === selectedSubCategory1;
      }
    })
    .flatMap((product) => product.product_variants || []);

  // Now filter variants based on the selected plan.
  // If the plan is "Custom", show all variants. Otherwise, only show variants whose segment matches the selected plan.
  const filteredVariants = filteredProducts.filter((variant) => {
    if (selectedPlan === "Custom") return true;
    // If you use "Executive" in the UI but store "Exclusive" in the DB, map accordingly.
    let requiredSegment =
      selectedPlan === "Executive" ? "Exclusive" : selectedPlan;
    return (
      variant.segment &&
      variant.segment.toLowerCase() === requiredSegment.toLowerCase()
    );
  });

  useEffect(() => {
    setLoading(filteredVariants.length === 0);
  }, [filteredVariants]);

  if (!productsInCategory) {
    return <p>Category "{selectedCategory?.category}" not found.</p>;
  }

  if (!productsInSubCategory) {
    return (
      <p>
        Subcategory "{selectedSubCategory}" not found in category "
        {selectedCategory?.category}".
      </p>
    );
  }

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="product-card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-6 pb-8 pt-3 px-8">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className=" flex flex-col justify-center items-center bg-white rounded-lg shadow-md my-2 px-3"
          >
            {/* Image Skeleton */}
            <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-t-lg"></div>
            <div className="p-4 w-full">
              <div className="h-4 bg-gray-300 animate-pulse w-3/4 mb-2 rounded"></div>
              <div className="h-4 bg-gray-300 animate-pulse w-1/2 rounded"></div>
            </div>
          </div>
        ))
      ) : filteredVariants.length > 0 ? (
        filteredVariants.map((variant) => (
          <div
            key={variant.id}
            className="max-w-sm flex flex-col justify-center items-center bg-white rounded-lg shadow-md cursor-pointer my-2 px-3 
              hover:rounded-lg-21 hover:bg-custom-gradient hover:shadow-custom transition-all duration-300 border-2 relative"
          >
            {variant.segment && (
              <div
                className={`absolute top-1 left-1 font-bold font-Poppins text-sm px-5 py-1.5 text-white z-10 ${
                  variant.segment === "Minimal"
                    ? "bg-gray-500"
                    : variant.segment === "Luxury"
                    ? "bg-yellow-500"
                    : "bg-purple-600"
                }`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                }}
              >
                <h4>{variant.segment}</h4>
              </div>
            )}

            {/* Image with Skeleton */}
            <div className="w-full aspect-[4/3] rounded-t-lg relative">
              {loadingImages[variant.id] !== false && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg"></div>
              )}
              <img
                className={` rounded-t-lg w-full h-64 object-contain transition-opacity duration-300 ${
                  loadingImages[variant.id] !== false
                    ? "opacity-0"
                    : "opacity-100"
                }`}
                src={variant.image}
                alt={variant.title}
                onLoad={() => handleImageLoad(variant.id)}
                onClick={() => {
                  setSelectedProductView(variant);
                  setShowProductView(true);
                }}
              />
            </div>
            {/* Product Name */}
            <div className="p-4">
              <p
                className="text-sm font-medium text-gray-800 capitalize"
                onClick={() => {
                  setSelectedProductView(variant);
                  setShowProductView(true);
                }}
              >
                {variant.title.toLowerCase()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No products found for "{selectedSubCategory1}" in "
          {selectedSubCategory}".
        </p>
      )}
    </div>
  );
}

export default ProductCard;
