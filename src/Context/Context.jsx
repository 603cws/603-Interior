import { createContext, useContext, useState } from "react";

const AppContext = createContext()


export const AppProvider =({children})=>{
    const [totalArea,setTotalArea]=useState(0)
    const [progress,setProgress]=useState(0)
    return (
        <AppContext.Provider value={{totalArea,setTotalArea,progress,setProgress}}>
            {children}
        </AppContext.Provider>
    )
}


export const useApp = ()=>{
    const context = useContext(AppContext)

    if(context === undefined){
        throw new Error("useApp must be used within a AppProvider")
    }
    return context
}


