import React, { useState, useEffect } from 'react';

const Categories = ({ categories, handleSelectedSubCategory }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Set the default category to "Furniture" on component mount
    useEffect(() => {
        const defaultCategory = categories.find(({ category }) => category === "Furniture");
        if (defaultCategory) {
            setSelectedCategory(defaultCategory);
        }
    }, [categories]);

    // Helper function to clean up category name and compare with image name
    const getCleanedCategoryName = (categoryName) => {
        return categoryName.replace(/[^a-zA-Z0-9]/g, ''); // Removes all non-alphanumeric characters
    };

    // Handle category selection
    const handleCategorySelection = (categoryData) => {
        setSelectedCategory(categoryData);
    };

    return (
        <div className="flex flex-col">
            {/* Categories List */}
            <div className="flex flex-row overflow-auto gap-5 cursor-pointer">
                {categories.map(({ id, category, subcategories }) => {
                    // Clean the category name by removing special characters (like /) and converting to lowercase
                    const cleanedCategoryName = getCleanedCategoryName(category);
                    const imageSrc = `/images/icons/${cleanedCategoryName}.png`; // Dynamically set the image source based on cleaned category name

                    return (
                        <div key={id} onClick={() => handleCategorySelection({ id, category, subcategories })}>
                            <div className={`pt-[30px] pr-[50px] pb-[30px] pl-[50px] flex flex-row gap-[21px] items-center justify-start relative overflow-auto`}>
                                <div className={`${selectedCategory?.id === id ? 'bg-[#A9D3CE]' : 'bg-[#ffffff]'} 
                                    rounded-3xl border-solid border-[#000000] border-2 pt-3.5 pr-4 pb-3.5 pl-4 flex flex-col gap-0 items-center justify-start shrink-0 w-[120px] h-[100px] relative`}>
                                    <div className="flex flex-row gap-2.5 items-center justify-center shrink-0 w-[50px] relative">
                                        {/* Dynamically load category image */}
                                        <img
                                            className="flex flex-col gap-2.5 items-start justify-start shrink-0 w-[50px] h-[50px] relative overflow-hidden"
                                            src={imageSrc}
                                            alt={`${category} icon`}
                                        />
                                    </div>
                                    <div className="pr-px pl-px flex flex-col gap-2.5 items-start justify-start shrink-0 relative overflow-hidden">
                                        <div className="pt-2.5 pr-[52px] pb-2.5 pl-[52px] flex flex-row gap-2.5 items-center justify-center shrink-0 w-[114px] h-9 relative overflow-hidden">
                                            <div className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-base leading-5 font-normal relative flex items-center justify-center">
                                                {category}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Subcategories */}
            {selectedCategory && (
                <div className="mt-5">
                    <h3 className="text-xl font-semibold text-gray-800">Subcategories of {selectedCategory.category}</h3>
                    <div className="grid grid-cols-4 gap-5 mt-3">
                        {selectedCategory.subcategories.map((subCategory, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectedSubCategory(subCategory)}  // Trigger the subcategory selection callback
                            >
                                <div className="flex flex-col gap-10 gap-y-[39px] items-center justify-center flex-wrap relative">
                                    <div className="pt-2 pr-[27px] pb-2 pl-[27px] flex flex-col gap-[19px] items-center justify-center w-[264px] relative overflow-hidden">
                                        <div className="relative w-[210px] h-[220px] flex items-center justify-center">
                                            <div className="rounded-[26px] w-[210px] h-[220px] bg-gradient-to-r from-[#003442] to-[#34BFAD] flex items-center justify-center">
                                                <img
                                                    className="rounded-3xl w-[193.23px] h-[199.64px]"
                                                    // You can use subcategory-specific image if needed here
                                                    alt="Subcategory"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-[#444444] text-center font-['Montserrat-Medium',_sans-serif] text-xl font-medium relative">
                                            {subCategory}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
