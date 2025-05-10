import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'Why should I trust your platform?',
        answer:
          'We are a fully regulated and compliant platform specializing in luxury asset tokenization. Our team combines expertise in both fine art and luxury collectibles with blockchain technology. We maintain rigorous security standards and work with established partners for asset authentication, custody, and insurance.',
      },
      {
        question: 'What is fractional ownership of luxury assets?',
        answer:
          'Fractional ownership allows you to own a portion of high-value luxury items like fine art, rare watches, and collectibles through tokenization. Each token represents a share of the asset, enabling you to invest in premium pieces that might otherwise be out of reach while participating in potential appreciation.',
      },
      {
        question: 'How are luxury assets sourced and authenticated?',
        answer:
          'We partner with established galleries, auction houses, and certified dealers to source exceptional pieces. Each asset undergoes rigorous authentication by industry experts and is fully documented with provenance records. We only tokenize assets with clear ownership history and verified authenticity.',
      },
    ],
  },
  {
    category: 'Investment Process',
    questions: [
      {
        question: 'Is there a minimum investment requirement?',
        answer:
          'While our platform democratizes access to luxury assets, minimum investments vary by piece. We structure investments to balance accessibility with the exclusive nature of these assets, typically starting at accessible entry points for each category.',
      },
      {
        question: 'What happens if an asset offering is not fully subscribed?',
        answer:
          'If a luxury asset does not reach its funding target within the specified timeframe, all investments are returned to investors with no fees charged. We maintain high standards for our offerings and only proceed with fully subscribed assets.',
      },
      {
        question: 'How can I liquidate my investment?',
        answer:
          "Our platform features a secondary marketplace where you can trade your tokens after the initial holding period. The liquidity timeline varies by asset class and is clearly specified in each offering's documentation.",
      },
    ],
  },
  {
    category: 'Technical Details',
    questions: [
      {
        question: 'Why use blockchain for luxury asset fractionalization?',
        answer:
          'Blockchain technology ensures transparent ownership records, secure transfers, and automated distribution of any returns. It provides an immutable record of provenance and enables fractional ownership of previously indivisible luxury assets.',
      },
      {
        question: 'How do you ensure the security of physical assets?',
        answer:
          'All physical assets are stored in specialized, museum-grade secure facilities with comprehensive insurance coverage. We partner with leading art storage and security providers to ensure optimal preservation and protection.',
      },
      {
        question: 'What happens in case of loss or technical issues?',
        answer:
          'Your ownership is permanently recorded on the blockchain and backed by legal documentation. We implement robust security measures including multi-signature wallets and maintain comprehensive insurance coverage for both digital and physical assets.',
      },
    ],
  },
]

export default function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeQuestions, setActiveQuestions] = useState<string[]>([])

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const toggleQuestion = (question: string) => {
    setActiveQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    )
  }

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
  }

  return (
    <div className="z-[20] mx-auto mt-12 w-11/12 rounded-2xl bg-bg pb-16">
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about our real estate investment
            platform
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search questions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((category) => (
            <motion.div
              key={category.category}
              initial={false}
              animate={{
                backgroundColor:
                  activeCategory === category.category
                    ? 'var(--accent)'
                    : 'transparent',
              }}
              className="overflow-hidden rounded-lg"
            >
              <motion.button
                onClick={() => toggleCategory(category.category)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-accent/50"
              >
                <span className="text-lg font-semibold">
                  {category.category}
                </span>
                <motion.div
                  animate={{
                    rotate: activeCategory === category.category ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeCategory === category.category && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {category.questions.map((faq) => (
                      <div key={faq.question} className="border-t">
                        <motion.button
                          onClick={() => toggleQuestion(faq.question)}
                          className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-accent/50"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <motion.div
                            animate={{
                              rotate: activeQuestions.includes(faq.question)
                                ? 180
                                : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence>
                          {activeQuestions.includes(faq.question) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="px-6 py-4 text-muted-foreground">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
