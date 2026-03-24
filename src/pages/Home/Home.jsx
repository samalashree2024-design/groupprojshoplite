import React from 'react';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="home__container">
                <HeroBanner />

                <div className="home__row">
                    <ProductCard {...productsData[0]} />
                    <ProductCard {...productsData[1]} />
                    <ProductCard {...productsData[4]} />
                </div>

                <div className="home__row">
                    <ProductCard {...productsData[5]} />
                    <ProductCard {...productsData[6]} />
                    <ProductCard {...productsData[7]} />
                    <ProductCard {...productsData[3]} />
                </div>

                <div className="home__row">
                    <ProductCard {...productsData[8]} />
                    <ProductCard {...productsData[9]} />
                    <ProductCard {...productsData[10]} />
                </div>

                <div className="home__row">
                    <ProductCard {...productsData[2]} />
                </div>
            </div>
        </div>
    );
}

export default Home;
