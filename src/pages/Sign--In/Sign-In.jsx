import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { authenticateUser, isValidEmail, normalizeEmail } from '../../utils/auth';
import './Sign-In.css';

function SignIn() {
    const navigate = useNavigate();
    const [, dispatch] = useStateValue();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const nextErrors = {};

        const normalizedEmail = normalizeEmail(email);
        const trimmedPassword = String(password || '').trim();

        if (!normalizedEmail) nextErrors.email = 'Please enter your email.';
        else if (!isValidEmail(normalizedEmail)) nextErrors.email = 'Please enter a valid email address.';

        if (!trimmedPassword) nextErrors.password = 'Please enter your password.';

        return nextErrors;
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setFormError('');

        const nextErrors = validate();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const result = await authenticateUser({ email, password });
            if (!result.ok) {
                if (result.error === 'NOT_FOUND') {
                    setFormError('No account found for this email. Please create an account first.');
                    return;
                }
                setFormError('Incorrect email or password.');
                return;
            }

            const authed = result.user;
            dispatch({
                type: 'SET_USER',
                user: {
                    email: authed.email,
                    name: authed.name || authed.email?.split('@')?.[0] || 'Customer',
                    id: authed.id,
                },
            });

            navigate('/home');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="signin">
            <div className="signin__bg"></div>
            <Link to='/' style={{ textDecoration: 'none' }}>
            </Link>
             
             <div className="signin__logo"><img
         className="signin__logo"
          src="Shoplitelogo3.png"
          alt="Shoplite logo"
                />
                </div>
            <div className="signin__container">
                
                <h1>Sign-In</h1>
                {formError ? (
                    <div className="signin__errorSummary" role="alert">
                        {formError}
                    </div>
                ) : null}
                <form onSubmit={handleSignIn} noValidate>
                    <h5>E-mail</h5>
                    <input
                        type="email"
                        className={`signin__input ${fieldErrors.email ? 'signin__input--error' : ''}`}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.email)}
                        autoComplete="email"
                        inputMode="email"
                    />
                    {fieldErrors.email ? (
                        <div className="signin__errorText" role="alert">
                            {fieldErrors.email}
                        </div>
                    ) : null}
                    <h5>Password</h5>
                    <input
                        type="password"
                        className={`signin__input ${fieldErrors.password ? 'signin__input--error' : ''}`}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.password)}
                        autoComplete="current-password"
                    />
                    {fieldErrors.password ? (
                        <div className="signin__errorText" role="alert">
                            {fieldErrors.password}
                        </div>
                    ) : null}
                    <button type="submit" className="signin__signInButton" disabled={isSubmitting}>
                        Sign In
                    </button>
                </form>
                <p>By signing-in you agree to the ShopLite Conditions of Use & Sale.</p>
                <button type="button" className="signin__registerButton" onClick={() => navigate('/signup')}>
                    Create your ShopLite account
                </button>
               
            </div>
        </div>
    );
}

export default SignIn;
