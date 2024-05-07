"use client"
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import "@/styles/About.scss";
// import { Form, Input } from "antd";

import { FaLinkedin, FaTwitter } from "react-icons/fa";

import PartnersMarque from "@/components/PartnersMarque/PartnersMarque";

const teamDataDesktop = [
    {
        name: "Renato Capizzi",
        title: "CEO & Founder",
        img: "/assets/about/renato",
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
        img: "/assets/about/leonardo",
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
        img: "/assets/about/brian",
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
        name: "Paolo Piana",
        title: "Lead UX/UI Designer ",
        img: "/assets/about/paolo",
        about: [
            "Web3 Marketer & UX Designer",
            "Web3 full time (SMEs and DFINITY Foundation)",
        ],
        linkedIn: "https://www.linkedin.com/in/paolo-piana/",
        twitter: "https://twitter.com/pinoweb3",
    },
    {
        name: "Craig Pollock",
        title: "F1 Ambassador",
        img: "/assets/about/craig",
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
    {
        name: "Macarena Segura",
        title: "Regulatory & Strategy Lead",
        img: "/assets/about/macarena",
        about: [
            "International Fintech Lawyer",
            "Blockchain, RegTech, Cybersecurity, IDV, Crypto Assets, Web3",
            "Regulatory Supervisor - Bank de España",
            "Regulatory Advisory Fintech & Digital Assets - KPMG",
            "Regulatory Advisory Fintech & Digital Assets - PwC"
        ],
        linkedIn: "https://www.linkedin.com/in/macarena-linaza-segura/",
        twitter: "#", // Macarena's Twitter link is missing
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
        img: "/assets/about/domenico",
        about: [
            "Legal expert for several entities",
            "Certified data protection officer",
            "Web 3 investor and advisor",
        ],
        linkedIn: "https://www.linkedin.com/in/domenico-fava-5bb17336/",
        twitter: "#", // Domenico's Twitter link is missing
    },
];

// teamData array with the original order
const teamDataMobile = [
    {
        name: "Renato Capizzi",
        title: "CEO & Founder",
        img: "/assets/about/renato",
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
        img: "/assets/about/leonardo",
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
        img: "/assets/about/brian",
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
        name: "Paolo Piana",
        title: "Lead UX/UI Designer ",
        img: "/assets/about/paolo",
        about: [
            "Web3 Marketer & UX Designer",
            "Web3 full time (SMEs and DFINITY Foundation)",
        ],
        linkedIn: "https://www.linkedin.com/in/paolo-piana/",
        twitter: "https://twitter.com/pinoweb3",
    },
    {
        name: "Craig Pollock",
        title: "F1 Ambassador",
        img: "/assets/about/craig",
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
    {
        name: "Macarena Segura",
        title: "Regulatory & Strategy Lead",
        img: "/assets/about/macarena",
        about: [
            "International Fintech Lawyer",
            "Blockchain, RegTech, Cybersecurity, IDV, Crypto Assets, Web3",
            "Regulatory Supervisor - Bank de España",
            "Regulatory Advisory Fintech & Digital Assets - KPMG",
            "Regulatory Advisory Fintech & Digital Assets - PwC"
        ],
        linkedIn: "https://www.linkedin.com/in/macarena-linaza-segura/",
        twitter: "#", // Macarena's Twitter link is missing
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
        img: "/assets/about/domenico",
        about: [
            "Legal expert for several entities",
            "Certified data protection officer",
            "Web 3 investor and advisor",
        ],
        linkedIn: "https://www.linkedin.com/in/domenico-fava-5bb17336/",
        twitter: "#", // Domenico's Twitter link is missing
    },
];


const About: NextPage = (props) => {
    const [teamDataToDisplay, setTeamDataToDisplay] = useState(teamDataMobile);
    // const onFinish = (values: unknown) => {
    //     console.log("Received values:", values);
    //     // You can handle form submission logic here
    // };

    useEffect(() => {
        // Set the appropriate team data based on viewport size
        if (window.innerWidth <= 768) {
            setTeamDataToDisplay(teamDataMobile);
        } else {
            setTeamDataToDisplay(teamDataDesktop);
        }

        // Update the team data when the window is resized
        window.addEventListener("resize", () => {
            if (window.innerWidth <= 768) {
                setTeamDataToDisplay(teamDataMobile);
            } else {
                setTeamDataToDisplay(teamDataDesktop);
            }
        });

        // Clean up the event listener
        return () => {
            window.removeEventListener("resize", () => {});
        };
    }, []);
    return (
        <div className="about">
            <div className="about__header">
                <div className="about__hero padding">
                    <div className="boxed">
                        <h1 className="heading-1">
                            Democratizing Luxury Good Investments
                        </h1>
                        <p className="caption-1">
                            We empower users to delve into the world of watches, art pieces, cars, and beyond at prices within reach. These assets have showcased remarkable growth in valuation over the years, igniting excitement and opportunity for all.
                        </p>
                    </div>
                </div>
            </div>

            {/* team section */}
            <section className="about__team padding">
                <div className="boxed">
                    <h2 className="heading-1">Meet The Team</h2>
                    <div className="about__team__members">
                        {teamDataToDisplay.map((member, index) => {
                            return (
                                <div
                                    key={index}
                                    className="about__team__members__member"
                                >
                                    <img
                                        src={member.img}
                                        alt=""
                                        className="about__team__members__member__img"
                                    />
                                    <h2 className="heading-6">{member.name}</h2>
                                    <p className="caption-3">{member.title}</p>
                                    <ul className="about__team__members__member__abouts">
                                        {member.about.map((fact, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="about__team__members__member__abouts__item caption-4"
                                                >
                                                    {fact}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <div className="about__team__members__member__socials">
                                        <a
                                            href={member.linkedIn}
                                            target="blank"
                                            className="about__team__members__member__socials__link"
                                        >
                                            <FaLinkedin />
                                        </a>
                                        <a
                                            href={member.twitter}
                                            target="blank"
                                            className="about__team__members__member__socials__link"
                                        >
                                            <FaTwitter />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* partners section */}
            <PartnersMarque />
        </div>
    );
};


export default About;
