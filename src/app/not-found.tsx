// import "@/styles/404.scss";
import Image from 'next/image'
import dynamic from 'next/dynamic';

export default function Custom404() {
    return (
        <div className="not-found">
            <div className="not-found__header">
                <div className="not-found__hero">
                    <h1 className="heading-primary">
                        <span className="heading-primary--main">404</span>
                        <span className="heading-primary--sub">Page not found</span>
                    </h1>
                </div>
            </div>
        </div>
    );
};