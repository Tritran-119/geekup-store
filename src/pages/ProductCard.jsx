import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hoặc bỏ nếu dùng state chuyển view
import { Phone } from 'lucide-react';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Bấm nút "Liên hệ ngay"
  const handleContactClick = (e) => {
    e.stopPropagation(); // ⛔ QUAN TRỌNG: Chặn không cho sự kiện click lan ra Card cha (không bị nhảy trang Detail)
    alert("Đang liên hệ, chức năng đang phát triển...");
  };

  // Bấm vào Card để sang trang Detail
  const handleCardClick = () => {
    // Điều hướng sang trang Detail (ví dụ: /product/kafi-wealth hoặc /product/1)
    navigate(`/product/${product.id || 'detail'}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#E6F7F5] rounded-2xl overflow-hidden p-4 cursor-pointer hover:shadow-lg transition-all group flex flex-col justify-between"
    >
      {/* 1. Hình ảnh sản phẩm */}
      <div className="rounded-xl overflow-hidden mb-4 bg-white h-48">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 2. Tiêu đề, giá và mô tả */}
      <div className="space-y-2 flex-grow">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#33AFA6] transition-colors">
          {product.title}
        </h3>
        <p className="text-[#33AFA6] font-semibold text-sm">
          {product.price || '$ Giá thỏa thuận'}
        </p>
        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
          {product.subtitle || product.desc}
        </p>

        {/* Hashtags / Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(product.tags || ['Finance', 'Mobile App']).map((tag, idx) => (
            <span
              key={idx}
              className="bg-white/80 text-[#33AFA6] text-[11px] font-medium px-2.5 py-1 rounded-full border border-teal-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Nút Liên Hệ Ngay */}
      <div className="pt-4 mt-2">
        <button
          onClick={handleContactClick}
          className="w-full bg-white text-[#33AFA6] border border-[#33AFA6] hover:bg-[#33AFA6] hover:text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
        >
          <Phone size={14} />
          <span>Liên hệ ngay</span>
        </button>
      </div>
    </div>
  );
}