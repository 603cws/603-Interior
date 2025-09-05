// src/pages/FormulaEditor.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";

export default function FormulaEditor() {
  const { formulaMap, refetchFormulas } = useApp();
  const [editing, setEditing] = useState({});
  const [newFormula, setNewFormula] = useState({
    category: "",
    formula: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("name");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data.map((cat) => cat.name));
    }
  };

  const formulas = Object.entries(formulaMap).map(([category, value]) => ({
    id: category,
    category,
    formula: typeof value === "object" ? value.formula : value,
    description: typeof value === "object" ? value.description : "",
  }));

  const updateFormula = async (category, field, value) => {
    const { error } = await supabase
      .from("formulas")
      .update({ [field]: value })
      .eq("category", category);
    if (error) console.error("Error updating formula:", error);
    else await refetchFormulas();
  };

  const deleteFormula = async (category) => {
    if (window.confirm("Are you sure you want to delete this formula?")) {
      const { error } = await supabase
        .from("formulas")
        .delete()
        .eq("category", category);
      if (error) console.error("Error deleting formula:", error);
      else await refetchFormulas();
    }
  };

  const addFormula = async () => {
    const { category, formula, description } = newFormula;
    if (!category || !formula)
      return alert("Category and formula are required.");

    const { error } = await supabase
      .from("formulas")
      .insert([{ category, formula, description }]);
    if (error) console.error("Error adding formula:", error);
    else {
      await refetchFormulas();
      setNewFormula({ category: "", formula: "", description: "" });
    }
  };

  // Filter out categories already used in formulas
  const usedCategories = Object.keys(formulaMap);
  const availableCategories = categories.filter(
    (cat) => !usedCategories.includes(cat)
  );

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white font-Poppins">
      <div className="w-full overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-2">
        <div>
          <div className="text-xl text-[#000] capitalize font-semibold border-b-2 border-b-[#CCCCCC] px-4 py-2">
            <h2>Formula Editor</h2>
          </div>

          <div className="lg:grid grid-cols-[1fr,2fr] gap-4">
            {/* Left Column - Add New Formula */}
            <div className="mx-4 my-2">
              <div className="bg-gradient-to-br from-[#334A78] to-[#68B2DC] p-4 rounded-lg mb-4">
                <h3 className="text-[#fff] font-semibold text-xl mb-5">
                  Add New Formula
                </h3>
                <div className="flex flex-col gap-5">
                  <select
                    className={`border w-full px-3 py-2 ${
                      newFormula.category === ""
                        ? "text-gray-400"
                        : "text-black"
                    }`}
                    value={newFormula.category}
                    onChange={(e) =>
                      setNewFormula((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    className="border w-full px-3 py-2"
                    placeholder="Formula (e.g., base * multiplier * 2)"
                    value={newFormula.formula}
                    onChange={(e) =>
                      setNewFormula((prev) => ({
                        ...prev,
                        formula: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="border w-full px-3 py-2"
                    placeholder="Description"
                    value={newFormula.description}
                    onChange={(e) =>
                      setNewFormula((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="bg-[#374A75] text-white w-full py-2 rounded mt-2"
                    onClick={addFormula}
                  >
                    Add Formula
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Table of Formulas */}
            <div className="px-4">
              <div className="bg-[#F9F9F9] p-4 my-2">
                <h4 className="border-b-2 border-b-[#000] text-[#000] font-semibold text-lg capitalize mb-2">
                  Existing Formulas
                </h4>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full bg-[#fff]">
                    <thead className="">
                      <tr className="">
                        <th className="border-b p-2 text-left">Category</th>
                        <th className="border-b p-2 text-left">Formula</th>
                        <th className="border-b p-2 text-left">Description</th>
                        <th className="border-b p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="3xl:[&_td]:py-4">
                      {formulas.map((f) => (
                        <tr key={f.id} className="">
                          <td className="p-2 border-r text-[#A1A1A1] font-semibold">
                            {f.category}
                          </td>
                          <td className="p-2 border-r text-[#A1A1A1] font-semibold">
                            <input
                              className="w-full px-2 py-1"
                              value={editing[f.id]?.formula ?? f.formula}
                              onChange={(e) =>
                                setEditing((prev) => ({
                                  ...prev,
                                  [f.id]: {
                                    ...prev[f.id],
                                    formula: e.target.value,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td className="p-2 border-r text-[#A1A1A1] font-semibold">
                            <input
                              className="w-full px-2 py-1"
                              value={
                                editing[f.id]?.description ?? f.description
                              }
                              onChange={(e) =>
                                setEditing((prev) => ({
                                  ...prev,
                                  [f.id]: {
                                    ...prev[f.id],
                                    description: e.target.value,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td className=" p-2 space-x-2 text-[#A1A1A1] font-semibold">
                            <button
                              className="bg-[#374A75] text-white px-3 py-1 rounded"
                              onClick={() => {
                                const edit = editing[f.id] || {};
                                updateFormula(
                                  f.category,
                                  "formula",
                                  edit.formula ?? f.formula
                                );
                                updateFormula(
                                  f.category,
                                  "description",
                                  edit.description ?? f.description
                                );
                                setEditing((prev) => ({
                                  ...prev,
                                  [f.id]: undefined,
                                }));
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="bg-[#FA343A] text-white px-3 py-1 rounded"
                              onClick={() => deleteFormula(f.category)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden">
                  {formulas.map((formula) => (
                    <FormulaCard
                      key={formula.id}
                      formula={formula}
                      editing={editing}
                      setEditing={setEditing}
                      updateFormula={updateFormula}
                      deleteFormula={deleteFormula}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-[#F5F5FF] rounded-md p-3 text-sm text-[#3D194F]">
                <p className="font-semibold mb-1">Formula Terminology:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Base:</strong> Can be <em>Area</em>,{" "}
                    <em>Quantity</em>, or a combination like{" "}
                    <code>
                      <em>Area * Quantity</em>
                    </code>
                    .
                  </li>
                  <li>
                    <strong>Multiplier:</strong> Refers to the{" "}
                    <em>Product Price</em> or unit rate applied to the base.
                  </li>
                  <li>
                    Example: <code>Furniture(Default) </code> →{" "}
                    <code>base * multiplier </code> →<code> 25 * 50 </code> →
                    <code> 1250</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormulaCard({
  formula,
  editing,
  setEditing,
  updateFormula,
  deleteFormula,
}) {
  const currentEdit = editing[formula.id] || {};

  return (
    <div className="bg-white rounded-lg shadow p-2 mb-3 flex justify-between items-center gap-1">
      <div className="flex-1">
        <p className="font-semibold text-lg mb-2">{formula.category}</p>

        <input
          className=" w-full py-2 mb-2 text-sm text-[#A1A1A1] font-semibold"
          value={currentEdit.formula ?? formula.formula}
          onChange={(e) =>
            setEditing((prev) => ({
              ...prev,
              [formula.id]: {
                ...prev[formula.id],
                formula: e.target.value,
              },
            }))
          }
        />
        <input
          className=" w-full py-2 mb-4 text-sm text-[#A1A1A1] font-semibold"
          value={currentEdit.description ?? formula.description}
          onChange={(e) =>
            setEditing((prev) => ({
              ...prev,
              [formula.id]: {
                ...prev[formula.id],
                description: e.target.value,
              },
            }))
          }
        />
      </div>
      <div className="flex gap-1">
        <button
          className="bg-[#374A75] text-[#fff] px-2 py-1 rounded text-[10px] sm:text-sm"
          onClick={() => {
            updateFormula(
              formula.category,
              "formula",
              currentEdit.formula ?? formula.formula
            );
            updateFormula(
              formula.category,
              "description",
              currentEdit.description ?? formula.description
            );
            setEditing((prev) => ({ ...prev, [formula.id]: undefined }));
          }}
        >
          Save
        </button>
        <button
          className="bg-[#FA343A] text-[#fff] px-2 py-0 rounded text-[10px] sm:text-sm"
          onClick={() => deleteFormula(formula.category)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
