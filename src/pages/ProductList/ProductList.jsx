import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';
import './ProductList.css';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ProductList() {
    const { category } = useParams();
    const query = useQuery();
    const searchQuery = query.get('q');
    const searchCategory = query.get('category');

    const filteredProducts = useMemo(() => {
        let result = productsData;

        // Filter by route category param e.g. /category/Electronics
        if (category && category !== 'All') {
            result = result.filter(p => p.category === category);
        }

        // Filter by search dropdown category filter (if any)
        if (searchCategory && searchCategory !== 'All') {
            result = result.filter(p => p.category === searchCategory);
        }

        // Filter by text search query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(lowerQuery));
        }

        return result;
    }, [category, searchQuery, searchCategory]);

    return (
        <div className="productList">
            <div className="productList__header">
                <h2>
                    {searchQuery ? `Search Results for "${searchQuery}"` :
                        category ? `${category} Products` : "All Products"}
                </h2>
                <p>{filteredProducts.length} results found</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="productList__grid">
                    {filteredProducts.map(product => (
                        <div className="productList__item" key={product.id}>
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="productList__empty">
                    <h3>No products found matching your criteria.</h3>
                    <p>Try checking your spelling or use more general terms.</p>
                </div>
            )}
        </div>
    );
}

export default ProductList;
