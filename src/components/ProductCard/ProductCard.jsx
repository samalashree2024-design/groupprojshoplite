import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../Rating/Rating';
import { useStateValue } from '../../context/StateProvider';
import './ProductCard.css';

function ProductCard({ id, title, image, price, rating, category }) {
    const [, dispatch] = useStateValue();

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            item: {
                id,
                title,
                image,
                price,
                rating,
                category,
            },
        });
    };

    return (
        <div className="productCard">
            <Link to={`/product/${id}`} className="productCard__link">
                <div className="productCard__imageContainer">
                    <img className="productCard__image" src={image} alt={title} />
                </div>
                <div className="productCard__info">
                    <p className="productCard__title">{title}</p>
                    <Rating rating={rating} />
                    <p className="productCard__price">
                        <small>$</small>
                        <strong>{price}</strong>
                    </p>
                </div>
            </Link>
            <button className="productCard__button" onClick={addToCart}>
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;
