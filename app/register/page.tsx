'use client'
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/register/signup-form-ui';

export default function RegisterPage() {
  const router = useRouter();
  const handleClose = () => { router.push('/dashboard'); };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm
        onClose={() => handleClose()}
      />
    </Suspense>
  )
}