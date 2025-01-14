function ProductCard({ products, selectedCategory, selectedSubCategory, selectedSubCategory1, selectedProductView, setSelectedProductView, setShowProductView }) {
  const productsInCategory = products[selectedCategory?.category];

  if (!productsInCategory) {
    return <p>Category "{selectedCategory?.category}" not found.</p>;
  }

  const productsInSubCategory = productsInCategory[selectedSubCategory];

  if (!productsInSubCategory) {
    return <p>Subcategory "{selectedSubCategory}" not found in category "{selectedCategory?.category}".</p>;
  }

  // Filter products based on `selectedSubCategory1`
  const filteredProducts = productsInSubCategory
    .filter((product) => product.subcategory1 === selectedSubCategory1)
    .flatMap((product) => product.product_variants || []); // Flatten the product_variants array

  console.log("filteredProducts: ", filteredProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((variant) => (
          <div
            key={variant.id}
            className="flex flex-col max-w-xs bg-white rounded-lg shadow-md"
          >
            <img
              src={variant.image}
              alt={variant.title}
              className="w-full h-64 object-cover rounded-t-lg"
              onClick={() => {
                setSelectedProductView(variant); // Pass product details
                setShowProductView(true); // Open product view
              }}
            />
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-800"
                onClick={() => {
                  setSelectedProductView(variant); // Pass product details
                  setShowProductView(true); // Open product view
                }}
              >{variant.title}</h2>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No products found for "{selectedSubCategory1}" in "{selectedSubCategory}".
        </p>
      )}
    </div>
  );
}

export default ProductCard;
