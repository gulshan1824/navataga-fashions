import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
