"use client";

import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../../Styles/pagehome.css";


export default function Home() {
  const [slides, setSlides] = useState([]);
  const [cards, setCards] = useState([]);
  const [news, setNews] = useState([]);
  const router = useRouter();

useEffect(() => {
  // Fetch para carrusel
      fetch('http://localhost:8080/esti/content/category/Carrusel')
    .then(response => response.json())
    .then(data => {
      const formatUrl = (path) => `http://localhost:8080${path}`;
      const slidesData = data.map(slide => ({
        ...slide,
        imageURL: formatUrl(slide.imageURL),
      }));

      setSlides(slidesData);
    })
    .catch(error => console.error('Error al cargar las tarjetas:', error));

  // Si quieres cargar las cards (tarjetas), harías otro fetch similar:
  fetch('http://localhost:8080/esti/content/category/Card')
    .then(response => response.json())
    .then(data => {
      const formatUrl = (path) => `http://localhost:8080${path}`;
      const cardsData = data.map(card => ({
        ...card,
        imageURL: formatUrl(card.imageURL),
      }));

      setCards(cardsData);
    })
    .catch(error => console.error('Error al cargar las tarjetas:', error));

      fetch('http://localhost:8080/esti/content/category/News')
    .then(response => response.json())
    .then(data => {
      const formatUrl = (path) => `http://localhost:8080${path}`;
      const newsData = data.map(card => ({
        ...card,
        imageURL: formatUrl(news.imageURL),
      }));

      setNews(newsData);
    })
    .catch(error => console.error('Error al cargar las tarjetas:', error));
}, []);

  return (
    <section>
        <Navbar />
      {/* ---------- Carrusel ---------- */}
       <div className="customCarousel">
        <Carousel interval={5000} fade controls>
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div className="carouselContent">
                <img
                  className="carouselImage"
                  src={slide.imageURL}
                  alt={`Slide ${slide.id}`}
                />
                <div className="carouselCard">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  {slide.link && (
                    <button
                      onClick={() =>
                        slide.link.startsWith("http")
                          ? window.open(slide.link, "_blank")
                          : router.push(slide.link)
                      }
                    >
                      Más información
                    </button>
                  )}
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* ---------- Tarjetas ---------- */}
      <div className="container-xl mt-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {cards.map((card) => (
            <div key={card.id} className="col">
              <div className="card h-100 shadow-sm">
                <img
                  src={card.imageURL}
                  className="card-img-top"
                  alt={card.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text">{card.description}</p>
                </div>
                <div className="card-footer text-end">
                  <small className="text-muted">~ ESTI 70</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
}
