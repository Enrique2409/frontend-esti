'use client';
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const Location = () => {
  return (
    <section>
      <Navbar />

      {/* Contenedor centrado real */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "80vh",   // ocupa casi toda la pantalla
          padding: "20px"
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.43960715675!2d-96.92168662577046!3d18.867569158484674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c4e5557cb321f9%3A0x1482ca7fb6e144c3!2sEscuela%20Secundar%C3%ADa%20T%C3%A9cnica%20Industrial%20No.%2070!5e0!3m2!1ses-419!2smx!4v1749434711900!5m2!1ses-419!2smx"
          width="600"
          height="450"
          style={{
            border: 0,
            maxWidth: "100%",   // evita desbordes en móvil
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <Footer />
    </section>
  );
};

export default Location;
