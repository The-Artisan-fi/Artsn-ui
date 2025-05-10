// src/store/usePaymentStore.ts
/*import { create } from 'zustand'

interface PaymentParams {
  sessionId: string
  assetId: string
  amount: string
  ref: string
  objectRef: string
  uri: string
}

interface PaymentState {
  // Payment state
  paymentParams: PaymentParams | null
  processingState: {
    stage: 'initializing' | 'verifying' | 'processing' | 'complete' | 'error'
    message: string
    error?: string
  }
  isVerifying: boolean
  isProcessing: boolean
  hasProcessed: boolean

  // Balance state
  balance: {
    sol: number
    usdc: number
  }

  // Actions
  setPaymentParams: (params: PaymentParams | null) => void
  setProcessingState: (state: PaymentState['processingState']) => void
  setVerifying: (isVerifying: boolean) => void
  setProcessing: (isProcessing: boolean) => void
  setProcessed: (hasProcessed: boolean) => void
  setBalance: (balance: PaymentState['balance']) => void
  resetPayment: () => void
}

const initialProcessingState = {
  stage: 'initializing' as const,
  message: 'Initializing your purchase...',
}

export const usePaymentStore = create<PaymentState>()((set) => ({
  // Initial state
  paymentParams: null,
  processingState: initialProcessingState,
  isVerifying: true,
  isProcessing: false,
  hasProcessed: false,
  balance: {
    sol: 0,
    usdc: 0,
  },

  // Actions
  setPaymentParams: (params) => set({ paymentParams: params }),
  setProcessingState: (state) => set({ processingState: state }),
  setVerifying: (isVerifying) => set({ isVerifying }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setProcessed: (hasProcessed) => set({ hasProcessed }),
  setBalance: (balance) => set({ balance }),
  resetPayment: () =>
    set({
      paymentParams: null,
      processingState: initialProcessingState,
      isVerifying: true,
      isProcessing: false,
      hasProcessed: false,
    }),
}))
*/
