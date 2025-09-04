import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b1eeb] to-[#0ea5e9] text-white">
      <div className="text-center bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-white/90 mb-4">Oops! Page not found</p>
        <a href="/" className="text-white bg-white/20 px-4 py-2 rounded-full hover:bg-white/30">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
