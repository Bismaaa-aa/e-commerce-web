import { Link } from "react-router-dom";
import {
    ShoppingBag,
    Heart,
    Star,
    Gift,
    Sparkles,
    Truck,
    ShieldCheck,
    DollarSign,
    MapPin,
} from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

import bgImg from "../assets/bg.jpg";
import mkpImg from "../assets/mkp.jpg";
import perfumeImg from "../assets/perfume.jpg";
import furnitureImg from "../assets/furniture.jfif";
import fruitsImg from "../assets/fruits.jpg";
import vegiesImg from "../assets/vegies.jfif";
import meatImg from "../assets/meat.jfif";
import honeyImg from "../assets/honey.jpg";
import iceImg from "../assets/ice.jfif";

export default function Home() {
    return (
        <div
            className="relative flex flex-col items-center justify-center overflow-hidden text-center transition-colors duration-500 dark:text-gray-200"
            style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Floating Icons */}
            <div className="absolute top-10 left-16 opacity-40 animate-float1">
                <Heart size={40} className="text-pink-300 dark:text-pink-500" />
            </div>
            <div className="absolute top-32 right-20 opacity-40 animate-float2">
                <Star size={36} className="text-yellow-400 dark:text-yellow-300" />
            </div>
            <div className="absolute bottom-20 left-20 opacity-40 animate-float3">
                <Gift size={44} className="text-purple-300 dark:text-purple-500" />
            </div>
            <div className="absolute bottom-16 right-24 opacity-40 animate-float4">
                <Sparkles size={40} className="text-blue-300 dark:text-blue-500" />
            </div>

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="animate-bounce mb-4 drop-shadow-lg">
                    <ShoppingBag size={70} className="text-[#023859] dark:text-gray-200" />
                </div>

                <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#056EA5] via-[#023859] to-[#034F7B] dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 drop-shadow-md mb-3">
                    <Typewriter
                        words={['My E-Commerce Paradise 🛍️']}
                        loop={0}
                        cursor
                        cursorStyle="|"
                        typeSpeed={120}
                        deleteSpeed={50}
                        delaySpeed={2000}
                    />
                </h1>

                <p className="text-[#023859] dark:text-gray-200 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
                    ✨ Discover adorable products, delightful deals, and everything you love — all in one magical shop! 💖
                </p>

                <Link
                    to="/shop"
                    className="bg-gradient-to-r from-[#056EA5] to-[#023859] dark:from-blue-600 dark:to-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300"
                >
                    🛒 Start Shopping
                </Link>

                <div className="mt-10 h-1 w-40 bg-gradient-to-r from-[#056EA5] via-[#034F7B] to-[#023859] dark:from-blue-600 dark:via-blue-500 dark:to-blue-700 rounded-full"></div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-6 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 w-full text-[#023859] dark:text-gray-200 transition-colors duration-500">
                <h2 className="text-4xl font-bold mb-10">✨ Featured Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {[
                        { img: mkpImg, name: "Makeup Products" },
                        { img: perfumeImg, name: "Perfumes" },
                        { img: furnitureImg, name: "Furniture" },
                        { img: fruitsImg, name: "Fruits" },
                        { img: vegiesImg, name: "Vegetables" },
                        { img: meatImg, name: "Meat and Poultry" },
                        { img: honeyImg, name: "Honey" },
                        { img: iceImg, name: "Icecream and Juices" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300 overflow-hidden"
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-[#023859] dark:text-gray-200">{item.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Shop With Us */}
            <section className="py-20 px-6 bg-[#FDE2F3]/60 dark:bg-gray-900/60 w-full text-[#023859] dark:text-gray-200 transition-colors duration-500">
                <h2 className="text-4xl font-bold mb-10">💎 Why Shop With Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 bg-opacity-70 p-6 rounded-2xl shadow-lg">
                        <Truck size={40} className="text-[#056EA5] dark:text-blue-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Fast Delivery</h3>
                        <p>Get your favorite items delivered right to your door — quickly and safely!</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 bg-opacity-70 p-6 rounded-2xl shadow-lg">
                        <ShieldCheck size={40} className="text-[#034F7B] dark:text-blue-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Secure Shopping</h3>
                        <p>Your transactions are encrypted and your data is always safe with us.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 bg-opacity-70 p-6 rounded-2xl shadow-lg">
                        <DollarSign size={40} className="text-[#CDA4DE] dark:text-purple-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Affordable Prices</h3>
                        <p>We offer the best deals on top-quality products — because you deserve more for less!</p>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section className="py-20 px-6 bg-white dark:bg-gray-800 dark:bg-opacity-70 w-full text-[#023859] dark:text-gray-200 transition-colors duration-500">
                <h2 className="text-4xl font-bold mb-6">About Us</h2>
                <p className="max-w-3xl mx-auto text-lg leading-relaxed">
                    Welcome to <strong>My E-Commerce Paradise</strong> — your one-stop shop for fashion, gadgets, and lifestyle products. We’re passionate about delivering quality, variety, and affordability to make your shopping experience truly delightful.
                </p>
            </section>

            {/* Location */}
            <section className="py-20 px-6 bg-[#E0F7FA]/70 dark:bg-gray-900/70 w-full text-[#023859] dark:text-gray-200 transition-colors duration-500">
                <h2 className="text-4xl font-bold mb-6 flex justify-center items-center gap-2">
                    <MapPin size={36} /> Find Us
                </h2>
                <p className="max-w-2xl mx-auto text-lg mb-6">
                    Visit our physical outlet or connect online for exclusive offers!
                </p>
                <iframe
                    title="Store Location"
                    className="w-full max-w-3xl h-72 mx-auto rounded-2xl shadow-lg"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.7634064283413!2d67.0011362745302!3d24.80253767795114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ4JzA5LjEiTiA2N8KwMDAnMDIuMyJF!5e0!3m2!1sen!2s!4v1617896543210!5m2!1sen!2s"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </section>

            {/* Footer */}
            <footer className="py-8 text-[#034F7B] dark:text-gray-200 font-medium">
                © {new Date().getFullYear()} My E-Commerce Paradise | All Rights Reserved 💖
            </footer>
        </div>
    );
}
