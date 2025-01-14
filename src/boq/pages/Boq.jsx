import { useEffect, useState, useMemo } from "react"
import Navbar from '../../boq/components/Navbar';
import Categories from './Categories';
import { fetchCategories, fetchProductsData, fetchWorkspaces, fetchRoomData, } from '../utils/dataFetchers';
import MainPage from "./MainPage";
import ProductCard from "../../components/ProductCard";
import RecommendComp from "../../components/RecommendComp";
import processData from '../utils/dataProcessor';
import ProductOverview from '../../components/ProductOverview';

function Boq() {
    const [selectedCategory, setSelectedCategory] = useState(null);     //Gets value after data fetching
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);   //Gets value after data fetching
    const [selectedSubCategory1, setSelectedSubCategory1] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [subCat1, setSubCat1] = useState(null);
    const [selectedProductView, setSelectedProductView] = useState([]);

    const [categories, setCategories] = useState([]);
    const [productsData, setProductData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([1000, 15000000]);

    const [workspaces, setWorkspaces] = useState([]);
    const [roomData, setRoomData] = useState({ quantityData: [], areasData: [] });
    const [areasData, setAreasData] = useState([]);
    const [quantityData, setQuantityData] = useState([]);

    const [minimizedView, setMinimizedView] = useState(false);
    const [showProductView, setShowProductView] = useState(false);

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

    useEffect(() => {
        if (roomData.quantityData && roomData.quantityData.length > 0) {
            const processedQuantityData = processData(roomData.quantityData, "quantity");
            if (processedQuantityData) {
                setQuantityData([processedQuantityData]);
            }
        }

        if (roomData.areasData && roomData.areasData.length > 0) {
            const processedAreasData = processData(roomData.areasData, "areas");
            if (processedAreasData) {
                setAreasData([processedAreasData]);
            }
        }
    }, [roomData]);

    useEffect(() => {
        // Automatically select the first subcategory when the category changes
        if (subCat1 && selectedCategory?.category) {
            const subCategories = subCat1[selectedCategory.category];
            if (subCategories && subCategories.length > 0) {
                setSelectedSubCategory1(subCategories[0]); // Set the first subcategory as the default
            } else {
                setSelectedSubCategory1(null);
            }
        }
    }, [subCat1, selectedCategory]);

    // Filter products based on search query, price range, and category
    const filteredProducts = useMemo(() => {
        // if (!selectedCategory) return false;
        return productsData.filter((product) => {
            if (!product.product_variants || product.product_variants.length === 0) {
                return false;
            }

            const matchesVariant = product.product_variants.some((variant) => {
                const matchesSearch =
                    variant.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    variant.details?.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesPrice =
                    variant.price >= priceRange[0] && variant.price <= priceRange[1];

                return matchesSearch && matchesPrice;
            });

            const matchesCategory =
                selectedCategory?.category === '' || product.category === selectedCategory?.category;
            return matchesVariant && matchesCategory;
        });
    }, [productsData, searchQuery, priceRange, selectedCategory]);

    // Group products by category and subcategory
    const groupedProducts = useMemo(() => {
        const grouped = {};

        filteredProducts.forEach(product => {
            const subcategories = product.subcategory.split(',').map(sub => sub.trim());

            subcategories.forEach(subcategory => {
                if (!grouped[product.category]) {
                    grouped[product.category] = {};
                }
                if (!grouped[product.category][subcategory]) {
                    grouped[product.category][subcategory] = [];
                }
                grouped[product.category][subcategory].push(product);
            });
        });
        return grouped;
    }, [filteredProducts]);

    const handleCategorySelection = (categoryData) => {
        setSelectedCategory(categoryData);
        console.log("Selected Category: ", categoryData.category);
    };

    const handleSelectedSubCategory = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setMinimizedView(true);
        console.log("Selected SubCat: ", subCategory);
    }

    const handleSelectedSubCategory1 = (subCategory1) => {
        setSelectedSubCategory1(subCategory1);
        console.log("Selected SubCat1: ", subCategory1);
    }

    const handleSelectedProductView = (variant) => {
        setSelectedProductView(variant);
    }

    console.log("ProductOverview: ", selectedProductView)

    return (
        <div>
            <Navbar />
            {!showProductView &&
                <div className="container px-5">
                    <Categories categories={categories} selectedCategory={selectedCategory} setSelectedCategory={handleCategorySelection}
                        selectedSubCategory={selectedSubCategory} setSelectedSubCategory={handleSelectedSubCategory} minimizedView={minimizedView} />

                    {minimizedView &&
                        <div>
                            <MainPage selectedCategory={selectedCategory} selectedSubCategory1={selectedSubCategory1} setSelectedSubCategory1={handleSelectedSubCategory1} />
                            <ProductCard products={groupedProducts} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} selectedSubCategory1={selectedSubCategory1}
                                selectedProductView={selectedProductView} setShowProductView={setShowProductView} setSelectedProductView={handleSelectedProductView} />
                        </div>
                    }
                </div>
            }
            {showProductView &&
                <ProductOverview selectedProductView={selectedProductView} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} quantityData={quantityData} areasData={areasData} />
            }
        </div>
    )
}

export default Boq