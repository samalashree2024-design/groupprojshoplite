import React from 'react';
import './Footer.css';

function Footer() {
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div className="footer">
            <div className="footer__backToTop" onClick={scrollToTop}>
                Back to top
            </div>
            <div className="footer__linksContainer">
                <div className="footer__linkCol">
                    <h3>Get to Know Us</h3>
                    <ul>
                        <li>Careers</li>
                        <li>Blog</li>
                        <li>About Shoplite</li>
                        <li>Investor Relations</li>
                        <li>Shoplite Devices</li>
                    </ul>
                </div>
                <div className="footer__linkCol">
                    <h3>Make Money with Us</h3>
                    <ul>
                        <li>Sell products on Shoplite</li>
                        <li>Sell on Shoplite Business</li>
                        <li>Become an Affiliate</li>
                        <li>Advertise Your Products</li>
                        <li>Self-Publish with Us</li>
                    </ul>
                </div>
                <div className="footer__linkCol">
                    <h3>Shoplite Payment Products</h3>
                    <ul>
                        <li>Shoplite Business Card</li>
                        <li>Shop with Points</li>
                        <li>Reload Your Balance</li>
                        <li>Shoplite Currency Converter</li>
                    </ul>
                </div>
                <div className="footer__linkCol">
                    <h3>Let Us Help You</h3>
                    <ul>
                        <li>Shoplite</li>
                        <li>Your Account</li>
                        <li>Your Orders</li>
                        <li>Shipping Rates & Policies</li>
                        <li>Returns & Replacements</li>
                        <li>Manage Your Content and Devices</li>
                        <li>Help</li>
                    </ul>
                </div>
            </div>
            <div className="footer__bottom">
                <img
                    className="footer__logo"
                    src="Shoplitelogo3.png"
                    alt="Shoplite logo"
                />
                <p>© 2026, Shoplite.com, Inc. or its affiliates</p>
            </div>
        </div>
    );
}
export default Footer;
