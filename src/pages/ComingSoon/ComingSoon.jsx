import "./ComingSoon.scss";
import Navbar from "../../components/Navbar/Navbar";

const ComingSoon = () => {
    return (
        <div className="coming-soon">
            <div className="coming-soon__header">
                <Navbar />
                <div className="coming-soon__hero">
                    <h1 className="heading-primary">Coming Soon...</h1>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
