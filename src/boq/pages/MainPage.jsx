import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

const MainPage = ({ selectedCategory }) => {
  const [subCat1, setSubCat1] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("name,subCat1");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      // Transform data into key-value pairs
      const transformedData = data.reduce((acc, item) => {
        acc[item.name] = item.subCat1 ? JSON.parse(item.subCat1) : [];
        return acc;
      }, {});
      setSubCat1(transformedData);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  const selectedSubCategories =
    subCat1 && subCat1[selectedCategory.category]
      ? subCat1[selectedCategory.category]
      : [];

  return (
    <div className="flex flex-row gap-2 items-center justify-start relative overflow-hidden mt-3">
      {selectedSubCategories && selectedSubCategories.length > 0 ? (
        selectedSubCategories.map((subCategory, index) => (
          <div
            key={index}
            className="bg-[#a9d3ce] border-solid border-[#000000] border flex flex-col justify-start shrink-0 relative"
          >
            <div className="flex flex-row items-center justify-center self-stretch relative overflow-hidden">
              <button className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-md leading-[30px] font-normal relative flex items-center justify-center px-7">
                {subCategory}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No subcategories available for {selectedCategory.category}.
        </div>
      )}
    </div>
  );
};

export default MainPage;
