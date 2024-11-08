'use client'
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/register/RegisterForm';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

export default function RegisterPage() {
  const router = useRouter();
  const handleClose = () => { router.push('/dashboard'); };
  return (
    <Suspense fallback={<LoadingSpinner />}>
        <p>Register</p>
      <RegisterForm
        onClose={() => handleClose()}
      />
    </Suspense>
  )
}