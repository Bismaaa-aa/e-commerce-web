import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const faqs = [
    {
        question: "Do you deliver outside the city?",
        answer:
            "Currently, we only deliver within the city limits. Deliveries outside the city are not available at the moment.",
    },
    {
        question: "How long does delivery take?",
        answer:
            "Orders are usually delivered within 24–48 hours inside the city, depending on your location and product availability.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept Cash on Delivery (COD) and online payments through debit/credit cards or digital wallets.",
    },
    {
        question: "Can I return or exchange a product?",
        answer:
            "Yes, products can be returned or exchanged within 7 days if they are unused, undamaged, and in original packaging. Grocery and perishable items are non-returnable.",
    },
    {
        question: "How do I track my order?",
        answer:
            "Once your order is confirmed, you will receive an SMS or email with your order ID. You can track it through the ‘My Orders’ section of your account.",
    },
    {
        question: "Do you charge for delivery?",
        answer:
            "Yes, a small delivery fee may apply depending on your order total and location. Free delivery is available for orders above a certain amount.",
    },
    {
        question: "How can I contact customer support?",
        answer:
            "You can contact us via live chat, email at support@imtiazstore.com, or call our helpline during business hours (9 AM – 9 PM).",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const navigate = useNavigate(); // Initialize navigate

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-gray-50 py-10 px-4 md:px-8 lg:px-16 min-h-screen flex flex-col">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#056EA5]">
                ❓ Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-4 flex-1">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-lg text-gray-800"
                        >
                            {faq.question}
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-[#056EA5]" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[#056EA5]" />
                            )}
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-4 text-gray-600 animate-fadeIn">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Go Back Button at the end */}
            <div className="mt-10 flex justify-center">
                <button
                    onClick={() => navigate("/")} // Navigate back to ProductList
                    className="bg-gradient-to-r from-[#056EA5] to-[#023859] text-white px-6 py-3 rounded-full shadow hover:opacity-90 transition-all duration-300"
                >
                    ← Go Back to Products
                </button>
            </div>
        </div>
    );
}
