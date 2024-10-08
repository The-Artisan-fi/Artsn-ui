import { useState } from "react";
import { useToast } from "./use-toast";
export const useHandleShare = () => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        console.log('copied ->', text);
        setTimeout(() => {
        setCopied(false);
        }, 2000);
    };
    
    return { copied, handleCopy };
};