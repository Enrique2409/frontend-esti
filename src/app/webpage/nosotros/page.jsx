'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import '../../Styles/nostros.css'; // asegúrate de que exista esta hoja de estilo

const Massage = () => {
  const categoryName = "Masaje";
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getServicesByCategory = async (categoryName) => {
    try {
      const response = await axios.get(`http://localhost:8080/oztotipac/service/category/${categoryName}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching services by category:", error);
      throw new Error("Error al cargar los servicios.");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await getServicesByCategory(categoryName);
        setServices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleOpenReservationModal = (service) => {
    // Redirige a la página de reservación o abre un modal (esto depende de tu diseño)
    router.push(`/webpage/reservar?id=${service.idService}`);
  };

  if (isLoading) return <p>Cargando servicios...</p>; // Reemplaza con tu Loader si lo tienes
  if (error) return <p>{error}</p>;

  return (
    <section>
      <div className="container-md mt-5 service">
        {services.map((service, index) => (
          <div className="row mb-4" key={service.idService}>
            <div className={`col-md-6 ${index % 2 === 0 ? "" : "order-1 order-md-2"}`}>
              <img
                src={service.image}
                className="img-fluid rounded"
                alt={service.name}
              />
            </div>
            <div className={`col-md-6 ${index % 2 === 0 ? "" : "order-2 order-md-1"}`}>
              <h2 className="fw-bold">{service.serviceName}</h2>
              <h4 className="text-success">
                {service.discount ? (
                  <>
                    <span style={{ textDecoration: 'line-through', marginRight: '10px' }}>
                      ${service.price.toFixed(2)}
                    </span>
                    ${service.discountedPrice.toFixed(2)}
                    <span className="text-muted" style={{ marginLeft: '10px' }}>
                      ({service.discount}% de descuento)
                    </span>
                  </>
                ) : (
                  `$${service.price.toFixed(2)}`
                )}
              </h4>

              <p className="text-muted">{service.description}</p>
              <div className="button">
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenReservationModal(service)}
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Massage;
