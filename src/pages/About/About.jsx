import "./About.scss";
import Navbar from "../../components/Navbar/Navbar";

import { FaLinkedin, FaTwitter } from "react-icons/fa";

// team images
import renato from "../../assets/about/renato.webp";
import domenico from "../../assets/about/domenico.webp";
import paolo from "../../assets/about/paolo.webp";
import leonardo from "../../assets/about/leonardo.webp";
import macarena from "../../assets/about/macarena.webp";
import brian from "../../assets/about/brian.jpeg";
import PartnersMarque from "../../components/PartnersMarque/PartnersMarque";

// video
import video from "../../assets/about/artisan.mp4";

const teamDataDesktop = [
    {
        name: "Renato Capizzi",
        title: "CEO & Founder",
        img: renato,
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
        img: leonardo,
        about: [
            "Solana Specialist", 
            "Teacher at Web3 builder alliance"
        ],
        linkedIn: "#", // Leonardo's LinkedIn link is missing
        twitter: "https://twitter.com/L0STE_", // Adding Leonardo's Twitter link
    },
    {
        name: "Brian Frederiksen",
        title: "COO",
        img: brian,
        about: [
            "Managing Partner & Monaco Foundry CEO",
            "WEOPTIT Senior Government Advisor, Finland Global Head of Business Development, IBM Watson Chief Strategy & Operating Officer", 
        ],
        linkedIn: "https://www.linkedin.com/in/brianfrederiksen/", // Leonardo's LinkedIn link is missing
        twitter: "#", 
    },
    {
        name: "Paolo Piana",
        title: "Lead UX/UI Designer ",
        img: paolo,
        about: [
            "Web3 Marketer & UX Designer",
            "2y Web3 full time (SMEs and DFINITY Foundation)",
        ],
        linkedIn: "https://www.linkedin.com/in/paolo-piana/",
        twitter: "https://twitter.com/pinoweb3",
    },
    {
        name: "Macarena Segura",
        title: "Lead Strategic Partnership",
        img: macarena,
        about: [
            "International lawyer ",
            "Regulatory advisory in blockchain, virtual currencies & financial assets. " 
        ],
        linkedIn: "https://www.linkedin.com/in/macarena-linaza-segura/",
        twitter: "#", // Macarena's Twitter link is missing
    },
    {
        name: "Domenico Fava",
        title: "Legal Advisor & Data Protection Officer",
        img: domenico,
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
        img: renato,
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
        img: leonardo,
        about: [
            "Solana Specialist", 
            "Teacher at Web3 builder alliance"
        ],
        linkedIn: "#", // Leonardo's LinkedIn link is missing
        twitter: "https://twitter.com/L0STE_", // Adding Leonardo's Twitter link
    },
    {
        name: "Brian Frederiksen",
        title: "COO",
        img: brian,
        about: [
            "Managing Partner & Monaco Foundry CEO",
            "WEOPTIT Senior Government Advisor, Finland Global Head of Business Development, IBM Watson Chief Strategy & Operating Officer", 
        ],
        linkedIn: "https://www.linkedin.com/in/brianfrederiksen/", // Leonardo's LinkedIn link is missing
        twitter: "#", 
    },
    {
        name: "Paolo Piana",
        title: "Lead UX/UI Designer ",
        img: paolo,
        about: [
            "Web3 Marketer & UX Designer",
            "2y Web3 full time (SMEs and DFINITY Foundation)",
        ],
        linkedIn: "https://www.linkedin.com/in/paolo-piana/",
        twitter: "https://twitter.com/pinoweb3",
    },
    {
        name: "Macarena Segura",
        title: "Lead Strategic Partnership",
        img: macarena,
        about: [
            "International lawyer ",
            "Regulatory advisory in blockchain, virtual currencies & financial assets. " 
        ],
        linkedIn: "https://www.linkedin.com/in/macarena-linaza-segura/",
        twitter: "#", // Macarena's Twitter link is missing
    },
    {
        name: "Domenico Fava",
        title: "Legal Advisor & Data Protection Officer",
        img: domenico,
        about: [
            "Legal expert for several entities",
            "Certified data protection officer",
            "Web 3 investor and advisor",
        ],
        linkedIn: "https://www.linkedin.com/in/domenico-fava-5bb17336/",
        twitter: "#", // Domenico's Twitter link is missing
    },
];

// Determine the appropriate team data based on viewport size
const teamDataToDisplay = window.innerWidth <= 768 ? teamDataMobile : teamDataDesktop;

const About = () => {
    return (
        <div className="about">
            <div className="about__header">
                <Navbar />
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
