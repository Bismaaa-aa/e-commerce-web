import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#023859] text-white mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Help Section */}
                <div>
                    <h2 className="text-lg font-bold mb-4 border-b border-[#056EA5] inline-block pb-1">
                        Need Help?
                    </h2>
                    <ul className="space-y-2 text-gray-200">
                        <li>FAQs</li>
                        <li>Help</li>
                        <li>Frequently Asked Questions</li>
                        <li>Terms & Conditions</li>
                        <li>Privacy Policy</li>
                        <li>Disclaimer</li>
                    </ul>
                </div>

                {/* More from Shopease */}
                <div>
                    <h2 className="text-lg font-bold mb-4 border-b border-[#056EA5] inline-block pb-1">
                        More From Shopease
                    </h2>
                    <ul className="space-y-2 text-gray-200">
                        <li>About Us</li>
                        <li>Blogs</li>
                        <li>Cloth Care</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h2 className="text-lg font-bold mb-4 border-b border-[#056EA5] inline-block pb-1">
                        Get the latest news
                    </h2>
                    <div className="flex flex-col space-y-3">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#056EA5]"
                        />
                        <button className="bg-[#056EA5] hover:bg-[#04547E] py-2 rounded-md font-semibold transition">
                            Confirm
                        </button>
                    </div>
                </div>

                {/* Socials and Payment */}
                <div>
                    <h2 className="text-lg font-bold mb-4 border-b border-[#056EA5] inline-block pb-1">
                        Our Socials
                    </h2>
                    <div className="flex gap-4 mb-6">
                        <Facebook className="w-6 h-6 cursor-pointer hover:text-[#BFD7ED]" />
                        <Instagram className="w-6 h-6 cursor-pointer hover:text-[#BFD7ED]" />
                        <Twitter className="w-6 h-6 cursor-pointer hover:text-[#BFD7ED]" />
                        <Youtube className="w-6 h-6 cursor-pointer hover:text-[#BFD7ED]" />
                    </div>

                    <p className="font-semibold text-gray-300 mb-2">100% Safe Checkout</p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                            alt="Visa"
                            className="h-6"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard_2019_logo.svg"
                            alt="MasterCard"
                            className="h-6"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                            alt="PayPal"
                            className="h-6"
                        />
                    </div>

                    <p className="text-sm text-gray-400">Secured by SSL</p>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="bg-[#012B45] py-4 text-center text-sm text-gray-300 border-t border-[#04547E]">
                Copyright © 2025 Weaves Corporation Limited (Formerly Shopease Corporation)
            </div>
        </footer>
    );
}
