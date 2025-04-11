import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import orderAPI from "../services/orderAPI";

const Orders = () => {
    const { userId } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    console.log("orders data:", orders)

    // Redirect to login if user is not logged in
    useEffect(() => {
        if (loading) return; // Wait until loading completes

        if (userId === null || userId === undefined) {
            navigate("/login");
        }
    }, [loading, userId, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!userId) {
                setLoading(false); // Stop loading if user is not logged in
                return;
            }

            const fetchOrders = async () => {
                try {
                    const response = await orderAPI.get(`/api/orders/${userId}`);
                    setOrders(response.data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setError("Failed to load orders. Please try again later.");
                } finally {
                    setLoading(false); // Stop loading after fetching data
                }
            };

            fetchOrders();
        }, 500); // Adjust delay as needed

        return () => clearTimeout(timer);
    }, [userId]);

    // Show loading animation while waiting
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
            </div>
        );
    }

    // Show login prompt if the user is not logged in
    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
                <p className="text-red-500 text-lg font-semibold">You need to log in to view your orders</p>
                <Link to="/login" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Login to Continue
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg shadow-md">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4555/4555977.png"
                        alt="No Orders"
                        className="w-32 h-32 mb-4"
                    />
                    <p className="text-gray-600 text-lg font-semibold">You haven't placed any orders yet.</p>
                    <p className="text-gray-500 mt-1">Start shopping now and place your first order!</p>
                    <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                orders.map((order, index) => (
                    <div key={order._id} className="bg-white p-4 rounded-lg shadow-lg mb-4">
                        <h3 className="font-bold text-lg">Order #{index + 1}</h3>
                        <p className="text-sm text-gray-500 break-all">Order ID: {order._id}</p>
                        <p className="text-gray-600">
                            Placed on: {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}
                        </p>
                        <p className="text-gray-800 font-semibold">Payment Method: {order.paymentMethod}</p>
                        <p className="text-gray-800 font-semibold">
                            Total Price: ₹{order?.totalPrice?.toLocaleString?.() || "0"}
                        </p>

                        <ul className="mt-4 space-y-3">
                            {order.items.map((item, idx) => (
                                <li key={item.productId?._id || idx} className="flex items-start gap-4 border-b border-gray-200 pb-3">
                                    {item.product?.image && (
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{item.product?.name || "Unknown Product"}</p>
                                        <p className="text-gray-500 text-sm">
                                            ₹{item.product?.price?.toLocaleString() || "0"} × {item.quantity}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {order.address && typeof order.address === "object" && (
                            <details className="mt-4 p-3 bg-gray-50 rounded-lg cursor-pointer">
                                <summary className="font-semibold text-blue-600">View Delivery Address</summary>
                                <div className="mt-2 text-sm text-gray-700">
                                    <p>{order.address.name}</p>
                                    <p>{order.address.address}, {order.address.locality}</p>
                                    <p>{order.address.state} - {order.address.pincode}</p>
                                    <p>Phone: {order.address.phone}</p>
                                </div>
                            </details>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
