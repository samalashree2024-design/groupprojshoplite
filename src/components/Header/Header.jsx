import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdSearch, MdShoppingCart, MdMenu } from 'react-icons/md';
import { useStateValue } from '../../context/StateProvider';
import { getCartItemsCount } from '../../context/reducer';
import './Header.css';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Books', 'Gaming'];

function Header() {
    const [{ cart, user }, dispatch] = useStateValue();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = useRef(null);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        const updateHeaderHeightVar = () => {
            const height = headerRef.current?.offsetHeight ?? 0;
            root.style.setProperty('--app-header-height', `${height}px`);
        };
        body.classList.add('app--hasHeader');
        updateHeaderHeightVar();    
        let resizeObserver;
        if (typeof ResizeObserver !== 'undefined' && headerRef.current) {
            resizeObserver = new ResizeObserver(() => updateHeaderHeightVar());
            resizeObserver.observe(headerRef.current);
        } else {
            window.addEventListener('resize', updateHeaderHeightVar);
        }

        return () => {
            body.classList.remove('app--hasHeader');
            root.style.removeProperty('--app-header-height');
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeaderHeightVar);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const body = document.body;
        if (isMenuOpen) body.classList.add('nav--menuOpen');
        else body.classList.remove('nav--menuOpen');

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };

        if (isMenuOpen) window.addEventListener('keydown', onKeyDown);
        return () => {
            body.classList.remove('nav--menuOpen');
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}&category=${category}`);
        } else if (category !== 'All') {
            navigate(`/category/${category}`);
        }
    };

    const handleSignOut = () => {
        dispatch({ type: 'SET_USER', user: null });
        navigate('/'); 
    };

    const isCategoryActive = (cat) => location.pathname === `/category/${cat}`;

    return (
        <div className="header__container" ref={headerRef}>
            <div className="header">
                <div className="header__inner">
                    <div className="header__brand">
                        <Link to="/home" className="header__brandLink" aria-label="Shoplite home">
                            <img className="header__logoImg" src="Shoplitelogo3.png" alt="Shoplite logo" />
                        </Link>
                    </div>

                    <form className="header__search" onSubmit={handleSearch} role="search" aria-label="Shoplite search">
                        <select
                            className="header__categoryDropdown"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            aria-label="Search category"
                        >
                            <option value="All">All</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <input
                            className="header__searchInput"
                            type="text"
                            placeholder="Search products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="header__searchButton" type="submit" aria-label="Search">
                            <MdSearch className="header__searchIcon" />
                        </button>
                    </form>

                    <nav className="header__nav" aria-label="Account and cart">
                        {!user ? (
                            <Link to="/signin" className="header__link">
                                <div className="header__option">
                                    <span className="header__optionLineOne">Hello</span>
                                    <span className="header__optionLineTwo">Sign In</span>
                                </div>
                            </Link>
                        ) : (
                            <>
                                <Link to="/account" className="header__link">
                                    <div className="header__option">
                                        <span className="header__optionLineOne">Hello, {user.name || user.email}</span>
                                        <span className="header__optionLineTwo">Account</span>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="header__option header__optionButton header__signOutButton"
                                    aria-label="Sign out"
                                >
                                    <span className="header__optionLineOne">Session</span>
                                    <span className="header__optionLineTwo">Sign Out</span>
                                </button>
                            </>
                        )}

                        <Link to="/orders" className="header__link">
                            <div className="header__option">
                                <span className="header__optionLineOne">Returns</span>
                                <span className="header__optionLineTwo">& Orders</span>
                            </div>
                        </Link>

                        <Link to="/cart" aria-label="Open cart">
                            <div className="header__optionBasket">
                                <MdShoppingCart className="header__cartIcon" />
                                <span className="header__optionLineTwo header__basketCount">{getCartItemsCount(cart) || 0}</span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="header__bottom" role="navigation" aria-label="Categories">
                <div className="header__bottomInner">
                    <button
                        type="button"
                        className="header__menuButton"
                        onClick={() => setIsMenuOpen((v) => !v)}
                        aria-expanded={isMenuOpen}
                        aria-controls="header-drawer"
                    >
                        <MdMenu className="header__menuIcon" />
                        Browse
                    </button>

                    <div className="header__pillNav" aria-label="Category quick links">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat}
                                to={`/category/${cat}`}
                                className={`header__pill ${isCategoryActive(cat) ? 'is-active' : ''}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className={`header__overlay ${isMenuOpen ? 'is-open' : ''}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden={!isMenuOpen}
            />

            <aside
                id="header-drawer"
                className={`header__drawer ${isMenuOpen ? 'is-open' : ''}`}
                aria-hidden={!isMenuOpen}
            >
                <div className="header__drawerHeader">
                    <span className="header__drawerTitle">Shoplite</span>
                    <button type="button" className="header__drawerClose" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                        ×
                    </button>
                </div>

                <div className="header__drawerSection">
                    <div className="header__drawerSectionTitle">Shop by category</div>
                    {CATEGORIES.map((cat) => (
                        <Link key={cat} to={`/category/${cat}`} className="header__drawerLink">
                            {cat}
                        </Link>
                    ))}
                </div>

                <div className="header__drawerSection">
                    <div className="header__drawerSectionTitle">Quick links</div>
                    <Link to="/home" className="header__drawerLink">
                        Home
                    </Link>
                    <Link to="/cart" className="header__drawerLink">
                        Cart
                    </Link>
                    <Link to="/orders" className="header__drawerLink">
                        Orders
                    </Link>
                    <Link to="/returns" className="header__drawerLink">
                        Returns
                    </Link>
                    {user ? (
                        <Link to="/account" className="header__drawerLink">
                            Account
                        </Link>
                    ) : null}
                    {!user ? (
                        <Link to="/signin" className="header__drawerLink">
                            Sign In
                        </Link>
                    ) : (
                        <button type="button" className="header__drawerLink header__drawerButton" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default Header;
