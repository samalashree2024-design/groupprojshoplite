import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { getCartTotal, getCartItemsCount } from '../../context/reducer';
import './Checkout.css';

function Checkout() {
    const [{ cart }] = useStateValue();
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState(() => localStorage.getItem('shippingAddress') || '');
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const intervalId = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        localStorage.setItem('shippingAddress', shippingAddress);
    }, [shippingAddress]);

    const isShippingAddressValid = useMemo(() => shippingAddress.trim().length > 0, [shippingAddress]);

    const deliveryInfo = useMemo(() => {
        const cutoffHour = 17;
        const cutoffMinute = 0;

        const addDays = (date, days) => {
            const d = new Date(date);
            d.setDate(d.getDate() + days);
            return d;
        };

        const buildCutoffForDay = (baseDate) => {
            const d = new Date(baseDate);
            d.setHours(cutoffHour, cutoffMinute, 0, 0);
            return d;
        };

        const cutoffToday = buildCutoffForDay(now);
        const isBeforeCutoff = now <= cutoffToday;
        const shipsAt = isBeforeCutoff ? cutoffToday : buildCutoffForDay(addDays(now, 1));

        const msUntilShip = shipsAt.getTime() - now.getTime();
        const toHMS = (ms) => {
            const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const pad2 = (n) => String(n).padStart(2, '0');
            return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
        };

        const estimatedStart = addDays(shipsAt, 3);
        const estimatedEnd = addDays(shipsAt, 5);

        const dateTimeFmt = new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const dateFmt = new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        return {
            nowText: dateTimeFmt.format(now),
            shipsAtText: dateTimeFmt.format(shipsAt),
            isBeforeCutoff,
            timeUntilShipText: toHMS(msUntilShip),
            estimatedStartText: dateFmt.format(estimatedStart),
            estimatedEndText: dateFmt.format(estimatedEnd),
        };
    }, [now]);

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

                {/* Delivery Estimate */}
                <div className="checkout__section">
                    <div className="checkout__title">
                        <h3>3 Delivery estimate</h3>
                    </div>
                    <div className="checkout__delivery">
                        <div className="checkout__deliveryCard" aria-live="polite">
                            {cart.length === 0 ? (
                                <p className="checkout__deliveryRow">Add items to your cart to see a delivery estimate.</p>
                            ) : (
                                <>
                                    <p className="checkout__deliveryRow">
                                        <span className="checkout__deliveryLabel">Current time:</span> {deliveryInfo.nowText}
                                    </p>
                                    <p className="checkout__deliveryRow">
                                        <span className="checkout__deliveryLabel">
                                            {deliveryInfo.isBeforeCutoff ? 'Order within:' : 'Ships in:'}
                                        </span>{' '}
                                        {deliveryInfo.timeUntilShipText} (ships at {deliveryInfo.shipsAtText})
                                    </p>
                                    <p className="checkout__deliveryRow">
                                        <span className="checkout__deliveryLabel">Estimated delivery:</span>{' '}
                                        {deliveryInfo.estimatedStartText} – {deliveryInfo.estimatedEndText} (10 AM – 6 PM)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Review items */}
                <div className="checkout__section">
                    <div className="checkout__title">
                        <h3>4 Review items and shipping</h3>
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