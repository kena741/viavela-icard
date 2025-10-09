"use client";
import React from "react";

const termsSections = [
    {
        title: "Introduction",
        content: [
            "Welcome to blinkcard!",
            "These terms and conditions outline the rules and regulations for the use of blinkcard's Website, located at https://blinkcard.com/. By accessing this website we assume you accept these terms and conditions. Do not continue to use blinkcard if you do not agree to take all of the terms and conditions stated on this page."
        ]
    },
    {
        title: "Terminology",
        content: [
            "The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: 'Client', 'You' and 'Your' refers to you, the person log on this website and compliant to the Company’s terms and conditions. 'The Company', 'Ourselves', 'We', 'Our' and 'Us', refers to our Company. 'Party', 'Parties', or 'Us', refers to both the Client and ourselves.",
            "All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands."
        ]
    },
    {
        title: "Cookies",
        content: [
            "We employ the use of cookies. By accessing blinkcard, you agreed to use cookies in agreement with the blinkcard Privacy Policy.",
            "Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies."
        ]
    },
    {
        title: "License",
        content: [
            "Unless otherwise stated, blinkcard and/or its licensors own the intellectual property rights for all material on blinkcard. All intellectual property rights are reserved. You may access this from blinkcard for your own personal use subjected to restrictions set in these terms and conditions.",
            "You must not: Republish material from blinkcard, Sell, rent or sub-license material from blinkcard, Reproduce, duplicate or copy material from blinkcard, Redistribute content from blinkcard."
        ]
    },
    {
        title: "Comments",
        content: [
            "Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. blinkcard does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of blinkcard, its agents and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, blinkcard shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.",
            "blinkcard reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.",
            "You warrant and represent that: You are entitled to post the Comments on our website and have all necessary licenses and consents to do so; The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party; The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy; The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.",
            "You hereby grant blinkcard a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media."
        ]
    },
    {
        title: "Hyperlinking to our Content",
        content: [
            "The following organizations may link to our Website without prior written approval: Government agencies; Search engines; News organizations; Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Website.",
            "These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.",
            "We may consider and approve other link requests from the following types of organizations: commonly-known consumer and/or business information sources; dot.com community sites; associations or other groups representing charities; online directory distributors; internet portals; accounting, law and consulting firms; and educational institutions and trade associations.",
            "We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of blinkcard; and (d) the link is in the context of general resource information."
        ]
    },
    {
        title: "Reservation of Rights & Liability",
        content: [
            "Limit or exclude our or your liability for death or personal injury; Limit or exclude our or your liability for fraud or fraudulent misrepresentation; Limit any of our or your liabilities in any way that is not permitted under applicable law; or Exclude any of our or your liabilities that may not be excluded under applicable law.",
            "The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.",
            "As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature."
        ]
    }
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-neutral-50 py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Terms and Conditions</h1>
                <p className="text-gray-500 mb-6">Welcome to blinkcard!</p>
                <div className="space-y-8">
                    {termsSections.map((section, idx) => (
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
