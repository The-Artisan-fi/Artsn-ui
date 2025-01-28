'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Linkedin, Twitter, Instagram } from 'lucide-react'
import MemberCardContainer from './MemberCardContainer'

const About: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }
  const members = [
    {
      name: 'Renato Capizzi',
      title: 'CEO & Founder',
      imageUrl: '/assets/about/renato.webp',
      achievements: [
        'The brain behind the idea',
        '8+ years of management experience',
        'Web3 Consultant for Monaco Foundry',
        'Founder of multiple successful Web3 projects',
        'Cryptocurrency trader',
      ],
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/renatocapizzi/',
        instagram: '#',
        twitter: 'https://twitter.com/Capiz92',
      },
    },
    {
      name: 'Matt Weichel',
      title: 'CTO',
      imageUrl: '/assets/about/matt.jpeg',
      achievements: [
        'Founder of Swiss Lynx Solutions',
        'Full-Stack & Solana Program Developer',
        'Over 10 years experience in Leadership & Management',
        'Former Buildspace Teaching Assistant',
        'Swiss Lacrosse U20 National Team Coach',
      ],
      socialLinks: {
        linkedIn: 'https://www.linkedin.com/in/mattweichel/',
        twitter: 'https://twitter.com/_matt_xyz',
      },
    },
    {
      name: 'Brian Frederiksen',
      title: 'COO',
      imageUrl: '/assets/about/brian.png',
      achievements: [
        'Managing Partner - Monaco Foundry',
        'CEO - WEOPTIT',
        'Senior Government Advisor - Finland',
        'Global Head of Business Development - IBM Watson',
        'Chief Strategy & Operating Officer - Merck & Co Healthcare Services',
      ],
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/brianfrederiksen/',
        instagram: '#', // Brian's Instagram link is missing
        twitter: '#', // Brian's Twitter link is missing
      },
    },
    {
      name: 'Leonardo Donatacci',
      title: 'Advisor',
      imageUrl: '/assets/about/leonardo.webp',
      achievements: [
        'Solana Specialist',
        'Senior Protocol & Smart Contract Developer',
        'Teacher & Educator at Web3 builder alliance',
        'Community Developer at Metaplex',
        'SuperTeam Germany Contributor',
      ],
      socialLinks: {
        linkedin: '#', // Leonardo's LinkedIn link is missing
        instagram: '#', // Leonardo's Instagram link is missing
        twitter: 'https://twitter.com/L0STE_', // Adding Leonardo's Twitter link
      },
    },
    {
      name: 'Craig Pollock',
      title: 'F1 Ambassador',
      imageUrl: '/assets/about/craig.jpg',
      achievements: [
        'Founding Partner - F1 - Formula Equal (F=)',
        'Partner and Senior Advisor - Monaco Foundry',
        'Founder & Chairman - Pure Corporation Sa - F1 Hybrid Power Unit Design And Development',
        'Founder - PK Racing IndyCar',
        'Co-Founder - Stellar Management Ltd. Managing Jacques Villeneuve, Ayrton Senna Foundation rights, Prost rights',
      ],
      socialLinks: {
        linkedin: '#', // Craig's LinkedIn link is missing
        instagram: '#', // Craig's Instagram link is missing
        twitter: '#', // Craig's Twitter link is missing
      },
    },
    {
      name: 'Domenico Fava',
      title: 'Identity Verification & Data Protection',
      imageUrl: '/assets/about/domenico.webp',
      achievements: [
        'Legal expert for several entities',
        'Certified data protection officer',
        'Web 3 investor and advisor',
      ],
      socialLinks: {
        linkedIn: 'https://www.linkedin.com/in/domenico-fava-5bb17336/',
        twitter: '#', // Domenico's Twitter link is missing
      },
    },
  ]

  return (
    <div className="mt-20 w-full bg-gray-50/50 py-16">
      <div className="mx-auto max-w-7xl text-center">
        <h3 className="mb-2 text-4xl font-bold">
          Making Luxury Asset Investing Accessible to All
        </h3>
        <p className="mx-auto mb-10 max-w-3xl text-lg font-normal">
          Experience the world of luxury watches, fine art, classic cars and
          more through fractional ownership. These historically appreciating
          assets are now within reach, offering everyone the opportunity to
          build wealth through curated luxury investments.
        </p>
        <div className="flex w-full justify-center">
          <Button variant="outline" className="rounded-2xl">
            Meet the Team
          </Button>
        </div>
        <div className="mt-12">
          <MemberCardContainer members={members} />
        </div>
      </div>
    </div>
  )
}

export default About
