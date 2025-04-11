import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { signOut } from "firebase/auth";
import auth from "../config";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();
    const { userId, cart, userName } = useCart(); // Get cart data from context
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown toggle

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/login");
        });
    };

    // Calculate total cart items
    const totalCartItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <>
            {/* Main Navbar */}
            <header className="bg-blue-500 p-3 text-white font-medium z-50 top-0 sticky">
                <nav className="flex justify-between items-center px-5 md:px-10">
                    {/* Left Side: Logo */}
                    <h1 className="text-2xl italic cursor-pointer">
                        <Link to="/">Flipkart Clone</Link>
                    </h1>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center bg-white px-2 rounded-md">
                        <input
                            type="search"
                            placeholder="Search for products, brands, and more"
                            className="bg-white text-black font-normal p-2 w-96 outline-none"
                        />
                        <i className="fa-solid fa-magnifying-glass cursor-pointer" style={{ color: "#2B7FFF" }}></i>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-5 items-center">
                        {userId && (
                            <div className="relative">
                                {/* User Button */}
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition duration-300 cursor-pointer"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span className="font-semibold">{userName}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 animate-fadeIn">
                                        <button
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {!userId && (
                            <Link to="/login">
                                <button className="px-5 py-2 bg-white text-blue-600 font-semibold rounded-full border border-blue-600 
                                        hover:bg-blue-600 hover:text-white transition duration-300 shadow-md cursor-pointer">
                                    Login
                                </button>
                            </Link>
                        )}
                        <Link to={userId ? "/orders" : "/login"}>
                            <p className="cursor-pointer">My Orders</p>
                        </Link>
                        <Link to={userId ? "/viewcart" : "/login"} className="relative">
                            <div className="flex items-center gap-1 cursor-pointer">
                                <FaShoppingCart size={20} />
                                {totalCartItems > 0 && (
                                    <span className="absolute top-0 left-1.5 bg-red-600 text-white text-xs font-bold rounded-full px-1">
                                        {totalCartItems}
                                    </span>
                                )}
                                Cart
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(true)}>
                        <FaBars />
                    </button>
                </nav>
            </header>

            {/* Side Nav for Mobile */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-blue-600 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
                <div className="flex justify-between p-5">
                    <h1 className="text-xl italic">
                        <Link to="/">Flipkart</Link>
                    </h1>
                    <button className="text-white text-2xl" onClick={() => setIsOpen(false)}>
                        <FaTimes />
                    </button>
                </div>
                <ul className="flex flex-col gap-5 p-5">
                    <li className="border-b pb-2">
                        {userId ? (
                            <button className="bg-red-500 text-white px-4 py-1 w-full text-left cursor-pointer" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="bg-white text-blue-600 px-4 py-1 w-full block text-left">
                                Login
                            </Link>
                        )}
                    </li>
                    <li className="cursor-pointer">
                        <Link to={userId ? "/orders" : "/login"}>My Orders</Link>
                    </li>
                    <li className="cursor-pointer flex items-center gap-2 relative">
                        <FaShoppingCart size={20} />
                        <Link to={userId ? "/viewcart" : "/login"}>Cart</Link>
                        {totalCartItems > 0 && (
                            <span className="absolute top-0 left-1.5 bg-red-600 text-white text-xs font-bold rounded-full px-1">
                                {totalCartItems}
                            </span>
                        )}
                    </li>
                </ul>
            </div>

            {/* Overlay when mobile menu is open */}
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Navbar;
