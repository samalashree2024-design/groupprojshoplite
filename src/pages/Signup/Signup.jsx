import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { isValidEmail, normalizeEmail, registerUser } from '../../utils/auth';
import './Signup.css';

function Signup() {
    const navigate = useNavigate();
    const [, dispatch] = useStateValue();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const nextErrors = {};

        const trimmedName = name.trim();
        const normalizedEmail = normalizeEmail(email);
        const trimmedPassword = password.trim();
        const trimmedConfirm = confirmPassword.trim();

        if (!trimmedName) nextErrors.name = 'Please enter your name.';
        if (!normalizedEmail) nextErrors.email = 'Please enter your email.';
        else if (!isValidEmail(normalizedEmail)) nextErrors.email = 'Please enter a valid email address.';

        if (!trimmedPassword) nextErrors.password = 'Please enter a password.';
        else if (trimmedPassword.length < 6) nextErrors.password = 'Password must be at least 6 characters.';

        if (!trimmedConfirm) nextErrors.confirmPassword = 'Please confirm your password.';
        else if (trimmedConfirm !== trimmedPassword) nextErrors.confirmPassword = 'Passwords do not match.';

        return nextErrors;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setFormError('');

        const nextErrors = validate();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const result = await registerUser({ name, email, password });
            if (!result.ok) {
                if (result.error === 'EMAIL_EXISTS') {
                    setFieldErrors({ email: 'An account with this email already exists. Please sign in.' });
                    return;
                }
                setFormError('Could not create your account in this browser. Please try again.');
                return;
            }

            const created = result.user;
            dispatch({
                type: 'SET_USER',
                user: {
                    email: created.email,
                    name: created.name,
                    id: created.id,
                },
            });

            navigate('/home');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup">
            
            <div className="signup__bg"></div>
                         <div className="signup__logo"><img
         className="signup__logo"
          src="Shoplitelogo3.png"
          alt="Shoplite logo"
                />
                </div>
            <div className="signup__card">
                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                  
                </Link>
               
                <h1 className="signup__title">Create account</h1>
                {formError ? (
                    <div className="signup__errorSummary" role="alert">
                        {formError}
                    </div>
                ) : null}
                <form className="signup__form" onSubmit={handleSignup} noValidate>
                    <label className="signup__label" htmlFor="signup-name">Your name</label>
                    <input
                        id="signup-name"
                        name="name"
                        type="text"
                        className={`signup__input ${fieldErrors.name ? 'signup__input--error' : ''}`}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? 'signup-name-error' : undefined}
                        autoComplete="name"
                    />
                    {fieldErrors.name ? (
                        <div id="signup-name-error" className="signup__errorText" role="alert">
                            {fieldErrors.name}
                        </div>
                    ) : null}

                    <label className="signup__label" htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        className={`signup__input ${fieldErrors.email ? 'signup__input--error' : ''}`}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
                        autoComplete="email"
                        inputMode="email"
                    />
                    {fieldErrors.email ? (
                        <div id="signup-email-error" className="signup__errorText" role="alert">
                            {fieldErrors.email}
                        </div>
                    ) : null}

                    <label className="signup__label" htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        className={`signup__input ${fieldErrors.password ? 'signup__input--error' : ''}`}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
                        autoComplete="new-password"
                    />
                    {fieldErrors.password ? (
                        <div id="signup-password-error" className="signup__errorText" role="alert">
                            {fieldErrors.password}
                        </div>
                    ) : null}

                    <label className="signup__label" htmlFor="signup-confirmPassword">Confirm password</label>
                    <input
                        id="signup-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className={`signup__input ${fieldErrors.confirmPassword ? 'signup__input--error' : ''}`}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        aria-describedby={fieldErrors.confirmPassword ? 'signup-confirmPassword-error' : undefined}
                        autoComplete="new-password"
                    />
                    {fieldErrors.confirmPassword ? (
                        <div id="signup-confirmPassword-error" className="signup__errorText" role="alert">
                            {fieldErrors.confirmPassword}
                        </div>
                    ) : null}

                    <button type="submit" className="signup__button" disabled={isSubmitting}>
                        Continue
                    </button>
                </form>
                <div className="signup__footer">
                    <p>Already have an account? <Link to="/signin">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
