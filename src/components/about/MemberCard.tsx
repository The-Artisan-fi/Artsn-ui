import React from "react";
import { Linkedin, Instagram, Twitter } from "lucide-react";

// MemberCard component which accepts props
type Member = {
  name: string;
  title: string;
  imageUrl: string;
  achievements: string[];
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
};

const MemberCard: React.FC<{ member: Member }> = ({ member }) => {
  const socialIcons = [
    {
      url: member.socialLinks.linkedin,
      Icon: Linkedin,
      label: "LinkedIn"
    },
    {
      url: member.socialLinks.instagram,
      Icon: Instagram,
      label: "Instagram"
    },
    {
      url: member.socialLinks.twitter,
      Icon: Twitter,
      label: "Twitter"
    }
  ].filter(social => social.url && social.url.trim() !== '');

  return (
    <div className="bg-white border rounded-3xl p-6 text-center flex flex-col justify-evenly w-full min-h-[420px] mx-auto">
      {/* Profile Image */}
      <img
        src={member.imageUrl}
        alt={member.name}
        className="w-32 h-32 rounded-full mx-auto"
      />

      {/* Title */}
      <h2 className="text-sm font-normal mt-4">{member.title}</h2>
      <h1 className="text-2xl font-semibold mt-1">{member.name}</h1>

      {/* Achievements */}
      <ul className="mt-4 space-y-2 text-gray-500 text-xs">
        {member.achievements.map((achievement, index) => (
          <li key={index}>• {achievement}</li>
        ))}
      </ul>

      {/* Social Media Icons */}
      {socialIcons.length > 0 && (
        <div className="flex justify-center space-x-4 mt-6">
          {socialIcons.map(({ url, Icon, label }) => (
            <a
              key={label}
              href={url}
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberCard;