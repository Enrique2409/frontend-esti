"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "../../Styles/we.css";
import { getServicesByCategory } from "@/app/Service/PageService";

export default function We() {
  const categoryName = "We"; 
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServicesByCategory(categoryName);
        setServices(data);
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

        {/* ---------- Loading ---------- */}
        {isLoading && <p>Cargando información...</p>}

        {/* ---------- Error ---------- */}
        {error && <p className="text-danger">{error}</p>}

        {/* ---------- Lista Contact ---------- */}
        {services.map((service, index) => (
          <div className="row mb-5" key={service.id}>
            
            {/* Imagen */}
            <div className={`col-md-6 ${index % 2 !== 0 ? "order-1 order-md-2" : ""}`}>
              <img
                src={service.image || service.imageURL}
                className="img-fluid rounded"
                alt={service.title}
              />
            </div>

            {/* Texto */}
            <div className={`col-md-6 ${index % 2 !== 0 ? "order-2 order-md-1" : ""}`}>
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
