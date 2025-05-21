import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import axios from "axios";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(
          "https://computer-service-backend.onrender.com/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status >= 200 && res.status < 300) {
          setUser(res.data);
          console.log("User data fetched successfully", res);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  // Закрытие модалки при клике вне её
  useEffect(() => {
    if (!showProfileModal) return;
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileModal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowProfileModal(false);
    navigate("/auth/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 top-0 left-0 !max-sm:mb-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md  text-white bg-blue-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800">ServiceHY</span>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <HashLink
              smooth
              to="/#"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </HashLink>
            <HashLink
              smooth
              to="/#about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </HashLink>
            <HashLink
              smooth
              to="/contact-us/#header"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Contact Us
            </HashLink>
            {!localStorage.getItem("token") ? (
              <Link
                to="/auth/login"
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative">
                <button
                  className="w-10 h-10 overflow-hidden rounded-full focus:outline-none border-2 border-blue-100 hover:border-blue-400 transition"
                  onClick={() => setShowProfileModal((v) => !v)}
                  aria-label="Open profile menu"
                >
                  {!user ? (
                    // Иконка загрузки
                    <svg
                      className="animate-spin w-7 h-7 text-blue-400 mx-auto my-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <img
                      src={`https://computer-service-backend.onrender.com${user?.avatar}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
                {/* Модалка профиля */}
                {showProfileModal && (
                  <>
                    {/* Overlay */}
                    <div className="fixed inset-0 z-30 bg-black/20 md:hidden" />
                    <div
                      ref={modalRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-40 py-2 flex flex-col animate-fade-in"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        onClick={() => setShowProfileModal(false)}
                      >
                        <User className="w-5 h-5 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition w-full"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`text-gray-700 hover:text-blue-600 focus:outline-none transition-transform duration-300 ease-in-out ${
                menuOpen ? "rotate-90" : ""
              }`}
              aria-label="Открыть меню"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10  bg-opacity-30 transition-opacity duration-300 ease-in-out md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`md:hidden bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out fixed top-16 left-0 w-full z-20 ${
          menuOpen
            ? "max-h-96 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        style={{ willChange: "max-height, opacity" }}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition py-2"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <HashLink
            smooth
            to="/#about"
            className="text-gray-700 hover:text-blue-600 transition py-2"
            onClick={() => setMenuOpen(false)}
          >
            About
          </HashLink>
          <HashLink
            smooth
            to="/contact-us/"
            className="text-gray-700 hover:text-blue-600 transition py-2"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </HashLink>
          {!localStorage.getItem("token") ? (
            <Link
              to="/auth/login"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-blue-600 transition py-2"
                onClick={() => setMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setMenuOpen(false);
                  navigate("/auth/login");
                }}
                className="flex items-center text-gray-700 hover:text-blue-600 transition py-2"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
