import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import productAPI from "../services/productAPI";
import { useCart } from "../context/CartContext";   // Import cart context

const ProductDetails = () => {
    const { id } = useParams(); // Get product ID from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error
    const { addToCart, userId } = useCart(); // Use cart context
    const navigate = useNavigate();

    // Fetch product details when component mounts
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await productAPI.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details", error);
                setError("Failed to load product details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]); // Fetch data whenever ID changes

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                <p className="mt-4 text-lg text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!product) {
        return <p className="text-center text-red-500">Product not found</p>;
    }

    const handleAddToCart = () => {
        if (!userId) {
            navigate("/login");
        } else {
            addToCart({ ...product, quantity: 1 });
        }
    };

    const handleBuyNow = async () => {
        if (!userId) {
            navigate("/login");
        } else {
            await addToCart({ ...product, quantity: 1 });
            navigate("/checkout");
        }
    };

    // Calculate dynamic discount percentage
    const discountPercentage = ((product.originalPrice - product.price) / product.originalPrice) * 100;

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] md:flex-row justify-center items-start gap-6 md:gap-10 mx-4 md:mx-8 lg:mx-16 py-6">
            {/* Product Image Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="w-full">
                    <img
                        src={product.image}  // Use dynamic image from the backend or fallback to default image
                        alt={product.name}
                        className="w-full max-h-96 object-contain border border-gray-200 px-2 py-5"
                    />
                </div>
                <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-5 mt-4 w-full">
                    <button className="bg-[#FF9F00] text-white font-medium px-5 sm:px-7 py-3 sm:py-4 w-5/12 sm:w-auto cursor-pointer"
                        onClick={handleAddToCart} >
                        <i className="fa-solid fa-cart-shopping fa-xs"></i> ADD TO CART
                    </button>
                    <button className="bg-[#FB641B] text-white font-medium px-5 sm:px-7 py-3 sm:py-4 w-5/12 sm:w-auto cursor-pointer"
                        onClick={handleBuyNow} >
                        <i className="fa-solid fa-bolt-lightning"></i> BUY NOW
                    </button>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                {/* Product Name */}
                <h1 className="text-xl sm:text-2xl font-medium hover:text-blue-600">{product.name}</h1>

                {/* Ratings & Reviews */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-green-700 text-white font-medium flex items-center rounded px-2 py-1">
                        <p>4.6</p>
                        <p className="ml-1"><i className="fa-solid fa-star fa-xs"></i></p>
                    </div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">
                        7,652 Ratings & 359 Reviews
                    </p>
                </div>

                {/* Pricing Details */}
                <div className="text-sm sm:text-base">
                    <div className="flex items-center gap-4">
                        <p className="text-2xl md:text-3xl font-bold">₹{product.price.toLocaleString()}</p>
                        <p className="text-gray-500 line-through text-sm sm:text-base">₹{product.originalPrice.toLocaleString()}</p>
                        <p className="text-green-700 text-sm sm:text-base">{discountPercentage.toFixed()}% off</p>
                    </div>
                </div>

                {/* Available Offers */}
                <div className="mt-2">
                    <p className="text-lg font-medium">Available offers</p>
                    <ul className="text-sm sm:text-base">
                        <li><span className="font-medium">Bank Offer:</span> 1% Upto ₹2000 on Phone UPI Transaction <span className="text-blue-600 font-medium">T&C</span></li>
                        <li><span className="font-medium">Bank Offer:</span> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card <span className="text-blue-600 font-medium">T&C</span></li>
                        <li><span className="font-medium">Bank Offer:</span> 5% off up to ₹750 on IDFC FIRST Power Women Platinum Debit Cards <span className="text-blue-600 font-medium">T&C</span></li>
                        <li><span className="font-medium">Special Price:</span> Get extra ₹4901 off (price inclusive of cashback/coupon) <span className="text-blue-600 font-medium">T&C</span></li>
                    </ul>
                </div>

                {/* Highlights Section */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <p className="text-gray-500 font-medium">Highlights</p>
                    {/* Dynamic Specifications Section */}
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
    );
};

export default ProductDetails;
