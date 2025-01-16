import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

const MainPage = ({ selectedCategory, selectedSubCategory1, setSelectedSubCategory1 }) => {
    const [subCat1, setSubCat1] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Automatically select the first subcategory when the category changes
        if (subCat1 && selectedCategory?.category) {
            const subCategories = subCat1[selectedCategory.category];
            if (subCategories && subCategories.length > 0) {
                if (!selectedSubCategory1 || !subCategories.includes(selectedSubCategory1)) {
                    setSelectedSubCategory1(subCategories[0]); // Set the first subcategory as default
                }
            } else {
                setSelectedSubCategory1(null);
            }
        }
    }, [subCat1, selectedCategory, selectedSubCategory1]);

    async function fetchCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('name,subCat1');

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
        <div className="flex flex-row gap-2 items-center justify-start relative overflow-hidden mt-3 p-8">
            {selectedSubCategories && selectedSubCategories.length > 0 ? (
                selectedSubCategories.map((subCategory1, index) => (
                    <div
                        key={index}
                        className={`bg-[#a9d3ce] border-solid border-[#000000] border pr-[37px] pl-[37px] flex flex-col gap-2.5 items-start justify-start shrink-0 w-[169px] relative ${selectedSubCategory1 === subCategory1 ? 'bg-[#82b8b0]' : 'bg-white' // Highlight the default selected subcategory
                            }`}
                        onClick={() => setSelectedSubCategory1(subCategory1)} // Allow changing selection on click
                    >
                        <div className="flex flex-row items-center justify-center self-stretch relative overflow-hidden">
                            <button className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-md leading-[30px] font-normal relative flex items-center justify-center px-7">
                                {subCategory1}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">
                    No subcategories available for {selectedCategory.category}.
                </div>
            )}
            {/* {selectedSubCategory1 && (
                <div className="mt-4 text-gray-700">
                    Selected Subcategory: <strong>{selectedSubCategory1}</strong>
                </div>
            )} */}
        </div>
    );
};

export default MainPage;
