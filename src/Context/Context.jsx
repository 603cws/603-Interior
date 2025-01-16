import { createContext, useContext, useState } from "react";

const AppContext = createContext()


export const AppProvider = ({ children }) => {
    const [totalArea, setTotalArea] = useState(0)
    const [progress, setProgress] = useState(0)

    const [selectedCategory, setSelectedCategory] = useState(null); //Gets value after data fetching
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); //Gets value after data fetching
    const [selectedSubCategory1, setSelectedSubCategory1] = useState(null);
    const [selectedData, setSelectedData] = useState([]);

    return (
        <AppContext.Provider value={{
            totalArea, setTotalArea, progress, setProgress, selectedData, setSelectedData, selectedCategory, setSelectedCategory,
            selectedSubCategory, setSelectedSubCategory, selectedSubCategory1, setSelectedSubCategory1
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


