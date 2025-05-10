'use client'

import * as React from 'react'
import { ReactNode, Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { NavbarWrapper } from '../navbar/NavbarWrapper'

// import { AccountChecker } from '../account/account-ui';
// import {
//   ClusterChecker,
//   ClusterUiSelect,
//   ExplorerLink,
// } from '../cluster/cluster-ui';
// import toast, { Toaster } from 'react-hot-toast';

// Create a separate component that uses useSearchParams
function UiLayoutContent({
  children,
  links,
}: {
  children: ReactNode
  links: { label: string; path: string }[]
}) {
  const searchParams = useSearchParams() || undefined
  const pathname = usePathname()

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    NProgress.start()
    const timer = setTimeout(() => {
      NProgress.done()
    }, 200)

    return () => {
      clearTimeout(timer)
      NProgress.remove()
    }
  }, [pathname, searchParams])

  return (
    <div className="overflow-none flex h-full w-full flex-col items-center bg-bg">
      <NavbarWrapper links={links} />
      <div className="mx-4 w-full flex-grow lg:mx-auto">       
          {children}
        {/* <Toaster position="bottom-right" /> */}
      </div>
      <Footer />
    </div>
  )
}

// Main UiLayout component that wraps the content in Suspense
export function UiLayout({
  children,
  links,
}: {
  children: ReactNode
  links: { label: string; path: string }[]
}) {
  return (
    <Suspense
      fallback={
        <div className="my-32 text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <UiLayoutContent links={links}>{children}</UiLayoutContent>
    </Suspense>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="text-lg font-bold">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    )
  }
  return str
}

// export function useTransactionToast() {
//   return (signature: string) => {
//     toast.success(
//       <div className={'text-center'}>
//         <div className="text-lg">Transaction sent</div>
//         <ExplorerLink
//           path={`tx/${signature}`}
//           label={'View Transaction'}
//           className="btn btn-xs btn-primary"
//         />
//       </div>
//     );
//   };
// }
