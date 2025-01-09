import React, { useState, useEffect } from 'react';

const Categories = ({ categories, selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory, minimizedView }) => {

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

    const getCleanedSubCategoryName = (name) => {
        if (!name) return ''; // If name is undefined or null, return empty string

        // Remove spaces and special characters, and convert to camelCase
        return name
            .replace(/[^a-zA-Z0-9\s]/g, '')         // Remove special characters
            .replace(/\s(.)/g, (match, group1) => group1.toUpperCase()) // Convert spaces to camel case
            .replace(/\s+/g, '')                    // Remove all spaces
        // .toLowerCase();                         // Convert to lowercase
    };

    return (
        <div className="flex flex-col">
            {/* Categories List */}
            <div className="flex flex-row overflow-auto gap-5 cursor-pointer p-8">
                {categories.map(({ id, category, subcategories }) => {
                    // Clean the category name by removing special characters (like /) and converting to lowercase
                    const cleanedCategoryName = getCleanedCategoryName(category);
                    const isSelected = selectedCategory?.id === id;
                    const imageSrc = `/images/icons/${cleanedCategoryName}.png`; // Dynamically set the image source based on cleaned category name

                    return (
                        <div key={id} onClick={() => setSelectedCategory({ id, category, subcategories })}
                            className={`transition-transform duration-500 ease-in-out ${isSelected ? 'scale-110' : 'scale-100'
                                }`}>
                            {!minimizedView && <div className={`pt-[30px] pr-[50px] pb-[30px] pl-[50px] flex flex-row gap-[21px] items-center justify-start relative overflow-auto`}>
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
                            }

                            {/* Show below afterwards when minimized */}
                            {minimizedView && <div className={`pl-20 flex flex-row gap-[21px] items-center justify-start relative overflow-hidden group`}>
                                <div className={`rounded-full border-2 ${selectedCategory?.id === id ? 'border-[#34BFAD]' : 'border-[#000000]'} w-[70px] h-[70px] flex items-center justify-center`} >
                                    {/* Dynamically load category image */}
                                    <img
                                        className="rounded-full w-[50px] h-[50px] object-contain"
                                        src={imageSrc}
                                        alt={`${category} icon`}
                                    />
                                </div>
                                {/* Category Name (Appears on hover) */}
                                <div className="absolute -bottom-1 w-100 h-100 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#252525] font-['Poppins-Regular',_sans-serif] text-base leading-5 font-normal">
                                    {category}
                                </div>
                            </div>
                            }
                        </div>
                    );
                })}
            </div>

            {/* Subcategories */}
            {selectedCategory && (
                <div className="mt-5">

                    {minimizedView && (
                        <div className="bg-[#ffffff] border-solid border-[#d5d5d5] border pt-[13px] pb-[13px] pl-[10px] flex flex-row gap-[10px] items-center justify-start overflow-auto cursor-pointer">
                            {selectedCategory.subcategories.map((subCategory, index) => (
                                <div key={index} onClick={() => setSelectedSubCategory(subCategory)} className="bg-[#ffffff] rounded-lg pr-4 pl-4 flex flex-row gap-[9px] items-start justify-center shrink-0 w-56">
                                    <div className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-2xl leading-[30px] font-normal w-[198px] flex items-center justify-center ">
                                        {subCategory}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!minimizedView &&
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Subcategories of {selectedCategory.category}</h3>
                            <div className="grid grid-cols-4 gap-5 mt-3">
                                {selectedCategory.subcategories.map((subCategory, index) => {
                                    // Clean the subcategory name by removing special characters and converting to camel case
                                    const cleanedSubCategoryName = getCleanedSubCategoryName(subCategory);
                                    const imageSrcSubCat = `/images/subheader/${cleanedSubCategoryName}.png`; // Use the cleaned name for image source

                                    return (
                                        <div key={index}
                                            // className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                                            onClick={() => setSelectedSubCategory(subCategory)}  // Trigger the subcategory selection callback
                                        >

                                            <div className='className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"'>
                                                <div className="flex flex-col gap-10 gap-y-[39px] items-center justify-center flex-wrap relative">
                                                    <div className="pt-2 pr-[27px] pb-2 pl-[27px] flex flex-col gap-[19px] items-center justify-center w-[264px] relative overflow-hidden">
                                                        <div className="relative w-[210px] h-[220px] flex items-center justify-center">
                                                            <div className="rounded-[26px] w-[210px] h-[220px] bg-gradient-to-r from-[#003442] to-[#34BFAD] flex items-center justify-center">
                                                                {/* Display the subcategory image if it exists */}
                                                                <img
                                                                    className="rounded-3xl w-[193.23px] h-[199.64px] object-cover"
                                                                    src={imageSrcSubCat}
                                                                    alt={`${subCategory} subcategory`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-[#444444] text-center font-['Montserrat-Medium',_sans-serif] text-xl font-medium relative">
                                                            {subCategory}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                </div>
            )}
        </div>
    );
};

export default Categories;
