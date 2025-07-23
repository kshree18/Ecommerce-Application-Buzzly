import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "~contexts/SidebarContext";
import { CartContext } from "~contexts/CartContext";
import { useAuth } from "~contexts/AuthContext";
import { BsBag } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Logo from "~assets/logo.svg";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { itemAmount } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
    });
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`${
        isActive ? "bg-white py-4 shadow-md" : "bg-none py-6"
      } fixed w-full z-10 transition-all`}
    >
      <nav className="container px-[3%] mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <Link to={"/"}>
            <img className="max-w-[40px]" src={Logo} alt="" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600">
                Welcome, {user?.firstName || user?.email}
              </span>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-primary hover:text-gray-600 transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-primary hover:text-gray-600 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary hover:text-gray-600 transition-colors duration-200"
            >
              <BsList className="text-2xl" />
            </button>
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex relative"
          >
            <BsBag className="text-2xl" />
            <div
              className="
            bg-red-500 absolute -right-2 -bottom-2 
            text-[12px] w-[18px] h-[18px] text-white
            rounded-full flex justify-center items-center
            "
            >
              {itemAmount}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container px-[3%] mx-auto space-y-4">
            {isAuthenticated ? (
              <>
                <div className="text-gray-600 text-center">
                  Welcome, {user?.firstName || user?.email}
                </div>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="block text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-center"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-primary hover:text-gray-600 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block text-primary hover:text-gray-600 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
