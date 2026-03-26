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
        navigate('/'); 
    };

    return (
        <div className="header__container">
            <div className="header">
                {/* Fixed Logo Section */}
                <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
                    <div className="header__logo">
                        <div className="header__logoIcon">
                            <span className="header__cart">🛒</span>
                            <span className="header__bulb">💡</span>
                        </div>
                        <span className="header__logoText">ShopLite</span>
                    </div>
                </Link>

                <div className="header__search">
                    <select className="header__categoryDropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home</option>
                    </select>
                    <input className="header__searchInput" type="text" placeholder="Search Shoplite" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <MdSearch className="header__searchIcon" onClick={handleSearch} />
                </div>

                <div className="header__nav">
                    {!user ? (
                        <Link to="/signup" className="header__link">
                            <div className="header__option">
                                <span className="header__optionLineOne">Hello, Guest</span>
                                <span className="header__optionLineTwo">Sign Out</span>
                            </div>
                        </Link>
                    ) : (
                        <div onClick={handleSignOut} className="header__option" style={{ cursor: 'pointer' }}>
                            <span className="header__optionLineOne">Hello, {user.email}</span>
                            <span className="header__optionLineTwo">Sign Out</span>
                        </div>
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

            <div className="header__bottom">
                <p className="header__menuItem"><MdMenu className="header__menuIcon" /> All</p>
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