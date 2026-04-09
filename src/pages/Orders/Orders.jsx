import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { getOrdersForUser, readOrders } from '../../utils/orders';
import { addReturnRequest, buildOrderItemKey, getReturnsForUser, readReturns, setReturnStatus } from '../../utils/returns';
import './Orders.css';

function Orders() {
    const [{ user }] = useStateValue();
    const location = useLocation();
    const [returnsVersion, setReturnsVersion] = useState(0);

    const activeTab = location.pathname.startsWith('/returns') ? 'returns' : 'orders';

    const orders = useMemo(() => {
        const all = readOrders();
        return getOrdersForUser(all, user);
    }, [user]);

    const returns = useMemo(() => {
        void returnsVersion;
        const all = readReturns();
        return getReturnsForUser(all, user);
    }, [user, returnsVersion]);

    const activeReturnItemKeys = useMemo(() => {
        const keys = new Set();
        for (const r of returns) {
            if (!r?.orderId || !r?.itemId) continue;
            if (String(r.status || '').toLowerCase() === 'cancelled') continue;
            keys.add(buildOrderItemKey(r.orderId, r.itemId));
        }
        return keys;
    }, [returns]);

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

    const createId = () => {
        if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID();
        return `ret_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    };

    const handleRequestReturn = (order, item) => {
        if (!user?.email) return;

        const key = buildOrderItemKey(order?.id, item?.id);
        if (activeReturnItemKeys.has(key)) {
            alert('A return has already been requested for this item.');
            return;
        }

        const title = item?.title || 'Item';
        const reasonInput = window.prompt(`Reason for return (optional) for "${title}":`, '');
        if (reasonInput === null) return;

        const ok = window.confirm(`Request a return for "${title}"?`);
        if (!ok) return;

        const quantity = Number(item?.quantity) || 1;
        const price = Number(item?.price) || 0;

        addReturnRequest({
            id: createId(),
            userEmail: user.email,
            createdAt: new Date().toISOString(),
            orderId: order?.id,
            orderCreatedAt: order?.createdAt || null,
            itemId: item?.id,
            itemTitle: title,
            itemImage: item?.image || '',
            itemPrice: price,
            quantity,
            reason: String(reasonInput || '').trim(),
            status: 'Requested',
        });

        setReturnsVersion((v) => v + 1);
        alert('Return requested. You can track it under the Returns tab.');
    };

    const handleCancelReturn = (returnRequest) => {
        if (!returnRequest?.id) return;
        if (String(returnRequest.status || '').toLowerCase() !== 'requested') return;

        const ok = window.confirm('Cancel this return request?');
        if (!ok) return;

        setReturnStatus(returnRequest.id, 'Cancelled');
        setReturnsVersion((v) => v + 1);
    };

    if (!user) {
        return (
            <div className="ordersPage ordersPage--signedOut">
                <div className="ordersPage__signedOutCard">
                    <h1 className="ordersPage__title">{activeTab === 'returns' ? 'Your Returns' : 'Your Orders'}</h1>
                    <p className="ordersPage__subtitle">Sign in to view your order history and returns.</p>
                    <div className="ordersPage__actions">
                        <Link to="/signin" className="ordersPage__button ordersPage__button--primary">
                            Sign In
                        </Link>
                        <Link to="/home" className="ordersPage__button ordersPage__button--ghost">
                            Continue shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ordersPage">
            <div className="ordersPage__container">
                <header className="ordersPage__header">
                    <div>
                        <h1 className="ordersPage__title">{activeTab === 'returns' ? 'Your Returns' : 'Your Orders'}</h1>
                        <p className="ordersPage__subtitle">
                            {activeTab === 'returns'
                                ? 'Track the status of your return requests.'
                                : 'Review items, totals, and shipping details.'}
                        </p>
                        <div className="ordersPage__tabs" role="tablist" aria-label="Orders and returns tabs">
                            <Link
                                to="/orders"
                                className={`ordersPage__tab ${activeTab === 'orders' ? 'is-active' : ''}`}
                                role="tab"
                                aria-selected={activeTab === 'orders'}
                            >
                                Orders
                            </Link>
                            <Link
                                to="/returns"
                                className={`ordersPage__tab ${activeTab === 'returns' ? 'is-active' : ''}`}
                                role="tab"
                                aria-selected={activeTab === 'returns'}
                            >
                                Returns
                            </Link>
                        </div>
                    </div>
                    <Link to="/account" className="ordersPage__button ordersPage__button--ghost">
                        Back to account
                    </Link>
                </header>

                {activeTab === 'returns' ? (
                    returns.length === 0 ? (
                        <div className="ordersPage__empty">
                            <p className="ordersPage__emptyTitle">No returns yet</p>
                            <p className="ordersPage__emptyText">Request a return from your Orders tab and it will appear here.</p>
                            <Link to="/orders" className="ordersPage__button ordersPage__button--primary">
                                View orders
                            </Link>
                        </div>
                    ) : (
                        <div className="ordersPage__list">
                            {returns.map((r) => {
                                const statusText = r?.status || 'Requested';
                                const statusSlug = String(statusText).toLowerCase().replace(/\s+/g, '');
                                const canCancel = String(statusText).toLowerCase() === 'requested';
                                return (
                                    <article key={r.id} className="orderCard returnCard">
                                        <div className="returnCard__top">
                                            <div>
                                                <div className="orderCard__id">
                                                    Return #{String(r.id || '').slice(0, 10).toUpperCase() || '-'}
                                                </div>
                                                <div className="orderCard__meta">
                                                    Requested {r.createdAt ? dateFmt.format(new Date(r.createdAt)) : '-'}
                                                </div>
                                                <div className="orderCard__meta">
                                                    For order #{String(r.orderId || '').slice(0, 10).toUpperCase() || '-'}
                                                </div>
                                            </div>
                                            <div className={`returnCard__status returnCard__status--${statusSlug}`}>{statusText}</div>
                                        </div>

                                        <div className="orderCard__items">
                                            <div className="orderItem">
                                                {r?.itemImage ? (
                                                    <img className="orderItem__img" src={r.itemImage} alt={r.itemTitle || 'Item'} />
                                                ) : null}
                                                <div className="orderItem__info">
                                                    <div className="orderItem__title">{r?.itemTitle || 'Item'}</div>
                                                    <div className="orderItem__meta">
                                                        Qty {r?.quantity || 1} | {currencyFmt.format(Number(r?.itemPrice) || 0)}
                                                    </div>
                                                </div>
                                                <div className="orderItem__actions">
                                                    {canCancel ? (
                                                        <button
                                                            type="button"
                                                            className="orderItem__button"
                                                            onClick={() => handleCancelReturn(r)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="returnCard__reason">
                                            <span className="returnCard__reasonLabel">Reason:</span>{' '}
                                            {String(r?.reason || '').trim() ? r.reason : '—'}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )
                ) : orders.length === 0 ? (
                    <div className="ordersPage__empty">
                        <p className="ordersPage__emptyTitle">No orders found</p>
                        <p className="ordersPage__emptyText">Checkout with items in your cart to create an order.</p>
                        <Link to="/home" className="ordersPage__button ordersPage__button--primary">
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="ordersPage__list">
                        {orders.map((order) => (
                            <article key={order.id} className="orderCard">
                                <div className="orderCard__top">
                                    <div>
                                        <div className="orderCard__id">Order #{String(order.id).slice(0, 10).toUpperCase()}</div>
                                        <div className="orderCard__meta">
                                            Placed {order.createdAt ? dateFmt.format(new Date(order.createdAt)) : '-'}
                                        </div>
                                    </div>
                                    <div className="orderCard__total">
                                        {typeof order.total === 'number' ? currencyFmt.format(order.total) : '-'}
                                    </div>
                                </div>

                                {order.shippingAddress ? (
                                    <div className="orderCard__address">
                                        <span className="orderCard__addressLabel">Ship to:</span> {order.shippingAddress}
                                    </div>
                                ) : null}

                                <div className="orderCard__items">
                                    {(order.items || []).map((it) => {
                                        const key = buildOrderItemKey(order?.id, it?.id);
                                        const isReturnRequested = activeReturnItemKeys.has(key);
                                        return (
                                            <div key={`${order.id}_${it.id}`} className="orderItem">
                                                {it.image ? (
                                                    <img className="orderItem__img" src={it.image} alt={it.title || 'Item'} />
                                                ) : null}
                                                <div className="orderItem__info">
                                                    <div className="orderItem__title">{it.title || 'Item'}</div>
                                                    <div className="orderItem__meta">
                                                        Qty {it.quantity || 1} | {currencyFmt.format(Number(it.price) || 0)}
                                                    </div>
                                                </div>
                                                <div className="orderItem__actions">
                                                    <button
                                                        type="button"
                                                        className="orderItem__button orderItem__button--primary"
                                                        onClick={() => handleRequestReturn(order, it)}
                                                        disabled={isReturnRequested}
                                                    >
                                                        {isReturnRequested ? 'Return requested' : 'Return'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
