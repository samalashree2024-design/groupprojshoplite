import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './HeroBanner.css';

const images = [
    "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg", // Kitchen text
    "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg", // Toys
    "https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg", // Gaming
    "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg"  // Beauty
];

function HeroBanner() {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000); // auto slide every 5s
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="heroBanner">
            <div className="heroBanner__slider" style={{ transform: `translateX(-${currentIdx * 100}%)` }}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        className="heroBanner__image"
                        src={image}
                        alt={`Banner ${index}`}
                    />
                ))}
            </div>

            <button className="heroBanner__btn heroBanner__btnLeft" onClick={prevSlide}>
                <MdChevronLeft />
            </button>
            <button className="heroBanner__btn heroBanner__btnRight" onClick={nextSlide}>
                <MdChevronRight />
            </button>

            {/* Fade into rest of page */}
            <div className="heroBanner__fadeBottom" />
        </div>
    );
}

export default HeroBanner;
