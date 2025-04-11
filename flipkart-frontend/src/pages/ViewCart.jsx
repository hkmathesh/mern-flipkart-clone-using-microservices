import { useCart } from "../context/CartContext"; // Import cart context
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ViewCart = () => {
    const { cart, removeFromCart, updateQuantity, userId } = useCart(); // Get cart data and methods
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Redirect to login if user is not logged in (only after loading completes)
    useEffect(() => {
        if (loading) return;

        if (userId === null || userId === undefined) {
            navigate("/login");
        }
    }, [loading, userId, navigate]);

    // Simulate API delay for checking cart data
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500); // Adjust timing as needed
        return () => clearTimeout(timer);
    }, [cart]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                <p className="mt-4 text-lg text-gray-600">Loading your cart...</p>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
                <p className="text-red-500 text-lg font-semibold">Your cart is empty</p>
                <p className="text-gray-500 mt-2">Add items to your cart to start shopping!</p>

                {userId ? (
                    <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Continue Shopping
                    </Link>
                ) : (
                    <Link to="/login" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Login to Continue
                    </Link>
                )}
            </div>
        );
    }

    // console.log("Cart:", cart);
    // console.log("Cart Items:", cart?.items);
    // console.log("First Item:", cart?.items?.[0]);
    // console.log("First Item Full Data:", JSON.stringify(cart?.items?.[0], null, 2));
    // console.log("First Item Price:", cart?.items?.[0]?.productId?.price);
    // console.log("First Item Price:", cart?.items?.[0]?.originalPrice);
    // console.log("First Item Quantity:", cart?.items?.[0]?.quantity);

    return (
        <div className="bg-gray-200 flex flex-col md:flex-row gap-5 px-8 py-5">
            {/* Left side */}
            <div className="bg-white w-full md:w-3/4 border border-gray-300">
                {cart.items.map((item) => {
                    const product = item.productId; // Now productId contains full product details

                    if (!product) {
                        console.error("Product details missing for:", item);
                        return null; // Skip rendering if product details are missing
                    }

                    return (
                        <div key={product._id} className="bg-white flex flex-col md:flex-row gap-6 px-5 py-5 border-b-2 border-gray-200">
                            <div className="flex-shrink-0 w-full md:w-48">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-contain"
                                />
                            </div>

                            <div className="flex-grow p-2">
                                <h1 className="text-lg md:text-xl font-medium hover:text-blue-600">{product.name}</h1>
                                <p className="text-gray-500 text-sm sm:text-base">Seller: TrueComRetail</p>

                                <div className="mt-4 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
                                    <p className="text-gray-500 line-through text-sm sm:text-base">
                                        ₹{product.originalPrice ? product.originalPrice.toLocaleString() : "N/A"}
                                    </p>
                                    <p className="text-2xl md:text-3xl font-bold">
                                        ₹{product.price ? product.price.toLocaleString() : "N/A"}
                                    </p>
                                    <p className="text-green-700 text-sm sm:text-base">
                                        {product.originalPrice && product.price
                                            ? `${(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed()}% off`
                                            : ""}
                                    </p>
                                </div>

                                <p className="mt-2 text-sm sm:text-base">
                                    Delivery by <span className="font-medium">Mon Mar 17</span> |
                                    <span className="text-gray-500 line-through pl-1">₹40</span>
                                    <span className="text-green-700"> Free </span>
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-2 bg-gray-300 rounded text-lg"
                                            onClick={() => updateQuantity(product._id, "decrease")}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            value={item.quantity}
                                            readOnly
                                            className="w-10 text-center border border-gray-300"
                                        />
                                        <button
                                            className="p-2 bg-gray-300 rounded text-lg"
                                            onClick={() => updateQuantity(product._id, "increase")}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex flex-col text-blue-600 text-sm font-medium gap-2">
                                        <button className="hover:underline" onClick={() => removeFromCart(product._id)}>
                                            REMOVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="border-t-4 border-gray-200 px-5 py-3 flex justify-end">
                    <Link to='/checkout'>
                        <button className="bg-[#FB641B] text-white font-medium px-5 sm:px-7 py-3 sm:py-4 w-5/12 sm:w-auto cursor-pointer">
                            PLACE ORDER
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right side  */}
            <div className="bg-white p-5 w-full md:w-1/4 self-start">
                <table className="w-full text-sm md:text-base">
                    <tbody>
                        <tr>
                            <td className="text-lg text-gray-600 border-b pb-2" colSpan={2}>
                                Price Details
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2">Total Items</td>
                            <td className="py-2 text-right">
                                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2">Total Price</td>
                            <td className="py-2 text-right">
                                ₹{cart.items.reduce((acc, item) => acc + (item.productId?.originalPrice || 0) * item.quantity, 0).toLocaleString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2">Discount</td>
                            <td className="py-2 text-right text-green-700">
                                - ₹{cart.items.reduce((acc, item) => acc + ((item.productId?.originalPrice || 0) - (item.productId?.price || 0)) * item.quantity, 0).toLocaleString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2">Delivery Charges</td>
                            <td className="py-2 text-right text-green-700">
                                <span className="text-gray-500 line-through">₹40</span> Free
                            </td>
                        </tr>
                        <tr className="font-medium">
                            <td className="py-2">Total Amount</td>
                            <td className="py-2 text-right">
                                ₹{cart.items.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0).toLocaleString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="text-green-700 font-medium py-2" colSpan={2}>
                                You will save ₹
                                {cart.items.reduce((acc, item) => acc + ((item.productId?.originalPrice || 0) - (item.productId?.price || 0)) * item.quantity, 0).toLocaleString()} on this order
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewCart;
