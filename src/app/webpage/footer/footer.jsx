'use client';

import Link from 'next/link';
import { useRef } from 'react';
import "../../Styles/footer.css";
import Image from "next/image";

export default function Footer() {
  const navRef = useRef(null);

  const openInNewTab = (url) => window.open(url, '_blank');

  return (
    <section className="footer">
      <footer className="footer">
        <div className="container-xl">
          <div className="row text-start">

            <div className="col-md-3">
              <a className="navbar-brand" href="/webpage/home">
                <Image src="/logo.png" alt="Logo" width={105} height={85} />
              </a>
            </div>

            <div className="col-md-3">
              <h5>Información</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/nosotros" className="text-decoration-none">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="text-decoration-none">
                    Ubicación
                  </Link>
                </li>
                <li>
                  <Link href="/sucursal" className="text-decoration-none">
                    Noticias
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5>Correo electrónico</h5>
              <ul className="list-unstyled">
                <li>Email: ejemplo@gmail.com</li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5>Teléfono</h5>
              <ul className="list-unstyled">
                <li>Ejemplo tel.</li>
              </ul>
            </div>

          </div>

          <div className="text-center mt-4">
            <p className="mb-0">
              &copy; 2025 Escuela Secundaria Técnica Industrial N.º 70. <br /> Todos
              los derechos reservados.
            </p>
          </div>

        </div>
      </footer>
    </section>
  );
}
