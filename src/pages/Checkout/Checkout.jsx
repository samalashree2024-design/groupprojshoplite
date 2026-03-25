import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { getCartTotal, getCartItemsCount } from '../../context/reducer';
import './Checkout.css';

function Checkout() {
    const [{ cart }] = useStateValue();
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState(() => localStorage.getItem('shippingAddress') || '');

    useEffect(() => {
        localStorage.setItem('shippingAddress', shippingAddress);
    }, [shippingAddress]);

    const isShippingAddressValid = useMemo(() => shippingAddress.trim().length > 0, [shippingAddress]);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!isShippingAddressValid) {
            alert('Please enter a shipping address.');
            return;
        }
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
                        <label className="checkout__addressLabel" htmlFor="shippingAddress">
                            
                        </label>
                        <textarea
                            id="shippingAddress"
                            className="checkout__addressInput"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="House/Street, City, State, ZIP"
                            rows={4}
                        />
                        {!isShippingAddressValid ? (
                            <p className="checkout__addressError">Please enter a shipping address to place the order.</p>
                        ) : null}
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
                                    <button type="submit" disabled={cart.length === 0 || !isShippingAddressValid}>
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
