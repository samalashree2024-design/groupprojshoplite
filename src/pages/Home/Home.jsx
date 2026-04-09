import React, { useMemo } from 'react';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';
import './Home.css';

function Home() {
    const rows = useMemo(() => {
        const items = Array.isArray(productsData) ? productsData : [];
        const rowSize = 4;
        const chunked = [];
        for (let i = 0; i < items.length; i += rowSize) {
            chunked.push(items.slice(i, i + rowSize));
        }
        return chunked;
    }, []);

    return (
        <div className="home">
            <div className="home__container">
                <HeroBanner />

                {rows.map((row, rowIdx) => (
                    <div className="home__row" key={rowIdx}>
                        {row.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
