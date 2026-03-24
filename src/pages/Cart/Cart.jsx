import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { getCartTotal, getCartItemsCount } from '../../context/reducer';
import Rating from '../../components/Rating/Rating';
import './Cart.css';

function Cart() {
    const [{ cart }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const removeFromCart = (id) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            id: id,
        });
    };

    const updateQuantity = (id, newQuantity) => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            id: id,
            quantity: Number(newQuantity)
        });
    };

    return (
        <div className="cart">
            <div className="cart__left">
                <img
                    className="cart__ad"
                    src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
                    alt="Ad"
                />
                <div>
                    <h2 className="cart__title">Your Shopping Cart</h2>
                    {cart?.length === 0 ? (
                        <div className="cart__empty">
                            <p>Your Shoplite Cart is empty.</p>
                            <Link to="/">Shop today's deals</Link>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div className="cartItem" key={`${item.id}-${index}`}>
                                <img className="cartItem__image" src={item.image} alt={item.title} />
                                <div className="cartItem__info">
                                    <Link to={`/product/${item.id}`} className="cartItem__titleLink">
                                        <p className="cartItem__title">{item.title}</p>
                                    </Link>
                                    <p className="cartItem__price">
                                        <small>$</small>
                                        <strong>{item.price}</strong>
                                    </p>
                                    <Rating rating={item.rating} />

                                    <div className="cartItem__actions">
                                        <div className="cartItem__quantity">
                                            <label>Qty:</label>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, e.target.value)}
                                            >
                                                {[...Array(10).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <span className="cartItem__separator">|</span>
                                        <button onClick={() => removeFromCart(item.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="cart__right">
                <div className="cart__subtotal">
                    <p>
                        Subtotal ({getCartItemsCount(cart)} items): <strong>${getCartTotal(cart)?.toFixed(2) || '0.00'}</strong>
                    </p>
                    <small className="cart__gift">
                        <input type="checkbox" /> This order contains a gift
                    </small>
                    <button
                        disabled={cart.length === 0}
                        onClick={() => navigate('/checkout')}
                        className={cart.length === 0 ? "cart__checkoutDisabled" : ""}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
