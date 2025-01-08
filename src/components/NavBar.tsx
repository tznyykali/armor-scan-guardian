import { Shield, Activity, Search, BarChart2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: Shield, label: "Dashboard" },
    { path: "/optimize", icon: Activity, label: "Optimize" },
    { path: "/scan", icon: Search, label: "Scan" },
    { path: "/results", icon: BarChart2, label: "Results" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-DEFAULT/80 backdrop-blur-md border-b border-cyber-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-safe-DEFAULT" />
              <span className="text-xl font-bold text-safe-DEFAULT">SecureGuard</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-cyber-accent/20 text-safe-DEFAULT"
                      : "text-foreground/60 hover:text-safe-DEFAULT hover:bg-cyber-accent/10"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;