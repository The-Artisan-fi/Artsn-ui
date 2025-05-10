import React from 'react'
import Image from 'next/image'
import { Linkedin, Instagram, Twitter } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'

type Member = {
  name: string
  title: string
  imageUrl: string
  achievements: string[]
  socialLinks: {
    linkedin?: string
    instagram?: string
    twitter?: string
  }
}

type SocialIcon = {
  url: string | undefined
  Icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      size?: string | number
      className?: string
    }
  >
  label: string
}

const MotionCard = motion.create(Card)
const MotionAvatar = motion.create(Avatar)

const MemberCard = ({ member, index }: { member: Member; index: number }) => {
  const MotionLink = motion.create('a')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex h-full justify-center"
    >
      <Card className="flex w-full max-w-sm flex-col rounded-3xl bg-white p-6 transition-all duration-300 hover:shadow-lg">
        {/* Profile Section */}
        <div className="space-y-4 text-center">
          <div className="relative mx-auto h-32 w-32">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="rounded-full object-cover"
              sizes="(max-width: 128px) 100vw, 128px"
              priority={index < 3}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{member.title}</p>
            <h3 className="text-2xl text-gray-800">{member.name}</h3>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-4 flex flex-1 flex-col">
          <ul className="space-y-2 text-left text-gray-600">
            {' '}
            {/* Added text-left */}
            {member.achievements.map((achievement: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 flex-shrink-0 text-gray-400">•</span>
                <span className="text-base">{achievement}</span>
              </li>
            ))}
          </ul>

          {/* Social Icons Section with divider */}
          {Object.entries(member.socialLinks).some(
            ([_, url]) => url && url !== '#'
          ) && (
            <div className="mt-auto">
              <div className="my-6 h-px w-full bg-gray-200" />{' '}
              {/* Added divider */}
              <div className="flex justify-center space-x-4">
                {Object.entries(member.socialLinks).map(([platform, url]) => {
                  if (!url || url === '#') return null

                  const Icon =
                    platform.toLowerCase() === 'linkedin'
                      ? Linkedin
                      : platform.toLowerCase() === 'twitter'
                        ? Twitter
                        : null

                  if (!Icon) return null

                  return (
                    <MotionLink
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 transition-colors hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={20} />
                    </MotionLink>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default MemberCard
