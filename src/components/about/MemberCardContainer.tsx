'use client'

import React from 'react'
import MemberCard from './MemberCard'

const MemberCardContainer = ({ members }: any) => {
  return (
    <div className="relative">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-purple-50 via-white to-blue-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] delay-75" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member: any, index: number) => (
            <MemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MemberCardContainer
