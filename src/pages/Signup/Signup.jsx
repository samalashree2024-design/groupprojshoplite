import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import './Signup.css';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Signup() {
  const navigate = useNavigate();
  const [, dispatch] = useStateValue();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');

  const errors = useMemo(() => {
    const nextErrors = {};
    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) nextErrors.name = 'Name is required.';
    if (!email) nextErrors.email = 'Email is required.';
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.';

    if (!values.password) nextErrors.password = 'Password is required.';
    else if (values.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';

    if (!values.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (values.confirmPassword !== values.password) nextErrors.confirmPassword = 'Passwords do not match.';

    if (!values.acceptTerms) nextErrors.acceptTerms = 'You must accept the terms to continue.';

    return nextErrors;
  }, [values]);

  const canSubmit = Object.keys(errors).length === 0;

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    if (!canSubmit) {
      setSubmitError('Please fix the errors below and try again.');
      return;
    }

    dispatch({
      type: 'SET_USER',
      user: { name: values.name.trim(), email: values.email.trim() },
    });
    navigate('/');
  };

  return (
    <div className="signup">
      <div className="signup__card">
        <Link to="/" className="signup__brand">
          Shoplite
        </Link>

        <h1 className="signup__title">Create your account</h1>
        <p className="signup__subtitle">Start shopping with Shoplite in minutes.</p>

        {submitError ? <div className="signup__submitError">{submitError}</div> : null}

        <form className="signup__form" onSubmit={handleSubmit} noValidate>
          <label className="signup__label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            name="name"
            className={`signup__input ${touched.name && errors.name ? 'signup__input--error' : ''}`}
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            placeholder="First and last name"
          />
          {touched.name && errors.name ? <div className="signup__error">{errors.name}</div> : null}

          <label className="signup__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`signup__input ${touched.email && errors.email ? 'signup__input--error' : ''}`}
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            placeholder="you@example.com"
          />
          {touched.email && errors.email ? <div className="signup__error">{errors.email}</div> : null}

          <label className="signup__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`signup__input ${touched.password && errors.password ? 'signup__input--error' : ''}`}
            value={values.password}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="new-password"
            placeholder="At least 6 characters"
          />
          {touched.password && errors.password ? <div className="signup__error">{errors.password}</div> : null}

          <label className="signup__label" htmlFor="confirmPassword">
            Re-enter password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`signup__input ${
              touched.confirmPassword && errors.confirmPassword ? 'signup__input--error' : ''
            }`}
            value={values.confirmPassword}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="new-password"
            placeholder="Re-enter your password"
          />
          {touched.confirmPassword && errors.confirmPassword ? (
            <div className="signup__error">{errors.confirmPassword}</div>
          ) : null}

          <label className="signup__checkboxRow">
            <input
              name="acceptTerms"
              type="checkbox"
              checked={values.acceptTerms}
              onChange={onChange}
              onBlur={onBlur}
            />
            <span>
              I agree to the <span className="signup__muted">Terms & Conditions</span>.
            </span>
          </label>
          {touched.acceptTerms && errors.acceptTerms ? <div className="signup__error">{errors.acceptTerms}</div> : null}

          <button type="submit" className="signup__button" disabled={!canSubmit}>
            Create your Shoplite account
          </button>
        </form>

        <div className="signup__footer">
          <span className="signup__muted">Already shopping here?</span>{' '}
          <Link to="/" className="signup__link">
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
