"use client";
import React from "react";

const refundPolicy = [
    {
        title: "No Refunds",
        content: [
            "At Viavela, we strive to provide our customers with high-quality digital products and services. However, we understand that there may be occasions where a refund is necessary.",
            "Please read our refund policy carefully before making a purchase:",
            "We do not offer refunds for payments made for the Viavela virtual business card and business profile solution. All payments are considered final and non-refundable."
        ]
    },
    {
        title: "Quality Assurance",
        content: [
            "We stand behind the quality and functionality of our Viavela solution. If you encounter any issues or have any concerns about your purchase, please contact our customer support team for assistance."
        ]
    },
    {
        title: "Exceptional Circumstances",
        content: [
            "In rare cases where a refund may be considered due to extenuating circumstances, such as a technical issue preventing access to the Viavela solution, we will review the situation on a case-by-case basis.",
            "Any refund granted in exceptional circumstances will be at the sole discretion of Viavela."
        ]
    },
    {
        title: "Unauthorized Transactions",
        content: [
            "If you believe that an unauthorized transaction has been made using your payment information to purchase the Viavela solution, please contact us at info@viavela.com immediately to report the issue.",
            "We will investigate the matter promptly and take appropriate action, which may include issuing a refund if warranted."
        ]
    },
    {
        title: "Modification of Terms",
        content: [
            "Viavela reserves the right to modify or update this refund policy at any time without prior notice.",
            "Any changes to the refund policy will be effective immediately upon posting on our website."
        ]
    },
    {
        title: "Contact Us",
        content: [
            "If you have any questions or concerns about our refund policy, please contact our customer support team at info@viavela.com or call +251988410000.",
            "By making a purchase of the Viavela solution, you acknowledge and agree to abide by the terms of this refund policy.",
            "Thank you for choosing Viavela for your virtual business card needs."
        ]
    },
    {
        title: "Cancellation",
        content: [
            "The deadline for cancelling an Order is 7 days from when you received access to the service or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.",
            "In order to exercise your right of cancellation, you must inform us of your decision via email at info@viavela.com by means of a clear statement.",
            "We will reimburse you no later than 14 days from the day on which we receive the returned Goods. We will use the same means of payment as you used for the Order, and you will not incur any fees for such reimbursement."
        ]
    },
    {
        title: "Conditions for Returns",
        content: [
            "In order for the iCards to be eligible for a return, please make sure that:",
            "1. The iCards were purchased in the last 7 days",
            "The following iCards cannot be returned:",
            "1. The Customized iCards that have been personalized will not be eligible for return or refund and the subscription fees are non-refundable after the initial trial period.",
            "2. The customized iCards where the date of expiry is over.",
            "3. The iCards which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.",
            "4. The iCards which are, after delivery, according to their nature, inseparably mixed with other items.",
            "We reserve the right to refuse returns of any merchandise that does not meet the above return conditions in our sole discretion."
        ]
    },
    {
        title: "Returning iCards",
        content: [
            "You are responsible for the cost and risk of returning the iCard to us. You should send it at the following address:",
            "Bambis, Addis Ababa, Ethiopia",
            "De Leopol Hotel's Office Building, 6th Floor, Viavela.",
            "We cannot be held responsible for iCards damaged or lost in return shipment. Therefore, we recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the iCard or proof of received return delivery."
        ]
    },
    {
        title: "Contact Us (Returns)",
        content: [
            "If you have any questions about our Returns and Refunds Policy, please contact us:",
            "Via email: info@viavela.com"
        ]
    }
];

export default function RefundPage() {
    return (
        <main className="min-h-screen bg-neutral-50 py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Viavela Refund Policy</h1>
                <p className="text-gray-500 mb-6">Last updated: April 30, 2024</p>
                <div className="space-y-8">
                    {refundPolicy.map((section, idx) => (
                        <section key={idx} className="fade-up">
                            <h2 className="text-xl font-semibold text-purple-600 mb-2">{section.title}</h2>
                            {section.content.map((line, i) => (
                                <p key={i} className="text-gray-700 mb-2">{line}</p>
                            ))}
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
