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

import bgImg from "../assets/bg.jfif";
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
        <div className="flex flex-col items-center justify-center text-center text-[#023859] bg-gradient-to-b from-blue-50 via-white to-blue-50 transition-colors duration-500 overflow-hidden">
            {/* Floating Icons */}
            <div className="absolute top-16 left-16 opacity-40 animate-float1">
                <Heart size={36} className="text-[#056EA5]" />
            </div>
            <div className="absolute top-32 right-16 opacity-40 animate-float2">
                <Star size={36} className="text-[#056EA5]" />
            </div>
            <div className="absolute bottom-20 left-24 opacity-40 animate-float3">
                <Gift size={40} className="text-[#034F7B]" />
            </div>
            <div className="absolute bottom-16 right-24 opacity-40 animate-float4">
                <Sparkles size={36} className="text-[#056EA5]" />
            </div>

            {/* 🔹 HERO SECTION */}
            <section
                className="w-full bg-gradient-to-r from-[#056EA5] via-[#034F7B] to-[#023859] text-white flex flex-col items-center justify-center py-28 px-6 shadow-md"
                style={{
                    backgroundImage: `linear-gradient(rgba(2,56,89,0.6), rgba(2,56,89,0.6)), url(${bgImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="mb-6 animate-bounce">
                    <ShoppingBag size={72} className="text-white drop-shadow-lg" />
                </div>

                <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight">
                    <Typewriter
                        words={["Welcome to ShopEase 🛍️"]}
                        loop={0}
                        cursor
                        cursorStyle="|"
                        typeSpeed={100}
                        deleteSpeed={60}
                        delaySpeed={2000}
                    />
                </h1>

                <p className="max-w-2xl text-lg opacity-90 mb-8">
                    Discover quality products, amazing deals, and a shopping experience
                    designed just for you.
                </p>

                <Link
                    to="/shop"
                    className="bg-white text-[#023859] font-semibold px-8 py-3 rounded-full shadow-md hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                >
                    Start Shopping →
                </Link>
            </section>

            {/* 🔹 FEATURED CATEGORIES */}
            <section className="w-full py-20 px-6 bg-gradient-to-b from-[#E6F0FA] via-white to-[#DCEBFA]">
                <h2 className="text-4xl font-bold mb-12 text-[#023859]">Featured Categories</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {[
                        { img: mkpImg, name: "Makeup Products", category: "makeup" },
                        { img: perfumeImg, name: "Perfumes", category: "perfume" },
                        { img: furnitureImg, name: "Furniture", category: "furniture" },
                        { img: fruitsImg, name: "Fruits", category: "fruits" },
                        { img: vegiesImg, name: "Vegetables", category: "vegetables" },
                        { img: meatImg, name: "Meat & Poultry", category: "meat" },
                        { img: honeyImg, name: "Honey", category: "honey" },
                        { img: iceImg, name: "Ice Cream & Juices", category: "icecream" },
                    ].map((item, i) => (
                        <div key={i}>
                            <Link
                                to={`/shop?category=${item.category}`}
                                className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 border border-[#BFD7ED] transition-all duration-300"
                            >
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-[#023859]">
                                        {item.name}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>


            {/* 🔹 WHY SHOP WITH US */}
            <section className="w-full py-20 px-6 bg-gradient-to-r from-[#E6F0FA] to-[#F8FBFF] border-t border-[#BFD7ED]">
                <h2 className="text-4xl font-bold mb-10 text-[#023859]">
                    Why Shop With Us?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-[#BFD7ED]">
                        <Truck size={40} className="text-[#056EA5] mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2 text-[#023859]">
                            Fast Delivery
                        </h3>
                        <p className="text-gray-700">
                            Quick, reliable delivery right to your doorstep.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-[#BFD7ED]">
                        <ShieldCheck size={40} className="text-[#056EA5] mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2 text-[#023859]">
                            Secure Shopping
                        </h3>
                        <p className="text-gray-700">
                            Shop with peace of mind. Your data is always protected.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-[#BFD7ED]">
                        <DollarSign size={40} className="text-[#056EA5] mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2 text-[#023859]">
                            Best Prices
                        </h3>
                        <p className="text-gray-700">
                            Get premium products at unbeatable prices.
                        </p>
                    </div>
                </div>
            </section>

            {/* 🔹 ABOUT US */}
            <section className="w-full py-20 px-6 bg-gradient-to-b from-[#E6F0FA] via-white to-[#DCEBFA]">
                <h2 className="text-4xl font-bold mb-6 text-[#023859]">About Us</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
                    <strong className="text-[#056EA5]">ShopEase</strong> is your all-in-one
                    shopping destination for beauty, lifestyle, and everyday essentials.
                    We believe in quality, affordability, and a seamless experience that
                    makes online shopping truly enjoyable.
                </p>
            </section>

            {/* 🔹 LOCATION */}
            <section className="w-full py-20 px-6 bg-gradient-to-r from-[#E6F0FA] to-[#F8FBFF] border-t border-[#BFD7ED]">
                <h2 className="text-4xl font-bold mb-6 flex justify-center items-center gap-2 text-[#023859]">
                    <MapPin size={36} className="text-[#056EA5]" /> Find Us
                </h2>
                <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-700">
                    Visit our outlet or shop online for exclusive deals and offers!
                </p>

                <iframe
                    title="Store Location"
                    className="w-full max-w-3xl h-72 mx-auto rounded-xl shadow-md border-0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.7634064283413!2d67.0011362745302!3d24.80253767795114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ4JzA5LjEiTiA2N8KwMDAnMDIuMyJF!5e0!3m2!1sen!2s!4v1617896543210!5m2!1sen!2s"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </section>

            {/* 🔹 FOOTER */}
            <footer className="w-full bg-white border-t border-[#BFD7ED] text-gray-600 py-8 text-sm">
                <p>© {new Date().getFullYear()} ShopEase — All rights reserved.</p>
            </footer>
        </div>
    );
}
