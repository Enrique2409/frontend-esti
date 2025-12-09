'use client';

import { useRef } from "react";
import '../../Styles/navbarpages.css';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";

function Navbar() {
  const navRef = useRef();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Inicio", path: "/webpage/home", icon: "fa-house" },
    { label: "Nosotros", path: "/webpage/we", icon: "fa-school" },
    { label: "Inscripción", path: "/webpage/inscription", icon: "fa-file-pen" },
    { label: "Noticias", path: "/webpage/news", icon: "fa-newspaper" },
    { label: "Ubicación", path: "/webpage/location", icon: "fa-location-dot" },
    { label: "Contacto", path: "/webpage/contact", icon: "fa-phone" },
  ];

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const navigate = (path) => {
    router.push(path);
    showNavbar();
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="navbar-container">

      <a className="navbar-brand" onClick={() => navigate("/webpage/home")}>
        <Image src="/logo.png" alt="Logo" width={105} height={85} />
      </a>

      <nav ref={navRef} className="navbar-menu">

        {menuItems.map((item) => (
          <a
            key={item.path}
            onClick={() => navigate(item.path)}
            className={isActive(item.path) ? "active" : ""}
          >
            <i className={`fa-solid ${item.icon}`}></i> {item.label}
          </a>
        ))}

        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <i className="fas fa-times"></i>
        </button>
      </nav>

      <button className="nav-btn" onClick={showNavbar}>
        <i className="fas fa-bars"></i>
      </button>

    </header>
  );
}

export default Navbar;
