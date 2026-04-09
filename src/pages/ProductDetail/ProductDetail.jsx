import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import Rating from '../../components/Rating/Rating';
import productsData from '../../data/products.json';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [, dispatch] = useStateValue();

    const product = useMemo(() => {
        return productsData.find(p => p.id === id);
    }, [id]);

    if (!product) {
        return (
            <div className="productDetail__notFound">
                <h2>Product not found.</h2>
                <button onClick={() => navigate('/')}>Return to Home</button>
            </div>
        );
    }

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            item: { ...product }
        });
        window.alert(`Added "${product.title}" to cart.`);
    };

    return (
        <div className="productDetail">
            <div className="productDetail__left">
                <img className="productDetail__image" src={product.image} alt={product.title} />
            </div>

            <div className="productDetail__center">
                <h1 className="productDetail__title">{product.title}</h1>
                <div className="productDetail__rating">
                    <Rating rating={product.rating} />
                </div>
                <hr className="productDetail__divider" />

                <div className="productDetail__priceGroup">
                    <span className="productDetail__priceSymbol">$</span>
                    <span className="productDetail__priceWhole">{Math.floor(product.price)}</span>
                    <span className="productDetail__priceFraction">
                        {(product.price % 1).toFixed(2).substring(2)}
                    </span>
                </div>

                <div className="productDetail__description">
                    <p><strong>Brand:</strong> Shoplite Basics</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Product ID:</strong> {product.id}</p>
                    <ul className="productDetail__features">
                        <li>High quality product</li>
                        <li>Extended warranty available</li>
                        <li>Free returns within 30 days</li>
                    </ul>
                </div>
            </div>

            <div className="productDetail__right">
                <div className="productDetail__actionBox">
                    <div className="productDetail__actionPrice">
                        <span className="productDetail__priceSymbol">$</span>{product.price.toFixed(2)}
                    </div>
                    <p className="productDetail__stock">In Stock.</p>

                    <div className="productDetail__delivery">
                        <p><strong>FREE delivery</strong> Wednesday, Dec 31.</p>
                    </div>

                    <button className="productDetail__addToCart" onClick={addToCart}>
                        Add to Cart
                    </button>

                    <button className="productDetail__buyNow" onClick={() => navigate('/checkout')}>
                        Buy Now
                    </button>

                    <div className="productDetail__secure">
                        <span>Secure transaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
