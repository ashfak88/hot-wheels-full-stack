import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

const HeartIcon = ({ count, isActive }) => (
  <div className={`relative ${isActive ? "text-orange-700" : ""}`}>
    <svg
      className="w-6 h-6"
      fill={isActive ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

const UserIcon = ({ isActive }) => (
  <svg
    className={`w-6 h-6 ${isActive ? "text-orange-700" : ""}`}
    fill={isActive ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CartIcon = ({ count, isActive }) => (
  <div className={`relative ${isActive ? "text-orange-700" : ""}`}>
    <svg
      className="w-6 h-6"
      fill={isActive ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

const TruckIcon = ({ isActive }) => (
  <svg
    className={`w-6 h-6 transition-transform duration-300 hover:scale-110 ${isActive ? "text-orange-700 font-bold" : "hover:text-orange-700"
      }`}
    fill={isActive ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h13v13H3V3zm13 5h5l1 4v4h-6V8zm-8 10a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ProtectedLink = ({
  to,
  children,
  user,
  className = "",
  iconName = "",
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.info(`Please login to access ${iconName}`);
      navigate("/login");
    }
  };

  return (
    <Link to={user ? to : "#"} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

const ProtectedButton = ({
  children,
  user,
  onClick,
  className = "",
  iconName = "",
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.info(`Please login to access ${iconName}`);
      navigate("/login");
      if (onClick) onClick();
    } else {
      if (onClick) onClick();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, clearCart } = useCart();
  const { wishlist, clearWishlist } = useWishlist(); // ✅ use full wishlist
  const wishlistCount = wishlist.length; // ✅ compute dynamic count

  const activeMenu = location.pathname;

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    clearCart(true); // ✅ prevent backend call
    if (clearWishlist) clearWishlist();
    localStorage.removeItem("loggedInUser");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 font-sans ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link
            to="/"
            className="text-2xl font-extrabold text-orange-700 hover:text-orange-900 transition duration-300"
          >
            Hot Wheels
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`transition duration-300 ${activeMenu === "/" ? "text-orange-700 font-semibold" : "hover:text-orange-700"
                }`}
            >
              Home
            </Link>

            <Link
              to="/Products"
              className={`transition duration-300 ${activeMenu === "/Products" ? "text-orange-700 font-semibold" : "hover:text-orange-700"
                }`}
            >
              Products
            </Link>

            <Link
              to="/About"
              className={`transition duration-300 ${activeMenu === "/About" ? "text-orange-700 font-semibold" : "hover:text-orange-700"
                }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`transition duration-300 ${activeMenu === "/contact" ? "text-orange-700 font-semibold" : "hover:text-orange-700"
                }`}
            >
              Contact
            </Link>
          </div>

          {/* ================= ICONS ================= */}
          <div className="hidden md:flex items-center space-x-5 ml-20">
            <ProtectedLink to="/wishlist" user={user} className="hover:text-orange-700" iconName="Wishlist">
              <HeartIcon count={wishlistCount} isActive={activeMenu === "/wishlist"} />
            </ProtectedLink>

            {!user && (
              <Link to="/Account" className="hover:text-orange-700">
                <UserIcon isActive={activeMenu === "/Account"} />
              </Link>
            )}

            <ProtectedLink to="/cart" user={user} className="hover:text-orange-700" iconName="Cart">
              <CartIcon count={cartCount} isActive={activeMenu === "/cart"} />
            </ProtectedLink>

            <ProtectedLink to="/my-orders" user={user} className="hover:text-orange-700" iconName="Orders">
              <TruckIcon isActive={activeMenu === "/my-orders"} />
            </ProtectedLink>

            {user ? (
              <div className="flex items-center space-x-8">
                <span className="text-gray-700 text-sm">
                  Hi, <span className="font-semibold">{user.name}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="mr-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-3 py-1 bg-green-700 text-white text-sm rounded hover:bg-green-900 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* ================= MOBILE MENU TOGGLE ================= */}
          <div className="md:hidden flex items-center space-x-3 ml-auto">
            <ProtectedLink to="/cart" user={user} iconName="Cart">
              <CartIcon count={cartCount} isActive={activeMenu === "/cart"} />
            </ProtectedLink>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 rounded-full transition duration-300"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
            >
              Home
            </Link>

            <Link
              to="/Products"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
            >
              Products
            </Link>

            <Link
              to="/About"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
            >
              Contact
            </Link>

            <ProtectedLink
              to="/wishlist"
              user={user}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
              iconName="Wishlist"
            >
              Wishlist ({wishlistCount})
            </ProtectedLink>

            {!user && (
              <Link
                to="/Account"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
              >
                Account
              </Link>
            )}

            <ProtectedLink
              to="/my-orders"
              user={user}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-md transition duration-300"
              iconName="Orders"
            >
              Orders
            </ProtectedLink>

            {user ? (
              <>
                <p className="px-3 text-gray-700 py-2">
                  Hi, <span className="font-semibold">{user.name}</span>
                </p>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                    window.location.reload();
                  }}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded-md transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-600 hover:text-white rounded-md transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
