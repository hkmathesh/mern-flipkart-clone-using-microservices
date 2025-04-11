import { Link } from "react-router-dom";
import mobile from "../assets/images/mobile.jpg";
import laptop from "../assets/images/laptop.jpg";
import dress from "../assets/images/dress.jpg";
import accessory from "../assets/images/accessory.jpg";
import shoe from "../assets/images/shoe.jpg";

const categories = [
    { name: "Mobiles", path: "/products?category=mobiles", image: mobile },
    { name: "Laptops", path: "/products?category=laptops", image: laptop },
    { name: "Dresses", path: "/products?category=dresses", image: dress },
    { name: "Accessories", path: "/products?category=accessories", image: accessory },
    { name: "Shoes", path: "/products?category=shoes", image: shoe }
];

const Home = () => {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-[calc(100vh-4rem)] flex flex-col items-center py-10">
            <h1 className="text-6xl font-extrabold mb-8 text-gray-900 drop-shadow-lg px-1 text-center">Welcome to Our Store</h1>
            <p className="text-lg text-gray-800 mb-12 max-w-2xl text-center px-1">Discover the best deals on top-quality products. Browse our categories and shop with confidence.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        to={category.path}
                        className="group bg-white shadow-lg p-6 rounded-xl text-center text-xl font-semibold hover:shadow-2xl transition duration-300 w-56 transform hover:scale-105 border border-gray-200"
                    >
                        <div className="w-full">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-40 object-cover rounded-lg mb-4 border border-gray-300 group-hover:opacity-80 transition duration-300"
                            />
                            <span className="block text-gray-800 group-hover:text-blue-600 transition duration-300">{category.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
