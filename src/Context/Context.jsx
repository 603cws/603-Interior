import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [totalArea, setTotalArea] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log("Progress: ", progress);
    }, [progress]);

    const [selectedCategory, setSelectedCategory] = useState(null); //Gets value after data fetching
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); //Gets value after data fetching
    const [selectedSubCategory1, setSelectedSubCategory1] = useState(null);
    const [selectedData, setSelectedData] = useState([]);

    function handleProgressBar(categories, subCat1, categoryName, subCategoryName, subCat1Name = null) {
        setProgress((prevProgress) => {
            let progress1 = prevProgress; // Use the previous state for accurate updates

            // Find the category by name
            const category = categories.find((cat) => cat.category === categoryName);

            if (!category) {
                console.error(`Category "${categoryName}" not found.`);
                return prevProgress; // Return unchanged progress if there's an error
            }

            // Calculate the percentage per category
            const totalCategories = categories.length;
            const categoryPercentage = 100 / totalCategories;

            // Find the subcategories
            const subcategories = category.subcategories;

            if (!Array.isArray(subcategories)) {
                console.error(`No subcategories found for category "${categoryName}".`);
                return prevProgress; // Return unchanged progress if there's an error
            }

            const subCategoryIndex = subcategories.indexOf(subCategoryName);

            if (subCategoryIndex === -1) {
                console.error(`Subcategory "${subCategoryName}" not found in category "${categoryName}".`);
                return prevProgress; // Return unchanged progress if there's an error
            }

            // Calculate the percentage per subcategory
            const subCategoryPercentage = categoryPercentage / subcategories.length;

            // Check if the category has subCategory1 in subCat1
            if (subCat1Name && subCat1[categoryName]) {
                // Fetch subCategory1 based on the category name
                const subCategory1 = subCat1[categoryName];

                if (subCategory1 && Array.isArray(subCategory1)) {
                    const subCategory1Index = subCategory1.indexOf(subCat1Name);

                    if (subCategory1Index === -1) {
                        console.error(`SubCategory1 "${subCat1Name}" not found in category "${categoryName}".`);
                        return prevProgress; // Return unchanged progress if there's an error
                    }

                    // Divide subCategory percentage further among subCategory1
                    const subCategory1Percentage = subCategoryPercentage / subCategory1.length;

                    // Increment progress
                    progress1 += subCategory1Percentage;
                    console.log(
                        `Progress updated (Category > Subcategory > Subcategory1): ${progress1.toFixed(2)}%`
                    );
                } else {
                    console.error(`SubCategory1 is not properly defined for category "${categoryName}".`);
                    return prevProgress; // Return unchanged progress if there's an error
                }
            } else {
                // If no subCategory1 exists, only use the subcategory level percentage
                progress1 += subCategoryPercentage;
                console.log(
                    `Progress updated (Category > Subcategory): ${progress1.toFixed(2)}%`
                );
            }

            // Ensure progress doesn't exceed 100%
            if (progress1 > 100) progress1 = 100;

            return progress1; // Return the updated progress
        });
    }

    return (
        <AppContext.Provider value={{
            totalArea, setTotalArea, progress, setProgress, selectedData, setSelectedData, selectedCategory, setSelectedCategory,
            selectedSubCategory, setSelectedSubCategory, selectedSubCategory1, setSelectedSubCategory1, handleProgressBar
        }}>
            {children}
        </AppContext.Provider>
    )
}


export const useApp = () => {
    const context = useContext(AppContext)

    if (context === undefined) {
        throw new Error("useApp must be used within a AppProvider")
    }
    return context
}


