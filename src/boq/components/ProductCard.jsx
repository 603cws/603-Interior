import { useApp } from "../../Context/Context";

function ProductCard({
  products,
  selectedProductView,
  setSelectedProductView,
  setShowProductView,
  userResponses,
}) {
  const { selectedCategory, selectedSubCategory, selectedSubCategory1 } =
    useApp();

  const productsInCategory = products[selectedCategory?.category];

  if (!productsInCategory) {
    return <p>Category "{selectedCategory?.category}" not found.</p>;
  }

  const productsInSubCategory = productsInCategory[selectedSubCategory];

  if (!productsInSubCategory) {
    return (
      <p>
        Subcategory "{selectedSubCategory}" not found in category "
        {selectedCategory?.category}".
      </p>
    );
  }
  console.log("answer for hvac", userResponses.hvacType);
  // Filter products based on `selectedSubCategory1`
  const filteredProducts = productsInSubCategory
    .filter((product) => {
      if (selectedCategory.category === "HVAC") {
        if (userResponses.hvacType === "Centralized") {
          // Only include Centralized AC products for HVAC category
          return product.subcategory1 === "Centralized AC";
        } else {
          // Include products matching selectedSubCategory1 for HVAC category
          return product.subcategory1 === selectedSubCategory1;
        }
      } else {
        // For categories other than HVAC, include products as usual
        return product.subcategory1 === selectedSubCategory1;
      }
    })
    .flatMap((product) => product.product_variants || []); // Flatten the product_variants array

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((variant) => (
          <div
            key={variant.id}
            className="w-11/12 h-full flex flex-col justify-center items-center bg-white rounded-lg shadow-md cursor-pointer my-2 px-3"
          >
            <img
              className="object-contain rounded-t-lg"
              src={variant.image}
              alt={variant.title}
              onClick={() => {
                setSelectedProductView(variant); // Pass product details
                setShowProductView(true); // Open product view
              }}
            />
            <div className="p-4">
              <p
                className="text-sm font-medium text-gray-800"
                onClick={() => {
                  setSelectedProductView(variant); // Pass product details
                  setShowProductView(true); // Open product view
                }}
              >
                {variant.title}
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
