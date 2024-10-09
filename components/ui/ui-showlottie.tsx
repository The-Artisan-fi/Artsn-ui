'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player));

type Props = {
  path: any;
  className?: string;
};

function ShowLottie({ path, className = '' }: Props) {
  return (
    <Suspense fallback={<div />}>
      <div className={`max-w-sm md:max-w-md ${className} py-60`}>
        <Player autoplay loop src={path ? path : '/'}></Player>
      </div>
    </Suspense>
  );
}

export default ShowLottie;
