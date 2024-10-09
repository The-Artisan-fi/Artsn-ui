'use client'
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/register/signup-form-ui';
import { LoadingFeature } from '@/components/loading/loading-feature';

export default function RegisterPage() {
  const router = useRouter();
  const handleClose = () => { router.push('/dashboard'); };
  return (
    <Suspense fallback={<LoadingFeature />}>
      <SignupForm
        onClose={() => handleClose()}
      />
    </Suspense>
  )
}