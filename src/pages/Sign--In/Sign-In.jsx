import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Sign-In.css';

function SignIn() {
    const navigate = useNavigate();
const handleSignIn = (e) => {
    e.preventDefault();
    console.log("Sign In Clicked - Moving to Home");
    
    // Change '/' to '/home'
    navigate('/home'); 
};
    return (
        <div className="signin">
            <div className="signin__bg"></div>
            <Link to='/' style={{ textDecoration: 'none' }}>
            </Link>
             
             <div className="signin__logo"><img
         className="signin__logo"
          src="Shoplite1.png"
          alt="Shoplite logo"
                />
                </div>
            <div className="signin__container">
                
                <h1>Sign-In</h1>
                <form>
                    <h5>E-mail</h5>
                    <input type='text' />
                    <h5>Password</h5>
                    <input type='password' />
                    <button type='submit' onClick={handleSignIn} className='signin__signInButton'>Sign In</button>
                </form>
                <p>By signing-in you agree to the ShopLite Conditions of Use & Sale.</p>
               
            </div>
        </div>
    );
}

export default SignIn;