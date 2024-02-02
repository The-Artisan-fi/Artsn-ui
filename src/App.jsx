import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Footer from "./components/Footer/Footer";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import NotFound from "./pages/404/404";
import About from "./pages/About/About";

import { useEffect } from 'react';

const RedirectToBoutique = () => {
  useEffect(() => {
    window.location.href = 'https://theboutique-vr.com/';
  }, []);

  return null; // Render nothing or a loading indicator
};

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />

                <Route path="/fi" element={<ComingSoon />} />
                <Route path="/market" element={<ComingSoon />} />
                <Route path="/boutique" element={<RedirectToBoutique />} />
                <Route path="/faq" element={<ComingSoon />} />
                <Route path="/tos" element={<ComingSoon />} />
                <Route path="/privacy" element={<ComingSoon />} />
                <Route path="/help" element={<ComingSoon />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;
