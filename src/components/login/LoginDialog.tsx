// 'use client';

// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/providers/Web3AuthProvider';
// import { Mail } from 'lucide-react';

// export function LoginButton() {
//   const { login, isAuthenticated, loading, user, injectedAdapters, loginUserWithAdapter} = useAuth();
//   console.log('injectedAdapters:', injectedAdapters
//     .map((adapter) => adapter.name)
//     .join(', ')
// );
//   if (user) {
//     return (
//       <Button disabled className="flex items-center gap-2">
//         <Mail className="w-4 h-4" />
//         Connected as {user.email}
//       </Button>
//     );
//   }

//   return (
//     //
//     <>
//        <Button
//           onClick={login}
//           disabled={loading}
//           className="flex items-center gap-2"
//         >
//           <Mail className="w-4 h-4" />
//           {loading ? 'Connecting...' : 'Login with Email'}
//         </Button>

//         {injectedAdapters.map((adapter) => (
//           <Button
//             key={adapter.name}
//             onClick={() => loginUserWithAdapter(adapter.name)}
//             disabled={loading}
//             className="flex items-center gap-2"
//           >
//             <Mail className="w-4 h-4" />
//             {loading ? 'Connecting...' : `Login with ${adapter.name}`}
//           </Button>
//         ))}   
//     </>
//   );
// }
'use client';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/Web3AuthProvider';
import { Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { useRouter } from 'next/navigation';

// Login Icons
import phantom from '/public/login/phantom_icon.svg';
import solflare from '/public/login/solflare_icon.svg';
import backpack from '/public/login/backpack_icon.svg';
import ledger from '/public/login/ledger_icon.svg';
import torus from '/public/login/torus_icon.svg';

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { 
    login, 
    isAuthenticated, 
    loading, 
    user, 
    injectedAdapters,
    loginUserWithAdapter
  } = useAuth();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  if (user) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        Connected as {user.email}
      </Button>
    );
  }

  return (
    <Suspense fallback={<div className='animate-pulse'>Loading...</div>}>
      <>
        <Button 
          variant='secondary' 
          className='rounded-xl z-[1]' 
          onClick={handleOpen}
        >
          Login
        </Button>

        {isOpen && (
          <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10" 
              onClick={handleClose} 
            />
            <div className="bg-transparent rounded-lg p-6 w-full max-w-4xl relative z-20">
              <Button 
                onClick={handleClose} 
                className="absolute -top-10 right-2 z-10"
              >
                Close
              </Button>

              <div className='flex flex-col md:flex-row gap-6'>
                <Card className='bg-transparent flex flex-col text-secondary border-none w-full md:w-1/2 z-[301]'>
                  <CardHeader className='bg-bg rounded-t-xl'>
                    <CardTitle className='font-bold'>
                      Welcome to the Artisan
                    </CardTitle>
                    <CardDescription>
                      Connect your buyer profile to access the marketplace and begin collecting
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='bg-bg flex flex-col gap-2'>
                    <Button 
                      className='w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary'
                      onClick={login}
                      disabled={loading}
                    >
                      {loading ? 'Connecting...' : 'Sign in with Google'}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant={'default'} 
                          className='w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary'
                          disabled={loading}
                        >
                          Connect Wallet
                          {['phantom', 'solflare', 'backpack', 'ledger'].map(icon => (
                            <img 
                              key={icon} 
                              src={`/login/${icon}_icon.svg`}
                              alt={icon} 
                              className='ml-2' 
                              style={{ width: '20px', height: '20px'}} 
                            />
                          ))}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                          {injectedAdapters.map((adapter) => (
                            <DropdownMenuItem 
                              key={adapter.name} 
                              onClick={() => loginUserWithAdapter(adapter.name)}
                            >
                              <img 
                                src={`/login/${adapter.name.toLowerCase()}_icon.svg`} 
                                alt={adapter.name} 
                                className='ml-2' 
                                style={{ width: '20px', height: '20px'}} 
                              />
                              {adapter.name.charAt(0).toUpperCase() + adapter.name.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className='flex items-center'>
                      <div className='flex-grow h-px bg-gray-300'></div>
                      <span className='px-4 text-gray-500'>OR</span>
                      <div className='flex-grow h-px bg-gray-300'></div>
                    </div>

                    <Button 
                      onClick={() => router.push('/register')} 
                      variant={'secondary'} 
                      className='w-full rounded-full hover:bg-primary hover:text-secondary hover:border-solid hover:border-2 hover:border-secondary hover:animate-pulse'
                    >
                      Create account
                    </Button>
                  </CardContent>

                  <CardFooter className='bg-bg flex flex-col gap-2 rounded-b-xl'>
                    By continuing to use the Artisan you accept terms and condition
                  </CardFooter>
                </Card>

                <Card className='hidden md:flex bg-bg flex flex-col relative w-1/2 text-secondary overflow-hidden'>
                  <div className='h-full w-full rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-right-middle bg-no-repeat transform translate-x-[6rem] scale-[140]translate-y-10 ' />
                  <CardHeader className='absolute bottom-0 left-0 w-1/2'>
                    <CardTitle className='text-xl font-bold'>
                      Buy a fraction of your favorite asset
                    </CardTitle>
                    <CardDescription className='text-md'>
                      Democratizing Luxury one fraction at a time
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        )}
      </>
    </Suspense>
  );
}