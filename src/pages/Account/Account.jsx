import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { getOrdersForUser, readOrders } from '../../utils/orders';
import './Account.css';

function Account() {
    const [{ user }] = useStateValue();

    const orders = useMemo(() => {
        const all = readOrders();
        return getOrdersForUser(all, user);
    }, [user]);

    if (!user) {
        return (
            <div className="account account--signedOut">
                <div className="account__signedOutCard">
                    <h1 className="account__title">Your Account</h1>
                    <p className="account__subtitle">Sign in to view your profile and orders.</p>
                    <div className="account__signedOutActions">
                        <Link to="/signin" className="account__button account__button--primary">
                            Sign In
                        </Link>
                        <Link to="/signup" className="account__button account__button--ghost">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const name = (user.name || user.email?.split('@')?.[0] || 'Customer').trim();
    const initial = (name?.[0] || 'U').toUpperCase();
    const emailId = user.email || '—';
    const customerId = user.id || `CUS-${String(emailId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase()}` || '—';
    const savedAddress = localStorage.getItem('shippingAddress') || '';

    const dateFmt = new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const currencyFmt = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="account">
            <div className="account__container">
                <header className="account__hero">
                    <div className="account__avatar" aria-hidden="true">
                        {initial}
                    </div>
                    <div className="account__heroText">
                        <h1 className="account__title">Hello, {name}</h1>
                        <p className="account__subtitle">Your profile, saved details, and recent orders.</p>
                    </div>
                </header>

                <div className="account__grid">
                    <section className="account__panel" aria-label="Profile details">
                        <div className="account__panelHeader">
                            <h2 className="account__panelTitle">Profile</h2>
                        </div>

                        <div className="account__rows">
                            <div className="account__row">
                                <div className="account__label">Name</div>
                                <div className="account__value">{name}</div>
                            </div>
                            <div className="account__row">
                                <div className="account__label">Email ID</div>
                                <div className="account__value">{emailId}</div>
                            </div>
                            <div className="account__row">
                                <div className="account__label">Customer ID</div>
                                <div className="account__value account__mono">{customerId}</div>
                            </div>
                            <div className="account__row">
                                <div className="account__label">Saved address</div>
                                <div className="account__value">{savedAddress.trim() ? savedAddress : 'No address saved yet.'}</div>
                            </div>
                        </div>

                        <div className="account__panelActions">
                            <Link to="/orders" className="account__button account__button--primary">
                                View orders
                            </Link>
                            <Link to="/home" className="account__button account__button--ghost">
                                Continue shopping
                            </Link>
                        </div>
                    </section>

                    <section className="account__panel account__panel--orders" aria-label="Recent orders">
                        <div className="account__panelHeader account__panelHeader--split">
                            <h2 className="account__panelTitle">Recent orders</h2>
                            <Link to="/orders" className="account__link">
                                See all
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="account__empty">
                                <p className="account__emptyTitle">No orders yet</p>
                                <p className="account__emptyText">Place an order and you'll see it here.</p>
                                <Link to="/home" className="account__button account__button--primary">
                                    Start shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="account__orderList">
                                {orders.slice(0, 3).map((order) => (
                                    <article key={order.id} className="accountOrder">
                                        <div className="accountOrder__top">
                                            <div>
                                                <div className="accountOrder__id">Order #{String(order.id).slice(0, 10).toUpperCase()}</div>
                                                <div className="accountOrder__meta">
                                                    {order.createdAt ? dateFmt.format(new Date(order.createdAt)) : '-'} |{' '}
                                                    {(order.items || []).reduce((n, it) => n + (Number(it.quantity) || 0), 0)} items
                                                </div>
                                            </div>
                                            <div className="accountOrder__total">
                                                {typeof order.total === 'number' ? currencyFmt.format(order.total) : '-'}
                                            </div>
                                        </div>

                                        <div className="accountOrder__items">
                                            {(order.items || []).slice(0, 2).map((it) => (
                                                <div key={`${order.id}_${it.id}`} className="accountOrderItem">
                                                    {it.image ? <img className="accountOrderItem__img" src={it.image} alt={it.title || 'Item'} /> : null}
                                                    <div className="accountOrderItem__info">
                                                        <div className="accountOrderItem__title">{it.title || 'Item'}</div>
                                                        <div className="accountOrderItem__meta">
                                                            Qty {it.quantity || 1} | {currencyFmt.format(Number(it.price) || 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(order.items || []).length > 2 ? (
                                                <div className="accountOrder__more">+{(order.items || []).length - 2} more</div>
                                            ) : null}
                                        </div>

                                        {order.shippingAddress ? (
                                            <div className="accountOrder__address">
                                                <span className="accountOrder__addressLabel">Ship to:</span> {order.shippingAddress}
                                            </div>
                                        ) : null}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Account;
