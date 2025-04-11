import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import addressAPI from "../services/addressAPI";
import cartAPI from "../services/cartAPI";
import orderAPI from "../services/orderAPI";

const CheckOut = () => {
    const { cart, setCart, userId, cartLoading } = useCart();
    // console.log("Cart in CheckOut:", cart);
    const [showForm, setShowForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showPaymentSection, setShowPaymentSection] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        pincode: "",
        locality: "",
        address: "",
        state: "",
        landmark: "",
        altPhone: "",
        addressType: "home"
    });

    const states = ["Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Delhi"];

    // Simulate API delay for checking cart data
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Adjust timing as needed
        return () => clearTimeout(timer);
    }, []);

    // Redirect if the cart is empty (only after both loading states are false)
    useEffect(() => {
        if (!loading && !cartLoading) {
            if (!userId) {
                navigate("/login");
            } else if (!cart || !cart.items || cart.items.length === 0) {
                alert("Your cart is empty. Redirecting to home.");
                navigate("/");
            }
        }
    }, [loading, cartLoading, userId, navigate]);

    // Redirect to login if user is not logged in (only after loading completes)
    useEffect(() => {
        if (loading || cartLoading) return;

        if (!userId) {
            navigate("/login");
        }
    }, [loading, cartLoading, userId, navigate]);

    // Fetch Addresses for the Logged-in User
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                if (!userId) return;
                const response = await addressAPI.get(`/api/addresses/${userId}`);
                setAddresses(response.data);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, [userId]);   // Only fetch when `userId` changes, not `loading`

    // Handle input changes in the address form
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Save or update an address in MongoDB
    const handleSaveAddress = async () => {
        try {
            if (!userId) {
                alert("User not authenticated. Please log in.");
                return;
            }

            const addressData = { ...formData, userId };

            if (editIndex !== null) {
                // Update existing address
                const updatedAddress = await addressAPI.put(
                    `/api/addresses/${addresses[editIndex]._id}`,
                    addressData
                );
                const updatedAddresses = [...addresses];
                updatedAddresses[editIndex] = updatedAddress.data.address;
                setAddresses(updatedAddresses);
            } else {
                // Save new address
                const response = await addressAPI.post("/api/addresses", addressData);
                setAddresses([...addresses, response.data.address]);
            }

            setShowForm(false);
            setEditIndex(null);
            setFormData({
                name: "",
                phone: "",
                pincode: "",
                locality: "",
                address: "",
                state: "",
                landmark: "",
                altPhone: "",
                addressType: "home"
            });
        } catch (error) {
            console.error("Error saving/updating address:", error);
        }
    };

    // Edit an existing address
    const handleEditAddress = (index) => {
        setFormData(addresses[index]);
        setEditIndex(index);
        setShowForm(true);
    };

    // Place an order with the selected address
    const handleConfirmOrder = async () => {
        if (cartLoading) {
            alert("Cart is still loading. Please wait.");
            return;
        }

        // if (!cart || !cart.items || cart.items.length === 0) {
        //     alert("Your cart is empty. Please add items before placing an order.");
        //     return;
        // }

        // if (selectedAddress === null || selectedAddress === undefined) {
        //     alert("Please select an address before confirming the order.");
        //     return;
        // }

        if (!userId) {
            alert("User not authenticated. Please log in.");
            return;
        }

        try {
            const orderData = {
                userId, // Shorthand property (instead of this userId: userId, we use userId)
                items: cart?.items?.map(item => ({
                    productId: item.productId._id,  // Extract only the ID
                    quantity: item.quantity
                })) || [],
                totalPrice: cart?.items?.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) || 0,
                paymentMethod: selectedPayment || "Not Provided",
                addressId: addresses[selectedAddress]?._id || "Not Provided"  // Ensure only the ID is sent
            };

            const response = await orderAPI.post("/api/orders", orderData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Order placed successfully:", response.data);

            // Clear cart in MongoDB
            await cartAPI.delete(`/api/cart/${userId}`);

            // Clear cart in state
            setCart([]);

            setOrderPlaced(true); // Show success message
        } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message);
        }
    };

    return (
        <>
            {
                loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        <p className="mt-4 text-lg text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <>
                        {
                            orderPlaced ? (
                                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100">
                                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                                        <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
                                        <p className="text-gray-600 mt-2">Thank you for shopping with us.</p>
                                        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-200 flex flex-col min-h-[calc(100vh-4rem)] md:flex-row gap-5 px-8 py-5">
                                    {/* Left side */}
                                    <div className="bg-white w-full md:w-3/4 border border-gray-300">
                                        <h1 className="bg-blue-500 px-4 py-3 text-white text-lg font-medium">DELIVERY ADDRESS</h1>
                                        <div className="px-4 py-3">
                                            {addresses.length > 0 ? (
                                                addresses.map((address, index) => (
                                                    <div key={index} className="py-2 flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="selectedAddress"
                                                            checked={selectedAddress === index}
                                                            onChange={() => setSelectedAddress(index)}
                                                        />
                                                        <div className="flex justify-between w-full">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {address.name}
                                                                    <span className="bg-gray-200 px-2 py-0.5 rounded mx-2 font-normal text-xs opacity-60">{address.addressType.toUpperCase()}</span>
                                                                    {address.phone}
                                                                </p>
                                                                <p>{address.address}, {address.locality}, {address.state} - {address.pincode}</p>
                                                            </div>
                                                            <button className="text-blue-500 text-sm font-medium cursor-pointer" onClick={() => handleEditAddress(index)}>EDIT</button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">No address added yet.</p>
                                            )}
                                        </div>
                                        {selectedAddress !== null && (
                                            <button className="bg-orange-500 text-white px-4 py-2 m-4 cursor-pointer" onClick={() => setShowPaymentSection(true)}>DELIVERY HERE</button>
                                        )}
                                        <div className="border-t-4 border-gray-200 px-4 py-3">
                                            <div className="text-blue-600 font-medium cursor-pointer"
                                                onClick={() => { setShowForm(!showForm); setEditIndex(null); }}>
                                                {showForm ? "Cancel" : "Add a new address"}
                                            </div>
                                        </div>
                                        {showForm && (
                                            <div className="px-6 py-4 border-t bg-white shadow-md rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" name="name" placeholder="Full Name" className="border rounded-md w-full p-2 text-sm" value={formData.name} onChange={handleInputChange} />
                                                    <input type="text" name="phone" placeholder="Phone Number" className="border rounded-md w-full p-2 text-sm" value={formData.phone} onChange={handleInputChange} />
                                                    <input type="text" name="pincode" placeholder="Pincode" className="border rounded-md w-full p-2 text-sm" value={formData.pincode} onChange={handleInputChange} />
                                                    <input type="text" name="locality" placeholder="Locality" className="border rounded-md w-full p-2 text-sm" value={formData.locality} onChange={handleInputChange} />
                                                </div>
                                                <textarea name="address" placeholder="Full Address" className="border rounded-md w-full p-2 text-sm mt-4" rows="2" value={formData.address} onChange={handleInputChange}></textarea>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    <select name="state" className="border rounded-md w-full p-2 text-sm" value={formData.state} onChange={handleInputChange}>
                                                        <option value="">Select State</option>
                                                        {states.map((state, index) => <option key={index} value={state}>{state}</option>)}
                                                    </select>
                                                    <input type="text" name="landmark" placeholder="Landmark (Optional)" className="border rounded-md w-full p-2 text-sm" value={formData.landmark} onChange={handleInputChange} />
                                                </div>
                                                <input type="text" name="altPhone" placeholder="Alternative Phone (Optional)" className="border rounded-md w-full p-2 text-sm mt-4" value={formData.altPhone} onChange={handleInputChange} />
                                                <div className="flex items-center gap-4 mt-4">
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input type="radio" name="addressType" value="home" checked={formData.addressType === "home"} onChange={handleInputChange} /> Home
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input type="radio" name="addressType" value="work" checked={formData.addressType === "work"} onChange={handleInputChange} /> Work
                                                    </label>
                                                </div>
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 mt-4 rounded-md shadow-md" onClick={handleSaveAddress}>
                                                    {editIndex !== null ? "Update Address" : "Save and Deliver Here"}
                                                </button>
                                            </div>
                                        )}
                                        {showPaymentSection && (
                                            <div className="p-4 border-t-4 border-gray-200 mt-4">
                                                <h2 className="text-lg font-medium">PAYMENT OPTIONS</h2>
                                                <div className="mt-2">
                                                    <label>
                                                        <input type="radio" name="payment" value="COD" onChange={(e) => setSelectedPayment(e.target.value)} /> Cash on Delivery
                                                    </label>
                                                    <label className="ml-4">
                                                        <input type="radio" name="payment" value="UPI" onChange={(e) => setSelectedPayment(e.target.value)} /> UPI
                                                    </label>
                                                </div>
                                                <button
                                                    className={`bg-blue-600 text-white px-4 py-2 mt-3 ${!selectedPayment ? "opacity-50" : "cursor-pointer"
                                                        }`}
                                                    disabled={!selectedPayment}
                                                    onClick={handleConfirmOrder}
                                                >
                                                    CONFIRM ORDER
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col w-full md:w-1/4 space-y-6">
                                        {/* Cart Items Section */}
                                        <div className="bg-white p-6 rounded-lg shadow-sm">
                                            {cart?.items?.map((item) => (
                                                <div key={item.productId._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-3 gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 flex-shrink-0">
                                                            <img
                                                                src={item.productId.image}
                                                                alt={item.productId.name}
                                                                className="w-full h-full object-contain rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{item.productId.name}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-right sm:text-left">
                                                        ₹{(item.productId.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Details Section */}
                                        <div className="bg-white p-6 rounded-lg shadow-sm">
                                            <table className="w-full text-sm md:text-base">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-lg text-gray-600 border-b pb-2" colSpan={2}>PRICE DETAILS</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2">Total Items</td>
                                                        <td className="py-2 text-right">
                                                            {cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2">Total Price</td>
                                                        <td className="py-2 text-right">
                                                            ₹{cart?.items?.reduce((acc, item) => acc + item.productId.price * item.quantity, 0)?.toLocaleString() || "0"}
                                                        </td>
                                                    </tr>
                                                    <tr className="font-medium">
                                                        <td className="py-2">Total Payable</td>
                                                        <td className="py-2 text-right">
                                                            ₹{cart?.items?.reduce((acc, item) => acc + item.productId.price * item.quantity, 0)?.toLocaleString() || "0"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-green-700 font-medium py-2" colSpan={2}>
                                                            Your Total Savings on this order ₹
                                                            {cart?.items?.reduce((acc, item) => acc + (item.productId.originalPrice - item.productId.price) * item.quantity, 0)?.toLocaleString() || "0"}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    );
};

export default CheckOut;
