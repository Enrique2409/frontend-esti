'use client';

import { useRef } from "react";
import '../../Styles/navbarpages.css';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";

function Navbar() {
  const navRef = useRef();
  const router = useRouter();
  const pathname = usePathname();

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

        <a onClick={() => navigate("/webpage/home")} className={isActive("/webpage/home") ? "active" : ""}>
          <i className="fa-solid fa-house"></i> Inicio
        </a>

        <a onClick={() => navigate("/webpage/we")} className={isActive("/webpage/we") ? "active" : ""}>
          <i className="fa-solid fa-school"></i> Nosotros
        </a>

        <a onClick={() => navigate("/webpage/inscription")} className={isActive("/webpage/inscription") ? "active" : ""}>
          <i className="fa-solid fa-file-pen"></i> Inscripción
        </a>

        <a onClick={() => navigate("/webpage/news")} className={isActive("/webpage/news") ? "active" : ""}>
          <i className="fa-solid fa-newspaper"></i> Noticias
        </a>

        <a onClick={() => navigate("/webpage/location")} className={isActive("/webpage/location") ? "active" : ""}>
          <i className="fa-solid fa-location-dot"></i> Ubicación
        </a>

        <a onClick={() => navigate("/webpage/contact")} className={isActive("/webpage/contact") ? "active" : ""}>
          <i className="fa-solid fa-phone"></i> Contacto
        </a>

        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <i className="fas fa-times"></i>
        </button>
      </nav>

      {/* Botón hamburguesa */}
      <button className="nav-btn" onClick={showNavbar}>
        <i className="fas fa-bars"></i>
      </button>

    </header>
  );
}

export default Navbar;
