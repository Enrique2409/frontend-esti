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
  const isActiveSub = (path) => pathname.startsWith(path) ? 'active' : '';

  return (
    <header>
      <a className="navbar-brand" href="/webpage/home">
        <Image src="/logo.png" alt="Logo" width={105} height={85} />
      </a>

      <nav ref={navRef}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/webpage/home"); }} className={isActive("/webpage/home") ? "active" : ""}>
          <i className={`fas fa-home ${isActive("/webpage/home") ? "icon-active" : ""}`}></i> Inicio
        </a>

         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className={isActive("/") ? "active" : ""}>
          <i className={`fas fa-home ${isActive("/") ? "icon-active" : ""}`}></i> Nosotros
        </a>

        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className={isActive("/") ? "active" : ""}>
          <i className={`fas fa-home ${isActive("/") ? "icon-active" : ""}`}></i> Calendario
        </a>

        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className={isActive("/") ? "active" : ""}>
          <i className={`fas fa-home ${isActive("/") ? "icon-active" : ""}`}></i> Inscripción
        </a>

        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className={isActive("/") ? "active" : ""}>
          <i className={`fas fa-home ${isActive("/") ? "icon-active" : ""}`}></i> Noticias
        </a>

        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/webpage/location"); }} className={isActive("/webpage/location") ? "active" : ""}>
          <i className={`fa-solid fa-phone ${isActive("/webpage/location") ? "icon-active" : ""}`}></i> Ubicación
        </a>

         <a href="#" onClick={(e) => { e.preventDefault(); navigate("/webpage/contact"); }} className={isActive("/webpage/location") ? "active" : ""}>
          <i className={`fa-solid fa-phone ${isActive("/webpage/contact") ? "icon-active" : ""}`}></i> Contacto
        </a>



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
