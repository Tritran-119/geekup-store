import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, LogOut, User, Phone, Mail, MapPin, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams(); // 🎯 Lấy id sản phẩm từ URL (VD: /product/kafi-0)
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState({ name: 'Admin' });

    // Dữ liệu Danh sách Sản phẩm liên quan
    const relatedProducts = [
        {
            id: 'kafi-0',
            title: 'Kafi Wealth',
            price: '$ Giá thỏa thuận',
            desc: 'Chứng Khoán Kafi Tiên Phong Xây dựng Giải Pháp Quản Lý Gia Sản (Wealth...',
            tags: ['Finance', 'Mobile App'],
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'
        },
        {
            id: 'geekup-portal',
            title: 'GeekUp Portal',
            price: '$ Giá thỏa thuận',
            desc: 'Hệ thống quản lý nội bộ doanh nghiệp tối ưu hóa quy trình làm việc...',
            tags: ['Enterprise', 'Web App'],
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
        },
        {
            id: 'fintech-wallet',
            title: 'Fintech E-Wallet',
            price: '$ Giá thỏa thuận',
            desc: 'Ví điện tử thông minh hỗ trợ thanh toán siêu tốc và tích hợp tiện ích...',
            tags: ['Fintech', 'Mobile App'],
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop'
        }
    ];

    // Logic Carousel
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    // 🎯 Hàm định dạng dữ liệu sản phẩm hiển thị chuẩn Mockup
    const formatProduct = (item) => {
        const fullName = item.name || item.title || 'Sản Phẩm GEEK Up';
        const nameParts = fullName.split(' ');
        const firstWord = nameParts[0] || 'GEEK';
        const restWords = nameParts.slice(1).join(' ') || 'Solution';

        return {
            id: item.id || id,
            title: firstWord,
            highlightTitle: restWords,
            subtitle: item.subtitle || item.description || 'Giải pháp sản phẩm số tiên phong.',
            visitLink: item.visitLink || 'https://geekup.vn',
            hashtags: item.tags ? item.tags.map(t => `#${t.toUpperCase().replace(/\s+/g, '_')}`) : ['#GEEKUP', '#DIGITAL_INNOVATION'],
            heroImage: item.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
            detailImage: item.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
            services: item.service || ['UX Research', 'Product Concept', 'UX Ideation'],
            description: item.description || item.subtitle || 'Dữ liệu mô tả sản phẩm chi tiết đang được cập nhật từ hệ thống GEEK Up.'
        };
    };

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            // 1. Thử gọi API chi tiết theo ID
            const res = await axios.get(`http://localhost:3001/api/product/${id}`);
            if (res.data) {
                setProduct(formatProduct(res.data));
                return;
            }
        } catch (err) {
            // 2. Nếu API /product/:id không có, thử lấy danh sách rồi lọc item đúng ID
            try {
                const resList = await axios.get('http://localhost:3001/api/product');
                if (Array.isArray(resList.data)) {
                    const found = resList.data.find(p => String(p.id) === String(id));
                    if (found) {
                        setProduct(formatProduct(found));
                        return;
                    }
                }
            } catch (e) { }

            // 3. Fallback Mock Data Động dựa theo ID vừa bấm
            const isKafi = String(id).toLowerCase().includes('kafi');
            setProduct(formatProduct({
                id: id,
                name: isKafi ? "Kafi Wealth" : `GEEK Project ${id}`,
                subtitle: isKafi
                    ? "Chứng Khoán Kafi Tiên Phong Xây dựng Giải Pháp Quản Lý Gia Sản (Wealth Management) Thông Minh Và An Toàn"
                    : `Giải pháp chuyển đổi số toàn diện dành riêng cho dự án mã ${id}`,
                description: isKafi
                    ? "Chứng khoán Kafi là một trong những đơn vị tiên phong tại Việt Nam trong lĩnh vực Quản lý Gia sản (Wealth Management), tận dụng hệ sinh thái công nghệ số để kiến tạo những giải pháp tài chính toàn diện. Với sự đồng hành từ GEEK Up, Kafi đã xây dựng thành công hệ sinh thái tài chính tích hợp."
                    : `Dự án mã ${id} do GEEK Up tư vấn và triển khai, áp dụng quy trình thiết kế tinh gọn (Lean Product Development) giúp tối ưu hóa trải nghiệm người dùng và gia tăng giá trị cho doanh nghiệp.`,
                tags: isKafi ? ["Finance", "Mobile App"] : ["Digital", "Innovation"],
                image: isKafi
                    ? "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
                    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (startIndex + 3 < relatedProducts.length) {
            setStartIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-sans">
                Đang tải thông tin chi tiết sản phẩm...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">

            {/* ---------------- 1. HEADER ---------------- */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-6">
                        <img
                            src="../src/assets/logo.svg"
                            alt="GEEK Up"
                            className="h-9 cursor-pointer"
                            onClick={() => navigate('/')}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="relative hidden md:block w-72">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#33AFA6]"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-700">
                        <button onClick={() => navigate('/')} className="text-[#33AFA6] font-semibold">Sản phẩm</button>
                        <button onClick={() => alert('Tính năng Dịch vụ đang phát triển!')} className="hover:text-[#33AFA6] transition-colors">Dịch vụ</button>
                        <button onClick={() => alert('Tính năng Về GeekUp đang phát triển!')} className="hover:text-[#33AFA6] transition-colors">Về GeekUp</button>
                        <button onClick={() => alert('Tính năng Liên hệ đang phát triển!')} className="hover:text-[#33AFA6] transition-colors">Liên hệ</button>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=33AFA6&color=fff&bold=true&rounded=true`}
                                    alt="User Avatar"
                                    className="w-9 h-9 rounded-full border-2 border-[#33AFA6] object-cover shadow-sm"
                                />
                                <span className="text-sm font-semibold text-[#0B7B7A] hidden sm:inline">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-xs text-red-500 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                                >
                                    <LogOut size={14} />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center space-x-1 text-sm text-[#33AFA6] font-semibold hover:underline"
                            >
                                <User size={16} />
                                <span>Đăng nhập</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-grow">

                {/* ---------------- 2. HERO SECTION ---------------- */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Cột Trái: Title, Subtitle, Visit Button, Hashtags */}
                        <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-4">
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                                {product?.title} <span className="text-[#33AFA6]">{product?.highlightTitle}</span>
                            </h1>

                            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                                {product?.subtitle}
                            </p>

                            <div>
                                <a
                                    href={product?.visitLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-[#33AFA6] hover:bg-[#2b968f] text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all"
                                >
                                    <span>Visit App</span>
                                    <ExternalLink size={16} />
                                </a>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-[#33AFA6]">
                                {product?.hashtags.map((tag, idx) => (
                                    <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Cột Phải: Ảnh Item Phóng To Khung Xanh Ngọc */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#E6F7F5] rounded-3xl p-6 sm:p-10 flex items-center justify-center shadow-inner overflow-hidden">
                                <img
                                    src={product?.heroImage}
                                    alt={product?.title}
                                    className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                    </div>
                </section>

                {/* ---------------- 3. THÔNG TIN CHI TIẾT ---------------- */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin chi tiết</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                        {/* Cột Trái: Ảnh Banner Mô Tả */}
                        <div className="lg:col-span-6">
                            <div className="bg-[#E6F7F5] rounded-2xl overflow-hidden p-4 shadow-sm">
                                <img
                                    src={product?.detailImage}
                                    alt="Detail Description"
                                    className="w-full h-auto rounded-xl object-cover max-h-[350px]"
                                />
                            </div>
                        </div>

                        {/* Cột Phải: Dịch vụ & Description từ API */}
                        <div className="lg:col-span-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Dịch vụ</h3>
                                <ul className="space-y-1.5 text-sm font-semibold text-gray-800">
                                    {product?.services.map((service, index) => (
                                        <li key={index}>• {service}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-2">
                                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                    {product?.description}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ---------------- 4. CÁC SẢN PHẨM LIÊN QUAN (CAROUSEL 3 CỘT) ---------------- */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold text-[#0B7B7A] text-center mb-10">Các sản phẩm liên quan</h2>

                    <div className="relative px-4 sm:px-8">

                        {/* Nút Qua Trái */}
                        <button
                            onClick={handlePrev}
                            disabled={startIndex === 0}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-100 text-[#33AFA6] hover:bg-[#33AFA6] hover:text-white transition-all ${startIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
                                }`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Grid 3 Cột Sản Phẩm */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProducts.slice(startIndex, startIndex + 3).map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    className="bg-[#E6F7F5] rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300"
                                >
                                    {/* Container Ảnh Sản Phẩm */}
                                    <div className="rounded-xl overflow-hidden mb-4 bg-white">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Thông Tin Thẻ */}
                                    <div className="space-y-2 flex-grow">
                                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                        <p className="text-[#33AFA6] font-semibold text-sm">{item.price}</p>
                                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{item.desc}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {item.tags.map((t, idx) => (
                                                <span key={idx} className="bg-white/80 text-[#33AFA6] text-[11px] font-medium px-2.5 py-1 rounded-full border border-teal-100">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nút Liên Hệ Ngay */}
                                    <div className="pt-4 mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert(`Liên hệ về sản phẩm: ${item.title}`);
                                            }}
                                            className="w-full bg-white text-[#33AFA6] border border-[#33AFA6] hover:bg-[#33AFA6] hover:text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                                        >
                                            <Phone size={14} />
                                            <span>Liên hệ ngay</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Nút Qua Phải */}
                        <button
                            onClick={handleNext}
                            disabled={startIndex + 3 >= relatedProducts.length}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-100 text-[#33AFA6] hover:bg-[#33AFA6] hover:text-white transition-all ${startIndex + 3 >= relatedProducts.length ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
                                }`}
                        >
                            <ChevronRight size={24} />
                        </button>

                    </div>
                </section>

            </main>

            {/* ---------------- 5. FOOTER ---------------- */}
            <footer className="bg-[#04201E] text-white pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start text-xs text-gray-300">
                        {/* Cột 1: Liên hệ */}
                        <div className="space-y-3">
                            <p className="font-bold text-white text-base mb-1">Liên hệ</p>
                            <p className="flex items-center space-x-2 text-sm">
                                <Phone size={15} className="text-white shrink-0" />
                                <span>+84 28 626 4400</span>
                            </p>
                            <p className="flex items-center space-x-2 text-sm">
                                <Mail size={15} className="text-white shrink-0" />
                                <span>hello@geekup.vn</span>
                            </p>
                        </div>

                        {/* Cột 2: Địa chỉ */}
                        <div className="space-y-3 md:col-span-2">
                            <p className="font-bold text-white text-base mb-1">Địa chỉ</p>
                            <div className="flex items-start space-x-2 text-sm">
                                <MapPin size={16} className="text-white mt-0.5 shrink-0" />
                                <p><span className="font-bold text-white">Văn phòng:</span> 244/31 Huỳnh Văn Bánh, Phường Phú Nhuận, TP.HCM</p>
                            </div>
                            <div className="flex items-start space-x-2 text-sm">
                                <MapPin size={16} className="text-white mt-0.5 shrink-0" />
                                <p><span className="font-bold text-white">Chi nhánh:</span> 27B/9 Nguyễn Đình Chiểu, Phường Tân Định, TP.HCM</p>
                            </div>
                        </div>

                        {/* Cột 3 & 4: Nav Links */}
                        <div className="grid grid-cols-2 gap-4 md:col-span-1 text-sm font-medium space-y-0">
                            <div className="space-y-2.5">
                                <button onClick={() => window.location.href = '/'} className="block hover:text-[#33AFA6] transition-colors text-left">Trang chủ</button>
                                <button onClick={() => window.location.href = '/'} className="block hover:text-[#33AFA6] transition-colors text-left">Sản phẩm</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Dịch vụ</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Về GeekUp</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Insights</button>
                            </div>
                            <div className="space-y-2.5">
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Sự kiện</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Tuyển dụng</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left underline">Liên hệ →</button>
                            </div>
                        </div>

                        {/* Cột 5: Social Icons */}
                        <div className="flex md:justify-end items-center space-x-4 pt-2 md:pt-0">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                                <img
                                    src="../src/assets/facebook.svg"
                                    alt="Facebook"
                                    className="w-7 h-7"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z'/%3E%3C/svg%3E";
                                    }}
                                />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                                <img
                                    src="../src/assets/linkedin.svg"
                                    alt="LinkedIn"
                                    className="w-7 h-7"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'/%3E%3C/svg%3E";
                                    }}
                                />
                            </a>
                        </div>
                    </div>

                    <div className="text-center my-8 pt-4">
                        <div className="inline-flex flex-col items-center cursor-pointer" onClick={() => window.location.href = '/'}>
                            <img
                                src="../src/assets/logo-white.svg"
                                alt="GEEK Up"
                                className="h-10 "
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="text-gray-400 text-xs mt-2 tracking-wide font-medium">Trusted Product Partner</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-800/80 w-full mb-6"></div>

                    <p className="text-center text-xs text-gray-400 font-medium">
                        Copyright © | GEEK Up Technology JSC. All Rights Reserved 2021
                    </p>
                </div>
            </footer>

        </div>
    );
}