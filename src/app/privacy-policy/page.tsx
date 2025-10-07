import React from "react";

const privacyPolicy = [
    {
        title: "Privacy Policy for viavela",
        content: `At viavela, accessible from https://viavela.et/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by viavela and how we use it.`
    },
    {
        title: "Consent",
        content: `By using our website, you hereby consent to our Privacy Policy and agree to its terms.`
    },
    {
        title: "Information we collect",
        content: `The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

    If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

    When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.`
    },
    {
        title: "How we use your information",
        content: `We use the information we collect in various ways, including to:

1. Provide, operate, and maintain our website
2. Improve, personalize, and expand our website
3. Understand and analyze how you use our website
4. Develop new products, services, features, and functionality
5. Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
6. Send you emails
7. Find and prevent fraud`
    },
    {
        title: "Log Files",
        content: `viavela follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services analytics.

The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users movement on the website, and gathering demographic information.`
    },
    {
        title: "Cookies and Web Beacons",
        content: `Like any other website, viavela uses cookies. These cookies are used to store information including visitors preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users experience by customizing our web page content based on visitors browser type and/or other information.`
    },
    {
        title: "Advertising Partners Privacy Policies",
        content: `You may consult this list to find the Privacy Policy for each of the advertising partners of viavela.

Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on viavela, which are sent directly to users browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.

Note that viavela has no access to or control over these cookies that are used by third-party advertisers.`
    },
    {
        title: "Third Party Privacy Policies",
        content: `viavela's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.`
    },
    {
        title: "CCPA Privacy Rights (Do Not Sell My Personal Information)",
        content: `Under the CCPA, among other rights, California consumers have the right to:
- Request that a business that collects a consumers personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.
- Request that a business delete any personal data about the consumer that a business has collected.
- Request that a business that sells a consumers personal data, not sell the consumers personal data.

If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.`
    },
    {
        title: "GDPR Data Protection Rights",
        content: `We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
- The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.
- The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.
- The right to erasure – You have the right to request that we erase your personal data, under certain conditions.
- The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.
- The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.
- The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.

If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.`
    },
    {
        title: "Children's Information",
        content: `Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

viavela does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.`
    }
];

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white">
            <main className="max-w-3xl mx-auto py-16 px-4">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/40 p-8">
                    <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Privacy Policy</h1>
                    <div className="flex justify-center mb-8">
                        <span className="block w-24 h-1 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-lg animate-pulse"></span>
                    </div>
                    <div className="space-y-8">
                        {privacyPolicy.map((section, idx) => (
                            <section key={idx}>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{section.title}</h2>
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{section.content}</p>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}