import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup Clicked - Moving to Home");
    
    // CHANGE THIS: from '/' to '/home'
    navigate('/home'); 
};

    return (
        <div className="signup">
            <div className="signup__bg"></div>
            <div className="signup__card">
                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                    <h2 className="signup__brand">🛒💡 ShopLite</h2>
                </Link>
                <h1 className="signup__title">Create account</h1>
                <form className="signup__form">
                    <label className="signup__label">Your name</label>
                    <input type="text" className="signup__input" />
                    <label className="signup__label">Email</label>
                    <input type="email" className="signup__input" />
                    <label className="signup__label">Password</label>
                    <input type="password" className="signup__input" />
                    <button type="submit" onClick={handleSignup} className="signup__button">Continue</button>
                </form>
                <div className="signup__footer">
                    <p>Already have an account? <Link to="/signin">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;