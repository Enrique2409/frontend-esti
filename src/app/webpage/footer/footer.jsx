'use client';

import Link from 'next/link';
import { useRef } from 'react';
import "../../Styles/footer.css";

export default function Footer() {
  const navRef = useRef(null);

  /* — helpers — */
  const openInNewTab = (url) => window.open(url, '_blank');

  return (
    <section className="footer">
      <footer className="footer">
        <div className="container-xl">
          <div className="row">
            {/* -------- contacto -------- */}
            <div className="col-md-4">
              <h5>Contacto</h5>
              <ul className="list-unstyled">
                <li>Email: centroturisticoderelajacion@gmail.com</li>
                <li>Teléfono: +52 272 708 1767</li>
              </ul>

              <h5>Síguenos</h5>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <button
                    aria-label="Facebook"
                    className="btn btn-link text-primary"
                    onClick={() =>
                      openInNewTab(
                        'https://www.facebook.com/profile.php?id=61553790185439'
                      )
                    }
                  >
                    <i className="bi bi-facebook fs-3" />
                  </button>
                </li>
                <li className="list-inline-item">
                  <button
                    aria-label="Instagram"
                    className="btn btn-link text-danger"
                    onClick={() =>
                      openInNewTab(
                        'https://www.instagram.com/oztotipac23?igsh=MTliZDk3Z3dzNXoxMw=='
                      )
                    }
                  >
                    <i className="bi bi-instagram fs-3" />
                  </button>
                </li>
              </ul>
            </div>

            {/* -------- enlaces info -------- */}
            <div className="col-md-4">
              <h5>Información</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/nosotros" className="text-decoration-none">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="text-decoration-none">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/politicas" className="text-decoration-none">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/sucursal" className="text-decoration-none">
                    Sucursal Nogales
                  </Link>
                </li>
              </ul>
            </div>

            {/* -------- pagos -------- */}
            <div className="col-md-4 text-center">
              <h5>Pagos Seguros</h5>
              <img
                src="https://mshopsoficiales.kubocloud.com/mx/chabeloshops/bancos.svg"
                alt="Pagos BBVA"
                width={200}
              />
            </div>
          </div>

          {/* -------- copyright -------- */}
          <div className="text-center mt-4">
            <p className="mb-0">
              &copy; 2025 Escuela Secundaria Técnica Industrial N.º 70. Todos
              los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
