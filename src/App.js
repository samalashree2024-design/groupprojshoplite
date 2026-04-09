import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Check these imports carefully! 
// Ensure the folder name (Sign--In) and filename (Sign-In) match your VS Code sidebar exactly.
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import ProductList from './pages/ProductList/ProductList';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Signup from './pages/Signup/Signup';
import SignIn from './pages/Sign--In/Sign-In'; // Changed to match your common filename
import Landing from './pages/Landing/Landing';
import Orders from './pages/Orders/Orders';
import Account from './pages/Account/Account';

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Routes>
          {/* Landing Page (The first thing users see) */}
          <Route path="/" element={<Landing />} />

          {/* Auth Pages (No Header/Footer) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />

          {/* Main Store Routes (With Header and Footer) */}
          <Route path="/home" element={<><Header /><Home /><Footer /></>} />
          
          <Route path="/search" element={<><Header /><ProductList /><Footer /></>} />
          
          <Route path="/category/:category" element={<><Header /><ProductList /><Footer /></>} />
          
          <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
          
          <Route path="/cart" element={<><Header /><Cart /><Footer /></>} />
          
          <Route path="/checkout" element={<><Header /><Checkout /><Footer /></>} />
          <Route path="/account" element={<><Header /><Account /><Footer /></>} />

          <Route path="/returns" element={<><Header /><Orders /><Footer /></>} />
          <Route path="/orders" element={<><Header /><Orders /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
