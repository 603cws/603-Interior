import { useEffect, useState } from "react"
import Navbar from '../../boq/components/Navbar';
import Categories from './Categories';
import { fetchCategories, fetchProductsData, fetchWorkspaces, fetchRoomData, } from '../utils/dataFetchers';

function Boq() {
    const [selectedCategory, setSelectedCategory] = useState('Furniture');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedSubCategory1, setSelectedSubCategory1] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [categories, setCategories] = useState([]);
    const [productsData, setProductData] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [roomData, setRoomData] = useState({ quantityData: [], areasData: [] });

    // useEffect(() => {
    //     document.title = '603 BOQ';
    // }, []);

    useEffect(() => {
        const loadData = async () => {
            const [categoriesData, productsData, workspacesData, roomDataResult] = await Promise.all([
                fetchCategories(), fetchProductsData(), fetchWorkspaces(), fetchRoomData(),]);

            setCategories(categoriesData);

            if (categoriesData.length > 0) {
                setSelectedCategory(categoriesData[0].category);
                setSelectedSubCategory(categoriesData[0].subcategories[0] || null);
            }

            setProductData(productsData);
            setWorkspaces(workspacesData);
            setRoomData(roomDataResult);
        };

        loadData();
    }, []);

    useEffect(() => {
        console.log("Categories: ", categories);
    }, [categories])

    const handleSelectedSubCategory = (subCategory) => {
        setSelectedSubCategory(subCategory);
        console.log(subCategory);
    }

    return (
        <div>
            <Navbar />

            <Categories categories={categories} selectedCategory={selectedCategory} handleSelectedSubCategory={handleSelectedSubCategory} />

        </div>
    )
}

export default Boq