import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const MainPage = ({ selectedCategory }) => {
    const [subCat1, setSubCat1] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('name,subCat1');

            if (error) {
                console.error('Error fetching categories:', error);
                return;
            }

            // Transform data into key-value pairs
            const transformedData = data.reduce((acc, item) => {
                acc[item.name] = item.subCat1 ? JSON.parse(item.subCat1) : [];
                return acc;
            }, {});
            setSubCat1(transformedData);
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }

    const selectedSubCategories = subCat1 && subCat1[selectedCategory.category] ? subCat1[selectedCategory.category] : [];

    return (
        <div className="flex flex-row gap-7 items-center justify-start relative overflow-hidden">
            {selectedSubCategories && selectedSubCategories.length > 0 ? (
                selectedSubCategories.map((subCategory, index) => (
                    <div
                        key={index}
                        className="bg-[#a9d3ce] border-solid border-[#000000] border pr-[37px] pl-[37px] flex flex-col gap-2.5 items-start justify-start shrink-0 w-[169px] relative"
                    >
                        <div className="pt-[13px] pr-[52px] pb-[13px] pl-[52px] flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 h-14 relative overflow-hidden">
                            <div className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-2xl leading-[30px] font-normal relative w-[152px] flex items-center justify-center">
                                {subCategory}
                            </div>
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
