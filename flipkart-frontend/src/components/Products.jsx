import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import productAPI from "../services/productAPI";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Extract category from URL query parameter
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");

    // Fetch products when the component mounts or category changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await productAPI.get(
                    `/api/products${category ? `?category=${category}` : ""}`
                );
                // console.log(response.data);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    return (
        <>
            <div className="bg-gray-200 flex flex-wrap md:flex-nowrap justify-start items-start gap-2 w-full p-2">
                {/* Sidebar Filter (Hidden on small screens) */}
                <div className="bg-white min-w-64 min-h-screen sticky top-0 p-2 hidden">
                    <h1 className="text-xl font-medium">Filters</h1>
                </div>

                {/* Product List */}
                <div className="bg-gray-200 flex flex-col justify-center w-full">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                            <p className="mt-4 text-lg text-gray-600">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white flex flex-col justify-center items-center py-10 mt-10 rounded-lg shadow-md">
                            <i className="fa-solid fa-box-open text-4xl text-gray-500 mb-4"></i> {/* Icon */}
                            <p className="text-center text-2xl font-semibold text-gray-700">Oops! No products found.</p>
                            <p className="text-center text-lg font-medium text-gray-500 mt-2">
                                It seems like we couldn't find anything matching your search.
                            </p>
                            <Link
                                to="/"
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Go back to home
                            </Link>
                        </div>
                    ) : (
                        products.map((product) => (
                            <Link key={product._id} to={`/product_details/${product._id}`}>
                                <div className="bg-white flex flex-wrap md:flex-nowrap gap-6 md:gap-12 px-5 py-5 mb-0.5 cursor-pointer">

                                    {/* Image & Details */}
                                    <div className="flex flex-wrap md:flex-nowrap gap-5 w-full md:w-3/4">
                                        {/* Image */}
                                        <div className="flex-shrink-0 w-full md:w-56">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-56 object-contain"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="p-2">
                                            <div className="flex flex-col justify-start items-start gap-1">
                                                <h1 className="text-lg md:text-xl font-medium hover:text-blue-600">
                                                    {product.name}
                                                </h1>

                                                {/* Ratings & Reviews */}
                                                <div className="flex flex-wrap md:inline-flex items-center gap-2">
                                                    <div className="bg-green-700 text-white font-medium flex justify-center items-center rounded px-2">
                                                        <p>4.6</p>
                                                        <p className="ml-1">
                                                            <i className="fa-solid fa-star fa-xs"></i>
                                                        </p>
                                                    </div>
                                                    <p className="text-gray-400 font-medium">
                                                        7,652 Ratings & 359 Reviews
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Dynamic Specifications Section */}
                                            <div className="mt-5">
                                                <ul className="list-disc list-inside text-gray-800 text-sm md:text-base max-w-sm md:max-w-md">
                                                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                                                        <li key={key} className="marker:text-gray-400 marker:text-xs whitespace-nowrap">
                                                            {value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Details */}
                                    <div className="text-sm p-2 w-full md:w-1/4 text-center md:text-left">
                                        <p className="text-2xl md:text-3xl font-bold">
                                            ₹{product.price.toLocaleString()}
                                        </p>
                                        <p className="mt-2">
                                            <span className="text-gray-500 line-through">
                                                ₹{product.originalPrice.toLocaleString()}
                                            </span>
                                            <span className="text-green-700">
                                                {" "}
                                                {(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed()}% off
                                            </span>
                                        </p>
                                        <p>Free delivery</p>
                                        <p className="text-green-700 font-medium">Save extra with combo offers</p>
                                        <p className="text-purple-700 font-medium">Only few left</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;
