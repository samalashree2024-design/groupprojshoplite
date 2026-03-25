import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdShoppingCart, MdMenu } from 'react-icons/md';
import { useStateValue } from '../../context/StateProvider';
import { getCartItemsCount } from '../../context/reducer';
import './Header.css';

function Header() {
    const [{ cart, user }, dispatch] = useStateValue();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const navigate = useNavigate();

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
    };

    return (
        <div className="header__container">
            {/* Top Main Navbar */}
            <div className="header">
                <Link to="/">
                    <img
                        className="header__logo"
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                        alt="Shoplite Logo"
                    />
                </Link>

                {/* Search Bar */}
                <div className="header__search">
                    <select
                        className="header__categoryDropdown"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home</option>
                        <option value="Books">Books</option>
                        <option value="Gaming">Gaming</option>
                    </select>
                    <input
                        className="header__searchInput"
                        type="text"
                        placeholder="Search Shoplite"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                    />
                    <MdSearch className="header__searchIcon" onClick={handleSearch} />
                </div>

                {/* Right Section Nav */}
                <div className="header__nav">
                    {user ? (
                        <div
                            className="header__option"
                            role="button"
                            tabIndex={0}
                            onClick={handleSignOut}
                            onKeyDown={(e) => e.key === 'Enter' && handleSignOut()}
                        >
                            <span className="header__optionLineOne">Hello, {user.name || 'User'}</span>
                            <span className="header__optionLineTwo">Sign Out</span>
                        </div>
                    ) : (
                        <Link to="/signup" className="header__link">
                            <div className="header__option">
                                <span className="header__optionLineOne">Hello, Guest</span>
                                <span className="header__optionLineTwo">Sign Up</span>
                            </div>
                        </Link>
                    )}

                    <div className="header__option">
                        <span className="header__optionLineOne">Returns</span>
                        <span className="header__optionLineTwo">& Orders</span>
                    </div>

                    <Link to="/cart">
                        <div className="header__optionBasket">
                            <MdShoppingCart className="header__cartIcon" />
                            <span className="header__optionLineTwo header__basketCount">
                                {getCartItemsCount(cart) || 0}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Secondary Menu (Subnav) */}
            <div className="header__bottom">
                <p className="header__menuItem">
                    <MdMenu className="header__menuIcon" />
                    All
                </p>
                <Link to="/category/Electronics" className="header__menuItem">Electronics</Link>
                <Link to="/category/Fashion" className="header__menuItem">Fashion</Link>
                <Link to="/category/Home" className="header__menuItem">Home</Link>
                <Link to="/category/Books" className="header__menuItem">Books</Link>
                <Link to="/category/Gaming" className="header__menuItem">Gaming</Link>
            </div>
        </div>
    );
}

export default Header;
