import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      {/* This holds your background image */}
      <div className="landing__bg"></div>

      <div className="landing__container">
        <div className="landing__logo">
         <img
         className="header__logo"
          src="Shoplitelogo3.png"
          alt="Shoplite logo"
                />
        </div>

        <div className="landing__authBox">
          <h3>Welcome to ShopLite</h3>
          <p>The brightest way to shop.</p>
          
          <Link to="/signup">
            <button className="landing__btn yellow">New to ShopLite? Sign Up</button>
          </Link>
          
          <div className="landing__divider">
            <span>or</span>
          </div>

          <Link to="/signin">
            <button className="landing__btn white">Already a member? Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;