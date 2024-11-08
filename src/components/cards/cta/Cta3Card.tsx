'use client';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { use, useState } from 'react';
import { useAddToWaitlist } from "@/hooks/add-to-waitlist";
interface DefaultProps {
  className?: string;
}

const CtaCard3 = (props: DefaultProps) => {
  const [email, setEmail] = useState('');
  const { addToWaitlist, isLoading, error } = useAddToWaitlist();
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    await addToWaitlist({
      name: '',
      email,
      userType: 'Investor',
      interest: '',
      vipAccess: false,
      referOthers: false,
      updatePreference: '',
      blockchainFamiliarity: ''
    });
    console.log('Submitted email:', email);
    setEmail('');
  };

  return (
    <Card className={`${props.className} w-full flex flex-col h-72 rounded-none bg-bg justify-center align-center border-none shadow-none px-12`} style={{ borderTop: 'solid 1px gray', borderBottom: 'solid 1px gray'}}>
      <CardContent className='w-full flex flex-col md:flex-row items-center justify-between px-12'>
          <div className="flex flex-col w-full md:w-2/5 text-wrap">
            <h2 className="text-5xl lg:text-6xl font-cormorant mb-4 flex flex-row md:flex-col gap-2 self-center md:self-start md:gap-0">
              <span className="italic" style={{ fontWeight: '100' }}>Stay</span>updated
            </h2>
            <p className="text-base text-gray-600">
              {"Stay aware of everything happening in Artisan's world and all the newest features"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-2/5">
            <div className="flex flex-col gap-2 md:gap-0 md:flex-row">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow md:rounded-l-full md:border-r-0 bg-gray-100 focus:ring-0 focus:border-gray-300"
              />
              <Button type="submit" className="md:rounded-r-full bg-black text-white hover:bg-gray-800 px-8" disabled={email.length < 1}>
                Submit
              </Button>
            </div>
          </form>
      </CardContent>
    </Card>
  )
}

export default CtaCard3;