'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { use, useState } from 'react'
import { useAddToWaitlist } from '@/hooks/add-to-waitlist'
interface DefaultProps {
  className?: string
}

const CtaCard3 = (props: DefaultProps) => {
  const [email, setEmail] = useState('')
  const { addToWaitlist, isLoading, error } = useAddToWaitlist()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addToWaitlist({
      name: '',
      email,
      userType: 'Investor',
      interest: '',
      vipAccess: false,
      referOthers: false,
      updatePreference: '',
      blockchainFamiliarity: '',
    })
    console.log('Submitted email:', email)
    setEmail('')
  }

  return (
    <Card
      className={`${props.className} align-center flex h-72 w-full flex-col justify-center rounded-none border-none bg-bg px-12 shadow-none`}
      style={{ borderTop: 'solid 1px gray', borderBottom: 'solid 1px gray' }}
    >
      <CardContent className="flex w-full flex-col items-center justify-between self-center px-12 md:flex-row lg:w-11/12">
        <div className="flex w-full flex-col text-wrap md:w-2/5">
          <h2 className="mb-4 flex flex-row gap-2 self-center font-cormorant text-5xl md:flex-col md:gap-0 md:self-start lg:text-6xl">
            <span className="italic" style={{ fontWeight: '100' }}>
              Stay
            </span>
            updated
          </h2>
          <p className="text-base text-gray-600">
            {
              "Stay aware of everything happening in Artisan's world and all the newest features"
            }
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full flex-col md:w-2/5">
          <div className="flex flex-col gap-2 md:flex-row md:gap-0">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-gray-100 focus:border-gray-300 focus:ring-0 md:rounded-l-full md:border-r-0"
            />
            <Button
              type="submit"
              className="bg-black px-8 text-white hover:bg-gray-800 md:rounded-r-full"
              disabled={email.length < 1}
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CtaCard3
