import { Link, useLocation } from "react-router-dom";

interface NavLinksProps {
  onItemClick?: () => void;
}

const NavLinks = ({ onItemClick }: NavLinksProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Homepage" },
    { path: "/optimize", label: "Optimize" },
    { path: "/scan", label: "Scan" },
    { path: "/results", label: "Results" },
  ];

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onItemClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            isActive(item.path)
              ? "bg-sage text-rust dark:bg-taupe text-rust-light"
              : "text-muted-foreground hover:text-rust hover:bg-sage/50 dark:hover:text-rust-light dark:hover:bg-taupe/50"
          }`}
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
};

export default NavLinks;