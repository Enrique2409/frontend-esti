"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "../../Styles/we.css";
import { getServicesByCategory } from "@/app/Service/PageService";

export default function News() {
  const categoryName = "News"; 
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServicesByCategory(categoryName);
        setServices(data);
      } catch {
        setError("Error al cargar");
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
          <div className="row mb-5" key={service.id}>
            
            <div className={`col-md-6 ${index % 2 !== 0 ? "order-1 order-md-2" : ""}`}>
              <img
                src={service.image || service.imageURL}
                className="img-fluid rounded"
                alt={service.title}
              />
            </div>

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
