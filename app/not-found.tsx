// import "@/styles/404.scss";
import Image from 'next/image'
import dynamic from 'next/dynamic';
const ShowLottie = dynamic(() => import('@/components/ui/ui-showlottie'), { ssr: false });

export default function Custom404() {
    return (
        <div className="not-found">
            <div className="not-found__header">
                <div className="not-found__hero">
                    <h1 className="heading-primary">
                        <ShowLottie path="/lotties/404.json" className="mx-auto" />
                    </h1>
                </div>
            </div>
        </div>
    );
};