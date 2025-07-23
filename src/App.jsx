import { Routes, Route } from "react-router-dom";
import Footer from "~containers/Footer";
import Navbar from "~containers/Navbar";
import Sidebar from "~containers/Sidebar";
import Home from "~pages/Home";
import NoPage from "~pages/NoPage";
import ProductDetails from "~pages/ProductDetails";
import Login from "~pages/Login";
import Register from "~pages/Register";
import Checkout from "~pages/Checkout";
import Admin from "~pages/Admin";

const App = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
      <Sidebar />
      <Footer />
    </div>
  );
};

export default App;
