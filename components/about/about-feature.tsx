// "use client"
// import Image from "next/image";
// import type { NextPage } from "next";
// // import "@/styles/About.scss";

// // import { FaLinkedin, FaTwitter } from "react-icons/fa";

// // import PartnersMarque from "@/components/PartnersMarque/PartnersMarque";
// import Renato from "@/public/assets/about/renato.webp";
// import Leonardo from "@/public/assets/about/leonardo.webp";
// import Brian from "@/public/assets/about/brian.png";
// import Paolo from "@/public/assets/about/paolo.webp";
// import Craig from "@/public/assets/about/craig.jpg";
// import Macarena from "@/public/assets/about/macarena.webp";
// import Domenico from "@/public/assets/about/domenico.webp";
// import Matt from "@/public/assets/about/matt.jpeg";

// const teamDataDesktop = [
//     {
//         name: "Renato Capizzi",
//         title: "CEO & Founder",
//         img: Renato,
//         about: [
//             "The brain behind the idea",
//             "8+ years of management experience.",
//             "Cryptocurrency trader",
//         ],
//         linkedIn: "https://www.linkedin.com/in/renatocapizzi/",
//         twitter: "https://twitter.com/Capiz92",
//     },
//     {
//         name: "Leonardo Donatacci",
//         title: "CTO",
//         img: Leonardo,
//         about: [
//             "Solana Specialist",
//             "Senior Protocol & Smart Contract Developer", 
//             "Teacher & Educator at Web3 builder alliance"
//         ],
//         linkedIn: "#", // Leonardo's LinkedIn link is missing
//         twitter: "https://twitter.com/L0STE_", // Adding Leonardo's Twitter link
//     },
//     {
//         name: "Brian Frederiksen",
//         title: "COO",
//         img: Brian,
//         about: [
//             "Managing Partner - Monaco Foundry",
//             "CEO - WEOPTIT", 
//             "Senior Government Advisor - Finland", 
//             "Global Head of Business Development - IBM Watson", 
//             "Chief Strategy & Operating Officer - Merck & Co Healthcare Services",
//         ],
//         linkedIn: "https://www.linkedin.com/in/brianfrederiksen/",
//         twitter: "#", 
//     },
//     {
//         name: "Craig Pollock",
//         title: "F1 Ambassador",
//         img: Craig,
//         about: [
//             "Founding Partner - F1 - Formula Equal (F=)",
//             "Partner and Senior Advisor - Monaco Foundry",
//             "Founder & Chairman - Pure Corporation Sa - F1 Hybrid Power Unit Design And Development",
//             "Founder - PK Racing IndyCar",
//             "Co-Founder - Stellar Management Ltd. Managing Jacques Villeneuve, Ayrton Senna Foundation rights, Prost rights",
//         ],
//         linkedIn: "https://www.linkedin.com/in/craig-pollock-538a9412/",
//         twitter: "#",
//     },
//     // {
//     //     name: "Simone Leonardi",
//     //     title: "Tax & Fiscal Expert",
//     //     img: simone,
//     //     about: [
//     //         "National and Internationl Fiscal Expert",
//     //         "International Corporate Tax Senior Manager - KPMG",
//     //         "Director - Fiduciaria Antonini",
//     //         "Member - Fiscal Association",
//     //         "Member - Register of Accountant Trustees Ticino Canton", 
//     //     ],
//     //     linkedIn: "https://www.linkedin.com/in/simone-leonardi-a6a13a12/",
//     //     twitter: "#", // Macarena's Twitter link is missing
//     // },
//     {
//         name: "Domenico Fava",
//         title: "Identity Verification & Data Protection",
//         img: Domenico,
//         about: [
//             "Legal expert for several entities",
//             "Certified data protection officer",
//             "Web 3 investor and advisor",
//         ],
//         linkedIn: "https://www.linkedin.com/in/domenico-fava-5bb17336/",
//         twitter: "#", // Domenico's Twitter link is missing
//     },
//     {
//         name: "Matt Weichel",
//         title: "Full Stack Developer",
//         img: Matt,
//         about: [
//             "Full Stack Developer on Solana",
//             "Swiss Lacrosse U20 National Team Coach",
//         ],
//         linkedIn: "https://www.linkedin.com/in/mattweichel/",
//         twitter: "https://twitter.com/_matt_xyz", // Domenico's Twitter link is missing
//     },
// ];


// const About: NextPage = (props) => {
//     return (
//         <div className="about">
//             <div className="about__header">
//                 <div className="about__hero padding">
//                     <div className="boxed">
//                         <h1 className="heading-1">
//                             Democratizing Luxury Good Investments
//                         </h1>
//                         <p className="caption-6">
//                             We empower users to delve into the world of watches, art pieces, cars, and beyond at prices within reach. These assets have showcased remarkable growth in valuation over the years, igniting excitement and opportunity for all.
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* team section */}
//             <section className="about__team padding">
//                 <div className="boxed">
//                     <h2 className="heading-1">Meet The Team</h2>
//                     <div className="about__team__members">
//                         {teamDataDesktop.map((member, index) => {
//                             return (
//                                 <div
//                                     key={index}
//                                     className="about__team__members__member"
//                                 >
//                                     <Image
//                                         src={member.img}
//                                         alt={member.name}
//                                         className="about__team__members__member__img"
//                                     />
//                                     <h2 className="heading-6">{member.name}</h2>
//                                     <p className="caption-3">{member.title}</p>
//                                     <ul className="about__team__members__member__abouts">
//                                         {member.about.map((fact, index) => {
//                                             return (
//                                                 <li
//                                                     key={index}
//                                                     className="about__team__members__member__abouts__item caption-4"
//                                                 >
//                                                     {fact}
//                                                 </li>
//                                             );
//                                         })}
//                                     </ul>

//                                     <div className="about__team__members__member__socials">
//                                         {/* {member.linkedIn !== "#" && (
//                                             <a
//                                                 href={member.linkedIn}
//                                                 target="blank"
//                                                 className="about__team__members__member__socials__link"
//                                             >
//                                                 <FaLinkedin />
//                                             </a>
//                                         )} */}
//                                         {/* {member.twitter !== "#" && (
//                                             <a
//                                                 href={member.twitter}
//                                                 target="blank"
//                                                 className="about__team__members__member__socials__link"
//                                             >
//                                                 <FaTwitter />
//                                             </a>
//                                         )} */}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </section>

//             {/* partners section */}
//             {/* <PartnersMarque /> */}
//         </div>
//     );
// };


// export default About;

"use client"
import Image from "next/image";
import type { NextPage } from "next";
import { Card, CardContent } from "@/components/ui/shadcn/card-ui";

// // import PartnersMarque from "@/components/PartnersMarque/PartnersMarque";
import Renato from "@/public/assets/about/renato.webp";
import Leonardo from "@/public/assets/about/leonardo.webp";
import Brian from "@/public/assets/about/brian.png";
import Paolo from "@/public/assets/about/paolo.webp";
import Craig from "@/public/assets/about/craig.jpg";
import Macarena from "@/public/assets/about/macarena.webp";
import Domenico from "@/public/assets/about/domenico.webp";
import Matt from "@/public/assets/about/matt.jpeg";


const teamDataDesktop = [
    {
        name: "Renato Capizzi",
        title: "CEO & Founder",
        img: Renato,
        about: [
            "The brain behind the idea",
            "8+ years of management experience.",
            "Cryptocurrency trader",
        ],
        linkedIn: "https://www.linkedin.com/in/renatocapizzi/",
        twitter: "https://twitter.com/Capiz92",
    },
    {
        name: "Leonardo Donatacci",
        title: "CTO",
        img: Leonardo,
        about: [
            "Solana Specialist",
            "Senior Protocol & Smart Contract Developer", 
            "Teacher & Educator at Web3 builder alliance"
        ],
        linkedIn: "#", // Leonardo's LinkedIn link is missing
        twitter: "https://twitter.com/L0STE_", // Adding Leonardo's Twitter link
    },
    {
        name: "Brian Frederiksen",
        title: "COO",
        img: Brian,
        about: [
            "Managing Partner - Monaco Foundry",
            "CEO - WEOPTIT", 
            "Senior Government Advisor - Finland", 
            "Global Head of Business Development - IBM Watson", 
            "Chief Strategy & Operating Officer - Merck & Co Healthcare Services",
        ],
        linkedIn: "https://www.linkedin.com/in/brianfrederiksen/",
        twitter: "#", 
    },
    {
        name: "Craig Pollock",
        title: "F1 Ambassador",
        img: Craig,
        about: [
            "Founding Partner - F1 - Formula Equal (F=)",
            "Partner and Senior Advisor - Monaco Foundry",
            "Founder & Chairman - Pure Corporation Sa - F1 Hybrid Power Unit Design And Development",
            "Founder - PK Racing IndyCar",
            "Co-Founder - Stellar Management Ltd. Managing Jacques Villeneuve, Ayrton Senna Foundation rights, Prost rights",
        ],
        linkedIn: "https://www.linkedin.com/in/craig-pollock-538a9412/",
        twitter: "#",
    },
    // {
    //     name: "Simone Leonardi",
    //     title: "Tax & Fiscal Expert",
    //     img: simone,
    //     about: [
    //         "National and Internationl Fiscal Expert",
    //         "International Corporate Tax Senior Manager - KPMG",
    //         "Director - Fiduciaria Antonini",
    //         "Member - Fiscal Association",
    //         "Member - Register of Accountant Trustees Ticino Canton", 
    //     ],
    //     linkedIn: "https://www.linkedin.com/in/simone-leonardi-a6a13a12/",
    //     twitter: "#", // Macarena's Twitter link is missing
    // },
    {
        name: "Domenico Fava",
        title: "Identity Verification & Data Protection",
        img: Domenico,
        about: [
            "Legal expert for several entities",
            "Certified data protection officer",
            "Web 3 investor and advisor",
        ],
        linkedIn: "https://www.linkedin.com/in/domenico-fava-5bb17336/",
        twitter: "#", // Domenico's Twitter link is missing
    },
    {
        name: "Matt Weichel",
        title: "Full Stack Developer",
        img: Matt,
        about: [
            "Full Stack Developer on Solana",
            "Swiss Lacrosse U20 National Team Coach",
        ],
        linkedIn: "https://www.linkedin.com/in/mattweichel/",
        twitter: "https://twitter.com/_matt_xyz", // Domenico's Twitter link is missing
    },
];

const SocialIcon = () => (
  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const About: NextPage = () => {
    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <section className="w-full py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-6">
                        Democratizing Luxury Good Investments
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        We empower users to delve into the world of watches, art pieces, cars, and beyond at 
                        prices within reach. These assets have showcased remarkable growth in valuation 
                        over the years, igniting excitement and opportunity for all.
                    </p>
                </div>
            </section>

            {/* Team Section */}
            <section className="w-full py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Meet The Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamDataDesktop.map((member, index) => (
                            <Card key={index} className="bg-white overflow-hidden border border-gray-100 rounded-lg shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative w-16 h-16">
                                            <Image
                                                src={member.img}
                                                alt={member.name}
                                                className="rounded-full object-cover"
                                                fill
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{member.name}</h3>
                                            <p className="text-gray-600">{member.title}</p>
                                        </div>
                                    </div>
                                    
                                    <ul className="space-y-2 mb-4">
                                        {member.about.map((fact, idx) => (
                                            <li key={idx} className="text-gray-600 text-sm flex items-start">
                                                <span className="mr-2">•</span>
                                                {fact}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex gap-2">
                                        {member.linkedIn !== "#" && (
                                            <div className="p-1">
                                                <SocialIcon />
                                            </div>
                                        )}
                                        {member.twitter !== "#" && (
                                            <div className="p-1">
                                                <SocialIcon />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="w-full py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-center text-gray-500 mb-8">Trusted by</h3>
                    <div className="flex justify-center items-center gap-12 opacity-50">
                        {/* Add your partner logos here */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;