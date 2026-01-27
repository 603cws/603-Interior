import { useState } from "react";
import { supabase } from "../../services/supabase";
import { useBoqApp } from "../../Context/BoqContext";
import toast from "react-hot-toast";

export default function CategoryEditor() {
  const { categoryConfig, setCategoryConfig } = useBoqApp();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addTarget, setAddTarget] = useState(null);

  const handleDeleteSubCategory = (category, subCategory) => {
    const newCat = { ...categoryConfig[category] };
    delete newCat[subCategory];

    const newConfig = { ...categoryConfig, [category]: newCat };
    updateCategoryConfig(newConfig);
  };

  const updateCategoryConfig = async (newConfig) => {
    setCategoryConfig(newConfig);
    const { error } = await supabase
      .from("category_config")
      .update({ config_data: newConfig, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) {
      console.error("Error updating config:", error);
    }
  };

  const handleAddSubCategory = (category, name) => {
    const newConfig = {
      ...categoryConfig,
      [category]: {
        ...categoryConfig[category],
        [name]: { exclude: [] },
      },
    };

    updateCategoryConfig(newConfig);
  };

  const handleAddCategory = (name) => {
    if (categoryConfig[name]) {
      toast.error("Category already exists.");
      return;
    }
    const newConfig = { ...categoryConfig, [name]: {} };

    updateCategoryConfig(newConfig);
  };

  const handleDeleteCategory = (category) => {
    const newConfig = { ...categoryConfig };
    delete newConfig[category];
    updateCategoryConfig(newConfig);
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white font-Poppins">
      <div className="w-full overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-4 px-6">
        <h1 className="text-xl text-[#000] capitalize font-semibold mb-6">
          Category Editor
        </h1>

        <p className="mt-6 text-sm text-[#3D194F]">
          Note: Changes are live. Change with caution!
        </p>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setAddTarget({ type: "category" })}
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
            <div className="md:flex gap-3 justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setAddTarget({
                      type: "subcategory",
                      category,
                    })
                  }
                  className="bg-[#334A78] hover:bg-[#2a3f66] text-white px-3 py-1 rounded text-sm md:text-base"
                >
                  Add Subcategory
                </button>
                <button
                  onClick={() =>
                    setDeleteTarget({
                      type: "category",
                      category,
                    })
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm md:text-base"
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
                    className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 md:space-x-3 border rounded md:border-none p-1 md:p-0"
                  >
                    <div className="flex justify-between md:w-48">
                      <p className="font-semibold text-[#374A75] ">
                        {subCategory}
                      </p>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: "subcategory",
                            category,
                            subCategory,
                          })
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded md:hidden text-sm md:text-base"
                        title="Delete"
                      >
                        Delete
                      </button>
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
                        setDeleteTarget({
                          type: "subcategory",
                          category,
                          subCategory,
                        })
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded hidden md:block"
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
      </div>
      {addTarget && (
        <AddCategoryModal
          addTarget={addTarget}
          setAddTarget={setAddTarget}
          addCategory={handleAddCategory}
          addSubCategory={handleAddSubCategory}
        />
      )}

      {deleteTarget && (
        <DeleteWarning
          deleteTarget={deleteTarget}
          setDeleteTarget={setDeleteTarget}
          handleDeleteCategory={handleDeleteCategory}
          handleDeleteSubCategory={handleDeleteSubCategory}
        />
      )}
    </div>
  );
}

function SubcategoryExcludeInput({ excludes, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleAdd = () => {
    const newItem = inputValue.trim();
    if (newItem && !excludes.includes(newItem)) {
      onChange([...excludes, newItem]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border border-gray-300 rounded px-2 py-1 md:w-full">
      {excludes.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center space-x-1 text-sm md:text-base"
        >
          <span>{item}</span>
          <button
            type="button"
            onClick={() => setItemToRemove(item)}
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

      {itemToRemove && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded max-w-sm w-full">
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to remove <b>{itemToRemove}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 text-sm bg-gray-200 rounded"
                onClick={() => setItemToRemove(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                onClick={() => {
                  onChange(excludes.filter((item) => item !== itemToRemove));
                  setItemToRemove(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteWarning({
  deleteTarget,
  setDeleteTarget,
  handleDeleteCategory,
  handleDeleteSubCategory,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-[400px]">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Confirm Deletion
        </h3>

        <p className="text-sm text-gray-700 mb-4">
          {deleteTarget.type === "category" ? (
            <>
              Are you sure you want to delete the category{" "}
              <b>{deleteTarget.category}</b> and all its subcategories?
            </>
          ) : (
            <>
              Are you sure you want to delete the subcategory{" "}
              <b>{deleteTarget.subCategory}</b> from{" "}
              <b>{deleteTarget.category}</b>?
            </>
          )}
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              if (deleteTarget.type === "category") {
                handleDeleteCategory(deleteTarget.category);
              } else {
                handleDeleteSubCategory(
                  deleteTarget.category,
                  deleteTarget.subCategory,
                );
              }
              setDeleteTarget(null);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCategoryModal({
  addTarget,
  setAddTarget,
  addCategory,
  addSubCategory,
}) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (addTarget.type === "category") {
      addCategory(trimmed);
    } else {
      addSubCategory(addTarget.category, trimmed);
    }

    setValue("");
    setAddTarget(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-[380px]">
        <h3 className="text-lg font-semibold mb-3">
          {addTarget.type === "category"
            ? "Add Category"
            : `Add Subcategory to ${addTarget.category}`}
        </h3>

        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter name"
          className="w-full border px-3 py-2 rounded mb-4 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setAddTarget(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
