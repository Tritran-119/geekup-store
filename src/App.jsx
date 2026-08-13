import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login'; // Trả lại trang Login đẹp gốc của bạn

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang danh sách sản phẩm */}
        <Route path="/" element={<ProductList />} />
        
        {/* Trang chi tiết sản phẩm */}
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Trang đăng nhập gốc */}
        <Route path="/login" element={<Login />} />
        
        {/* Nếu gõ đường dẫn sai thì quay về trang chủ */}
        <Route path="*" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}