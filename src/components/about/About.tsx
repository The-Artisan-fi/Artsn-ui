import MemberCard from "./MemberCard";

// const members = [
//   {
//     name: "Craig Pollock",
//     title: "CEO & Founder",
//     imageUrl: "/assets/about/brian.png", // Update with actual image path
//     achievements: [
//       "Founding Partner - F1 - Formula Equal (F=)",
//       "Partner and Senior Advisor - Monaco Foundry",
//       "Founder & Chairman - Pure Corporation Sa - F1 Hybrid Power Unit Design And Development",
//       "Founder - PK Racing IndyCar",
//     ],
//     socialLinks: {
//       linkedin: "#",
//       instagram: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Domenico Fava",
//     title: "CTO & Co-Founder",
//     imageUrl: "/assets/about/domenico.png", // Update with actual image path
//     achievements: [
//       "Co-Founded XYZ Company",
//       "Developed ABC Technology",
//       "Partnered with global tech giants",
//     ],
//     socialLinks: {
//       linkedin: "#",
//       instagram: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Matt Weichel",
//     title: "CTO & Co-Founder",
//     imageUrl: "/assets/about/matt.jpeg", // Update with actual image path
//     achievements: [
//       "The brain behind the idea",
//       "8+ years of management experience",
//       "Cryptocurrency trader",
//     ],
//     socialLinks: {
//       linkedin: "#",
//       instagram: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Domenico Fava",
//     title: "CTO & Co-Founder",
//     imageUrl: "/images/member.png", // Update with actual image path
//     achievements: [
//       "Co-Founded XYZ Company",
//       "Developed ABC Technology",
//       "Partnered with global tech giants",
//     ],
//     socialLinks: {
//       linkedin: "#",
//       instagram: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Matt Weichel",
//     title: "CTO & Co-Founder",
//     imageUrl: "/images/member.png", // Update with actual image path
//     achievements: [
//       "The brain behind the idea",
//       "8+ years of management experience",
//       "Cryptocurrency trader",
//     ],
//     socialLinks: {
//       linkedin: "#",
//       instagram: "#",
//       twitter: "#",
//     },
//   },
//   {
//     name: "Domenico Fava",
//     title: "CTO & Co-Founder",
//     imageUrl: "/images/member.png", // Update with actual image path
//     achievements: [
//       "Co-Founded XYZ Company",
//       "Developed ABC Technology",
//       "Partnered with global tech giants",
//     ],
//     socialLinks: {
//       linkedin: "#",
//       instagram: "#",
//       twitter: "#",
//     },
//   },
//   // Add more members as needed...
// ];

import Renato from "/public/assets/about/renato.webp";
import Leonardo from "/public/assets/about/leonardo.webp";
import Brian from "/public/assets/about/brian.png";
import Paolo from "/public/assets/about/paolo.webp";
import Craig from "/public/assets/about/craig.jpg";
import Macarena from "/public/assets/about/macarena.webp";
import Domenico from "/public/assets/about/domenico.webp";
import Matt from "/public/assets/about/matt.jpeg";
import { link } from "fs";


const members = [
    {
        name: "Renato Capizzi",
        title: "CEO & Founder",
        imageUrl: "/assets/about/renato.webp",
        achievements: [
            "The brain behind the idea",
            "8+ years of management experience.",
            "Cryptocurrency trader",
        ],
        socialLinks: {
            linkedin: "https://www.linkedin.com/in/renatocapizzi/",
            instagram: "#",
            twitter: "https://twitter.com/Capiz92",
        },
    },
    {
        name: "Leonardo Donatacci",
        title: "CTO",
        imageUrl: "/assets/about/leonardo.webp",
        achievements: [
            "Solana Specialist",
            "Senior Protocol & Smart Contract Developer", 
            "Teacher & Educator at Web3 builder alliance"
        ],
        socialLinks: {
            linkedin: "#", // Leonardo's LinkedIn link is missing
            instagram: "#", // Leonardo's Instagram link is missing
            twitter: "https://twitter.com/L0STE_", // Adding Leonardo's Twitter link
        },
    },
    {
        name: "Brian Frederiksen",
        title: "COO",
        imageUrl: "/assets/about/brian.png",
        achievements: [
            "Managing Partner - Monaco Foundry",
            "CEO - WEOPTIT", 
            "Senior Government Advisor - Finland", 
            "Global Head of Business Development - IBM Watson", 
            "Chief Strategy & Operating Officer - Merck & Co Healthcare Services",
        ],
        socialLinks: {
            linkedin: "https://www.linkedin.com/in/brianfrederiksen/",
            instagram: "#", // Brian's Instagram link is missing
            twitter: "#", // Brian's Twitter link is missing
        },
    },
    {
        name: "Craig Pollock",
        title: "F1 Ambassador",
        imageUrl: "/assets/about/craig.jpg",
        achievements: [
            "Founding Partner - F1 - Formula Equal (F=)",
            "Partner and Senior Advisor - Monaco Foundry",
            "Founder & Chairman - Pure Corporation Sa - F1 Hybrid Power Unit Design And Development",
            "Founder - PK Racing IndyCar",
            "Co-Founder - Stellar Management Ltd. Managing Jacques Villeneuve, Ayrton Senna Foundation rights, Prost rights",
        ],
        socialLinks: {
            linkedin: "#", // Craig's LinkedIn link is missing
            instagram: "#", // Craig's Instagram link is missing
            twitter: "#", // Craig's Twitter link is missing
        },
    },
    {
        name: "Domenico Fava",
        title: "Identity Verification & Data Protection",
        imageUrl: "/assets/about/domenico.webp",
        achievements: [
            "Legal expert for several entities",
            "Certified data protection officer",
            "Web 3 investor and advisor",
        ],
        socialLinks: {
            linkedIn: "https://www.linkedin.com/in/domenico-fava-5bb17336/",
            twitter: "#", // Domenico's Twitter link is missing
        },
    },
    {
        name: "Matt Weichel",
        title: "Full Stack Developer",
        imageUrl: "/assets/about/matt.jpeg",
        achievements: [
          "Full Stack Developer at Swiss Lynx Solutions",
          "TypeScript & Rust Developer",
          "Former Buildspace Teaching Assistant",
          "Swiss Lacrosse U20 National Team Coach",
        ],
        socialLinks: {
            linkedIn: "https://www.linkedin.com/in/mattweichel/",
            twitter: "https://twitter.com/_matt_xyz", // Matt's Twitter link is missing
        },
    },
];

export default function About() {
  return (
    <div className="bg-gray-light py-16 w-full mt-20">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-2">
          Making Luxury Asset Investing Accessible to All
        </h3>
        <p className="text-lg font-normal mb-10">
        Experience the world of luxury watches, fine art, classic cars and more through fractional ownership. 
        These historically appreciating assets are now within reach, offering everyone the opportunity to build wealth through curated luxury investments.
        </p>
        <div className="w-full flex justify-center">
          <button className="px-4 py-2 bg-white border text-sm rounded-2xl hover:bg-gray-800">
            Meet the Team
          </button>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 my-12">
          {members.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
