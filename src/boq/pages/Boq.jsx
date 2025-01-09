import { useEffect, useState } from "react"
import Navbar from '../../boq/components/Navbar';
import Categories from './Categories';
import { fetchCategories, fetchProductsData, fetchWorkspaces, fetchRoomData, } from '../utils/dataFetchers';
import MainPage from "./MainPage";

function Boq() {
    const [selectedCategory, setSelectedCategory] = useState(null);     //Gets value after data fetching
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);   //Gets value after data fetching
    const [selectedSubCategory1, setSelectedSubCategory1] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [categories, setCategories] = useState([]);
    const [productsData, setProductData] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [roomData, setRoomData] = useState({ quantityData: [], areasData: [] });

    const [minimizedView, setMinimizedView] = useState(false);

    // useEffect(() => {
    //     document.title = '603 BOQ';
    // }, []);

    useEffect(() => {
        const loadData = async () => {
            const [categoriesData, productsData, workspacesData, roomDataResult] = await Promise.all([
                fetchCategories(), fetchProductsData(), fetchWorkspaces(), fetchRoomData(),]);

            setCategories(categoriesData);

            if (categoriesData.length > 0) {
                setSelectedCategory(categoriesData[0]);
                setSelectedSubCategory(categoriesData[0].subcategories[0] || null);
            }

            setProductData(productsData);
            setWorkspaces(workspacesData);
            setRoomData(roomDataResult);
        };

        loadData();
    }, []);

    const handleCategorySelection = (categoryData) => {
        setSelectedCategory(categoryData);
        console.log("Selected Category: ", categoryData.category);
    };

    const handleSelectedSubCategory = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setMinimizedView(true);
        console.log("Selected SubCat: ", subCategory);
    }

    return (
        <div>
            <Navbar />

            <Categories categories={categories} selectedCategory={selectedCategory} setSelectedCategory={handleCategorySelection}
                selectedSubCategory={selectedSubCategory} setSelectedSubCategory={handleSelectedSubCategory} minimizedView={minimizedView} />


            {minimizedView &&
                <MainPage selectedCategory={selectedCategory} />
            }
        </div>
    )
}

export default Boq