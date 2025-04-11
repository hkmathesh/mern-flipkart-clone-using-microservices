import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-10">
            <div className="container mx-auto px-5 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* About Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">About Us</h2>
                    <p className="text-gray-400 text-sm">We are a leading e-commerce platform providing high-quality products at the best prices.</p>
                </div>

                {/* Customer Service */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Customer Service</h2>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li><a href="#" className="hover:text-blue-400 transition">Contact Us</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition">Returns</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li>
                            <Link to="/">
                                <p className="hover:text-blue-400 transition">My Account</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/orders">
                                <p className="hover:text-blue-400 transition">Orders</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/viewcart">
                                <p className="hover:text-blue-400 transition">Cart</p>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Follow Us</h2>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition text-2xl"><i className="fab fa-facebook"></i></a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition text-2xl"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition text-2xl"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition text-2xl"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
                &copy; {new Date().getFullYear()} Flipkart Clone. All Rights Reserved.
                <p className="mt-2 text-xs text-gray-400">
                    This project is a Flipkart clone built for educational purposes only. Not affiliated with or endorsed by Flipkart.
                </p>
            </div>

        </footer>
    );
};

export default Footer;
