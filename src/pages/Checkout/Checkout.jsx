import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { getCartTotal, getCartItemsCount } from '../../context/reducer';
import './Checkout.css';

function Checkout() {
    const [{ cart }] = useStateValue();
    const navigate = useNavigate();

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        alert('Order placed successfully! (UI Simulation Only)');
        navigate('/');
    };

    return (
        <div className="checkout">
            <div className="checkout__header">
                <h1>
                    Checkout (
                    <Link to="/cart">{getCartItemsCount(cart)} items</Link>
                    )
                </h1>
            </div>

            <div className="checkout__container">
                {/* Shipping Address */}
                <div className="checkout__section">
                    <div className="checkout__title">
                        <h3>1 Shipping address</h3>
                    </div>
                    <div className="checkout__address">
                        <p>Jane Doe</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="checkout__section">
                    <div className="checkout__title">
                        <h3>2 Payment method</h3>
                    </div>
                    <div className="checkout__payment">
                        <div className="checkout__paymentDetails">
                            <form onSubmit={handlePlaceOrder}>
                                <div className="checkout__cardInfo">
                                    <p>Ending in 4242</p>
                                    <p>Billing address same as shipping.</p>
                                </div>

                                <div className="checkout__priceContainer">
                                    <h3>Order Total: ${getCartTotal(cart)?.toFixed(2) || '0.00'}</h3>
                                    <button type="submit" disabled={cart.length === 0}>
                                        Place your order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Review items */}
                <div className="checkout__section">
                    <div className="checkout__title">
                        <h3>3 Review items and shipping</h3>
                    </div>
                    <div className="checkout__items">
                        {cart.map((item, idx) => (
                            <div key={idx} className="checkout__item">
                                <img src={item.image} alt={item.title} />
                                <div className="checkout__itemInfo">
                                    <p className="checkout__itemTitle">{item.title}</p>
                                    <p className="checkout__itemPrice">${item.price}</p>
                                    <p className="checkout__itemQty">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Checkout;
