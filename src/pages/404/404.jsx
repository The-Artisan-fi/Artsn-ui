import "./404.scss";
import Navbar from "../../components/Navbar/Navbar";

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found__header">
                <Navbar />
                <div className="not-found__hero">
                    <h1 className="heading-primary"> Page Not Found : 404</h1>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
