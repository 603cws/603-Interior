import { useState } from "react";
import { useApp } from "../../Context/Context";

export default function CategoryEditor() {
  const { categoryConfig, updateCategoryConfig } = useApp();

  const handleDeleteSubCategory = (category, subCategory) => {
    if (
      window.confirm(
        `Are you sure you want to delete the rule for "${subCategory}" in "${category}"?`
      )
    ) {
      const newCat = { ...categoryConfig[category] };
      delete newCat[subCategory];

      const newConfig = { ...categoryConfig, [category]: newCat };
      updateCategoryConfig(newConfig);
    }
  };

  const handleAddSubCategory = (category) => {
    const newSubCat = prompt("Enter new subcategory name");
    if (newSubCat && newSubCat.trim()) {
      const newCat = {
        ...categoryConfig[category],
        [newSubCat.trim()]: { exclude: [] },
      };

      const newConfig = { ...categoryConfig, [category]: newCat };
      updateCategoryConfig(newConfig);
    }
  };

  const handleAddCategory = () => {
    const newCat = prompt("Enter new category name");

    if (newCat && newCat.trim()) {
      if (categoryConfig[newCat.trim()]) {
        alert("Category already exists.");
        return;
      }
      const newConfig = { ...categoryConfig, [newCat.trim()]: {} };

      updateCategoryConfig(newConfig);
    }
  };

  const handleDeleteCategory = (category) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${category}" and all its subcategories?`
      )
    ) {
      const newConfig = { ...categoryConfig };
      delete newConfig[category];
      updateCategoryConfig(newConfig);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white font-Poppins">
      <div className="w-full overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-4 px-6">
        <h1 className="text-xl text-[#000] capitalize font-semibold mb-6">
          Category Editor
        </h1>

        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddCategory}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </div>

        {Object.entries(categoryConfig).map(([category, subCats]) => (
          <div
            key={category}
            className="mb-8 border p-4 rounded shadow bg-[#F9F9F9]"
          >
            <div className="flex gap-3 justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="space-y-2 space-x-2">
                <button
                  onClick={() => handleAddSubCategory(category)}
                  className="bg-[#334A78] hover:bg-[#2a3f66] text-white px-3 py-1 rounded"
                >
                  Add Subcategory
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete Category
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(subCats).map(([subCategory, rules]) => {
                return (
                  <div
                    key={subCategory}
                    className=" flex  flex-col lg:flex-row  lg:items-center space-y-2 lg:space-y-0 space-x-3"
                  >
                    <div className="w-48 font-semibold text-[#374A75]">
                      {subCategory}
                    </div>
                    <SubcategoryExcludeInput
                      excludes={rules.exclude || []}
                      onChange={(newExcludes) => {
                        const newConfig = {
                          ...categoryConfig,
                          [category]: {
                            ...categoryConfig[category],
                            [subCategory]: { exclude: newExcludes },
                          },
                        };
                        updateCategoryConfig(newConfig);
                      }}
                    />
                    <button
                      onClick={() =>
                        handleDeleteSubCategory(category, subCategory)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="mt-6 text-sm text-[#3D194F]">
          Note: Changes are live. Change with caution!
        </p>
      </div>
    </div>
  );
}

function SubcategoryExcludeInput({ excludes, onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const newItem = inputValue.trim();
    if (newItem && !excludes.includes(newItem)) {
      onChange([...excludes, newItem]);
      setInputValue("");
    }
  };

  const handleRemove = (itemToRemove) => {
    onChange(excludes.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border border-gray-300 rounded px-2 py-1 w-full">
      {excludes.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center space-x-1"
        >
          <span>{item}</span>
          <button
            type="button"
            onClick={() => handleRemove(item)}
            className="text-blue-800 hover:text-blue-900 font-bold"
            aria-label={`Remove ${item}`}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add exclude and press enter"
        className="flex-grow min-w-[80px] outline-none p-1 border-none"
        style={{ minWidth: "0" }}
      />
    </div>
  );
}
