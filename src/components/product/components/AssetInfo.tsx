"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
// import { useSolanaRPC } from "@/hooks/use-web3-rpc";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import RPC from "@/components/blockchain/solana-rpc";
import { useHandleShare } from "@/hooks/use-handle-share";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { set } from "@metaplex-foundation/umi/serializers";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { buyStripeTx, buyTx } from "@/components/Protocol/functions";
import { loadStripe } from "@stripe/stripe-js";
import { v4 as uuid } from "uuid";
import { useAuth } from "@/providers/Web3AuthProvider";
export default function AssetInfo({ asset }: { asset: any }) {
  console.log('asset to render->', asset);
  const { provider, login: web3Login, logout: web3Logout, getUserInfo, web3auth } = useWeb3Auth();
 
  const { toast } = useToast();
  const [amount, setAmount] = useState(1); // Initial amount set to 5
  const [isBuying, setIsBuying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { handleCopy, copied } = useHandleShare();
  const { user } = useAuth();
  const increment = () => {if(amount < 4)setAmount(amount + 1)};
  const decrement = () => {if(amount > 1) setAmount(amount - 1)};
  const router = useRouter();
  const rpc = new RPC(provider!);

  const getAccounts = async () => {
    const accounts = await rpc.getAccounts();
    return accounts;
  }

  const signTransaction = async (tx: Transaction) => {
    const signature = await rpc.signTransaction({ tx });
    return signature;
  }

  const buyTx = async(id: number, reference: string, key: string, amount: number, uri: string) => {
    try{
      toast({
        title: 'Preparing transaction...',
      })
      const response = await fetch('/api/protocol/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            reference: reference,
            publicKey: key,
            amount: amount,
            uri: uri,
        })
      })
      const { transaction } = await response.json(); //VersionedTransaction
      const tx = VersionedTransaction.deserialize(Buffer.from(transaction, "base64"));
      if(!tx){
        console.log('no transaction');
        return;
      }
      return tx;
    } catch (error) {
      console.error('Error sending transaction', error);
    }
  }

  const handleBuy = async() => {
    setIsBuying(true);
    if (web3auth && web3auth.connected && web3auth.provider) {
      const rpc = new RPC(web3auth.provider);
      const accounts =  await getAccounts();
      console.log('userAccounts ->',accounts);
      if (!accounts) {
        console.error('No accounts found');
        return;
      }
      const tx = await buyTx(Number(asset.onChainData.id), asset.offChainData.reference, accounts![0], amount, asset.onChainData.watchUri);
      console.log('tx ->', tx); // VersionedTransaction
      if (tx) {
        setIsProcessing(true);
        const signature = await rpc!.signVersionedTransaction({ tx });
        console.log('signature ->', signature);
        toast({
          title: 'Transaction sent',
          description: 'Transaction has been sent to the blockchain',
        })
        setIsBuying(false);
        setIsProcessing(false);
        setIsComplete(true);
      } else {
        console.error('Transaction is undefined');
      }
    }
  }
  const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  async function buyStripe() {
    try {
        const idempotencyKey = uuid();
        // encode the asset.onChainData.watchUri into something we can pass to the backend
        const encodedUri = encodeURIComponent(asset.onChainData.watchUri);
        console.log('encodedUri ->', encodedUri);
        const stripe = await asyncStripe;
        const res = await fetch("/api/stripe", {
            method: "POST",
            body: JSON.stringify({
                amount,
                id: asset.offChainData.associatedId,
                objectReference: asset.offChainData.reference,
                object: asset.offChainData.mintAddress,
                uri: encodedUri,
            }),
            headers: { 
                "Content-Type": "application/json",
                'Idempotency-Key': idempotencyKey,
            },
        });
        const { sessionId } = await res.json();
        sessionStorage.setItem('sessionId', sessionId);
        await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
        console.log("Transaction failed");
    }
  }

  async function buyStripeTx(id: number, reference: string, key: string, amount: number) {
    try {
      const response = await fetch('/api/protocol/buy-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: asset.offChainData.associatedId,
          reference: reference,
          publicKey: key,
          amount: amount,
          sessionId: sessionStorage.getItem('sessionId')
        })
      })
      const txData = await response.json();
      const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
  
      if (!tx) {
        console.log('no transaction');
        return;
      }
  
      return tx;
    } catch (error) {
      console.error('Error sending transaction', error);
    }
  };

  async function buyStripeListing(amount: string) {
    try {
        if (!user) {
            console.error('User not found');
            return;
        }
        const tx = await buyStripeTx(asset.onChainData.id, asset.offChainData.reference, user!.publicKey, +amount);
        const signature = await signTransaction(tx!);
        console.log('signature ->', signature);
        toast({
            title: 'Transaction sent',
            description: 'Transaction has been sent to the blockchain',
        });
        
    } catch (error) {
        console.error('Error sending transaction', error);
    } finally {
        sessionStorage.removeItem('sessionId') 
    }
  }

  useEffect(() => {
    const amount = new URLSearchParams(window.location.search).get('amount');
    if (
        (user && user.publicKey) 
        && amount
        && sessionStorage.getItem('sessionId')
    ) {
        buyStripeListing(amount);
    }
  }, [user]);

  return (
    <section className="bg-white rounded-3xl border-gray p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <button className="text-xs md:text-base border-gray text-black p-2.5 rounded-2xl shadow-sm">
            <span>{asset.onChainData.objectType.watch ? 'Watch' : 'Diamonds'}</span>
          </button>
          {asset.onChainData.objectType.watch && (
            <button className="text-xs md:text-base border-gray text-black p-2.5 rounded-2xl shadow-sm">
              <span>{asset.attributes[4].value.toString()}</span>
            </button>
          )}
        </div>
        <button className="text-xs md:text-base bg-black text-white px-4 py-2.5 rounded-2xl shadow-sm" onClick={()=> handleCopy(window.location.href)}>
          <span className="flex items-center gap-2">
            {!copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            ) : (
              <span> √ </span>
            )}
            Share
          </span>
            
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{asset.attributes[0].value.toString()}</h1>
      </div>
      <p className="text-gray-600 mb-5">{asset.attributes[1].value.toString()}</p>
      <p className="text-lg mb-3">Remaining fractions</p>
      <p className="text-3xl font-bold mb-2">
        {/* {asset.share - asset.shareSold} / {asset.share} */}
        {Number(asset.onChainData.share) - Number(asset.onChainData.shareSold)} / {asset.onChainData.share}
      </p>
      <p className="text-sm mb-2">{Number(asset.onChainData.price)}$ / fractions</p>
        <Progress value={Number(asset.onChainData.share) - Number(asset.onChainData.shareSold)} max={Number(asset.onChainData.share)} className="my-4 bg-secondary text-primary" />
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center mb-5 gap-4">
      <div className="w-full max-w-48 flex justify-between items-center gap-4">
      <button
        style={{ height: "50px", width: "78px" }}
        className="bg-gray-300 flex justify-center items-center rounded-2xl"
        onClick={decrement} // Decrement the amount
      >
        -
      </button>
      <button
        style={{ height: "50px", width: "78px" }}
        className="bg-white flex justify-center items-center rounded-2xl font-bold border-gray box-border"
      >
        {amount} {/* Display the current amount */}
      </button>
      <button
        style={{ height: "50px", width: "78px" }}
        className="bg-gray-700 flex justify-center items-center rounded-2xl text-white"
        onClick={increment} // Increment the amount
      >
        +
      </button>
      </div>
        {/* <button className="w-full md:w-2/3 bg-black text-white py-3 rounded-2xl" onClick={()=> handleBuy()}>
          {`Buy $${amount * Number(asset.onChainData.price)} of this Fraction`}
        </button> */}
        <AlertDialog>
          <AlertDialogTrigger className="w-full md:w-2/3 bg-black text-white py-3 rounded-2xl">{`Buy $${amount * Number(asset.onChainData.price)} of this Fraction`}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex flex-row w-full justify-between gap-4 items-center">
                  {!isComplete ? (
                    <p className="text-lg font-semibold text-secondary">Confirm Purchase</p>
                  ) : (
                    <p className="text-lg font-semibold text-secondary">Thanks for buying</p>
                  )}
                  <AlertDialogCancel className="w-fit rounded-xl bg-primary text-secondary hover:bg-secondary hover:text-primary">X</AlertDialogCancel>
                </div>
                
              </AlertDialogTitle>
              {!isComplete ? (
              <AlertDialogDescription>
                This action will purchase you {amount} fractions of the asset. Are you sure you want to continue?
                <Separator className="my-2 bg-slate-300"/>  
                <div className="flex flex-row justify-between gap-4 items-center px-4">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src={asset.offChainData.images[0]}
                    alt={asset.attributes[0].value.toString()}
                    width={100}
                    height={100}
                    className="rounded-3xl mt-5 border-gray border border-solid"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-secondary">{asset.attributes[0].value.toString()} - {asset.attributes[1].value.toString()}</p>
                    <p className="text-sm text-secondary" >x{" "}{amount}{" "}Fractions</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">${Number(asset.onChainData.price)}</p> 
              </div>    
              </AlertDialogDescription>
              ) : (
                <AlertDialogDescription>
                  You just bought x {amount} Fractions of {asset.attributes[0].value.toString()} - {asset.attributes[1].value.toString()}. Welcome to the Artisan family!
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
                     
            <AlertDialogFooter>
              {isBuying && !isProcessing && <div className="flex flex-col justify-between gap-2 items-center px-4 w-full"><p>Preparing your txn...</p></div>}
              {isBuying && isProcessing && <div className="flex flex-col justify-between gap-2 items-center px-4 w-full"><p>Processing, one more sec...</p></div>}
              {/* {!isBuying && isComplete && <p>Transaction complete</p>} */}
              {!isBuying && !isComplete && (
                <div className="flex flex-col justify-between gap-2 items-center px-4 w-full">
                  <Separator className="bg-slate-300"/>    
                  <Button className="w-full rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary" onClick={()=> handleBuy()}>Pay with crypto</Button>
                  <Button className="w-full rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary" onClick={()=> buyStripe()}><CreditCard className="mr-2"/>Pay with card</Button>
                </div>
              )}
              {isComplete && (
                <div className="flex flex-col justify-between gap-2 items-center px-4 w-full">
                  <div className="flex flex-row gap-4 items-center w-full">
                    <AlertDialogCancel className="w-1/3 rounded-xl bg-primary text-secondary hover:bg-primary hover:text-secondary" onClick={()=> setIsComplete(false)}>Buy more</AlertDialogCancel>
                    <AlertDialogAction className="w-2/3 rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary" onClick={()=> router.push('/dashboard')}>Take me to my dashboard</AlertDialogAction>
                  </div>
                </div>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-sm text-gray-500 p-7 border-gray rounded-3xl">
        {asset.offChainData.about}{" "}
        <a href="#" className="text-blue-600">
          See more
        </a>
      </p>
    </section>
  );
}
