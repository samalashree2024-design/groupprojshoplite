// src/pages/Orders/Orders.jsx
import React from 'react';
import './Orders.css';

function Orders() {
    return (
        <div className="orders">
            <h1>Your Orders</h1>
            <div className="orders__container">
                {/* Eventually, you will map through order data here */}
                <p>You have no recent orders.</p>
            </div>
        </div>
    );
}

export default Orders;