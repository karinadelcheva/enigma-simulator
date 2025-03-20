
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-enigma-bg p-4">
      <div className="glass rounded-xl p-8 max-w-md w-full text-center animate-fade-in shadow-neo">
        <div className="w-16 h-16 bg-enigma-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-enigma-accent" />
        </div>
        
        <h1 className="text-3xl font-medium mb-2 text-enigma-dark">404</h1>
        <p className="text-enigma-accent mb-6">
          This page could not be decrypted
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center text-enigma-highlight hover:text-enigma-highlight/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Enigma Machine
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
