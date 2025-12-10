"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "../../Styles/pages.css";
import { getActiveContentByCategory } from "@/app/Service/ContentService";

export default function Contact() {
  const categoryName = "Contact";
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await getActiveContentByCategory(categoryName, setServices);
      } catch {
        setError("Error al cargar los servicios.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section>
      <Navbar />

      <div className="container-md mt-5 service">

        {isLoading && <p>Cargando información...</p>}

        {error && <p className="text-danger">{error}</p>}

        {services.map((service, index) => (
          <div className={`service-row ${index % 2 !== 0 ? "reverse" : ""}`} key={service.id}>

            <div className="image-col">
              <img
                src={service.image || service.imageURL}
                className="service-image"
                alt={service.title}
              />
            </div>

            <div className="text-col">
              <h2 className="fw-bold">{service.title}</h2>
              <p className="text-muted">{service.description}</p>
            </div>

          </div>
        ))}



      </div>

      <Footer />
    </section>
  );
}
