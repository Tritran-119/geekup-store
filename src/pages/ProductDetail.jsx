import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, LogOut, User, Phone, Mail, MapPin, ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import logoWhiteSvg from '../assets/logo-white.svg';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Mặc định user là null (chỉ lấy dữ liệu khi có trong localStorage)
    const [user, setUser] = useState(null);

    const unsplashCollection = [
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000&auto=format&fit=crop", // Finance / Wealth
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop", // Stock / Trading
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop", // Health Care App
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", // Business Tech
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"  // Team Project
    ];

    const formatProduct = (item) => {
        const fullName = item.name || item.title || 'Kafi Wealth';

        return {
            id: item.id || id,
            fullName: fullName,
            subtitle: item.subtitle || item.description || 'Giải pháp sản phẩm số tiên phong.',
            visitLink: item.visitLink || 'https://geekup.vn',
            hashtags: item.tags ? item.tags.map(t => `#${t.toUpperCase().replace(/\s+/g, '_')}`) : ['#GEEKUP', '#DIGITAL_INNOVATION'],
            heroImage: item.image || unsplashCollection[0],
            detailImage: unsplashCollection[3],
            services: item.service || ['UX Research', 'Product Concept', 'UX Ideation'],
            description: item.description || item.subtitle || 'Dữ liệu mô tả sản phẩm chi tiết đang được cập nhật từ hệ thống GEEK Up.'
        };
    };

    const relatedProducts = [
        {
            id: 'kafi-0',
            title: 'Kafi Wealth',
            price: '$ Giá thỏa thuận',
            desc: 'Giải pháp Quản lý gia sản và đầu tư thông minh...',
            tags: ['Finance', 'Wealth Management'],
            image: unsplashCollection[0]
        },
        {
            id: 'geekup-health',
            title: 'GeekUp HealthCare',
            price: '$ Giá thỏa thuận',
            desc: 'Nền tảng theo dõi sức khỏe và chăm sóc y tế từ xa...',
            tags: ['HealthCare', 'Mobile App'],
            image: unsplashCollection[2]
        },
        {
            id: 'fintech-wallet',
            title: 'Fintech E-Wallet',
            price: '$ Giá thỏa thuận',
            desc: 'Ví điện tử thông minh hỗ trợ thanh toán siêu tốc...',
            tags: ['Fintech', 'Mobile App'],
            image: unsplashCollection[1]
        }
    ];

    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        // Đọc thông tin User thực tế từ localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) { }
        } else {
            setUser(null);
        }

        fetchProductDetail();
    }, [id]);


    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3001/api/product/${id}`);
            if (res.data) {
                setProduct(formatProduct(res.data));
                return;
            }
        } catch (err) {
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

            const isKafi = String(id).toLowerCase().includes('kafi');
            setProduct(formatProduct({
                id: id,
                name: isKafi ? "Kafi Wealth" : `GEEK Project ${id}`,
                subtitle: isKafi
                    ? "Chứng Khoán Kafi Tiên Phong Xây dựng Giải Pháp Quản Lý Gia Sản (Wealth Management) Thông Minh Và An Toàn"
                    : `Giải pháp chuyển đổi số toàn diện dành riêng cho dự án mã ${id}`,
                description: isKafi
                    ? "Chứng khoán Kafi là một trong những đơn vị tiên phong tại Việt Nam trong lĩnh vực Quản lý Gia sản (Wealth Management), tận dụng hệ sinh thái công nghệ số để kiến tạo những giải pháp tài chính toàn diện. Với sự đồng hành từ GEEK Up, Kafi đã xây dựng thành công hệ sinh thái tài chính tích hợp, bao gồm Kafi Wealth - nền tảng quản lý tài sản và đầu tư, cùng với Kafi Trade - dịch vụ cho vay ký quỹ đầu tư chứng khoán."
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
    };

    const handleContact = (productTitle) => {
        if (!user) {
            navigate('/login');
        } else {
            alert('Chức năng liên hệ đang được phát triển!');
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            navigate('/', { state: { searchKeyword: searchTerm.trim() } });
        }
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

            {/* HEADER */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-6">
                        <img
                            src={logoSvg}
                            alt="GEEK Up"
                            className="h-9 cursor-pointer"
                            onClick={() => navigate('/')}
                        />
                        <div className="relative hidden md:block w-72">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown} //Bắt sự kiện ấn Enter
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
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                                    alt="User Avatar"
                                    className="w-9 h-9 rounded-full border-2 border-[#33AFA6] bg-[#E6F7F5] object-cover shadow-sm"
                                />
                                <span className="text-sm font-semibold text-[#0B7B7A] hidden sm:inline">Hi, {user.name || 'User'}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-xs text-red-500 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
                {/* HERO SECTION */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-4">

                            {/* Title & Nút Xem App */}
                            <div className="flex items-baseline justify-between gap-4 border-b border-transparent">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                                    {product?.fullName}
                                </h1>

                                <a
                                    href={product?.visitLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-[#33AFA6] underline underline-offset-4 shrink-0 transition-colors"
                                >
                                    <span>Xem App</span>
                                    <ExternalLink size={15} />
                                </a>
                            </div>

                            {/* Mô tả ngắn (Subtitle) */}
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                                {product?.subtitle}
                            </p>

                            {/* Nút Liên hệ */}
                            <div>
                                <button
                                    onClick={() => handleContact(product?.title)}
                                    className="inline-flex items-center space-x-2 bg-[#33AFA6] hover:bg-[#2b968f] text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all"
                                >
                                    <span>Liên hệ</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>

                            {/* Hashtags */}
                            <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-[#33AFA6]">
                                {product?.hashtags.map((tag, idx) => (
                                    <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Banner Ảnh bên phải */}
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

                {/* THÔNG TIN CHI TIẾT */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h2 className="text-2xl font-bold text-[#0B7B7A] mb-6">Thông tin chi tiết</h2>

                    {/* Dịch vụ */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start mb-8">
                        <div className="md:col-span-6">
                            <h3 className="text-lg font-bold text-gray-900">Dịch vụ</h3>
                        </div>
                        <div className="md:col-span-6 space-y-1.5 text-sm font-semibold text-gray-800">
                            {product?.services.map((service, index) => (
                                <div key={index}>{service}</div>
                            ))}
                        </div>
                    </div>

                    {/* Ảnh + Mô tả */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-6">
                            <div className="rounded-xl overflow-hidden shadow-sm">
                                <img
                                    src={product?.detailImage}
                                    alt="Detail Banner"
                                    className="w-full h-auto max-h-[380px] object-cover rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-6">
                            <p className="text-gray-800 text-sm md:text-base leading-relaxed text-justify font-normal">
                                {product?.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SẢN PHẨM LIÊN QUAN */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold text-[#0B7B7A] text-center mb-10">Các sản phẩm liên quan</h2>

                    <div className="relative px-4 sm:px-8">
                        <button
                            onClick={handlePrev}
                            disabled={startIndex === 0}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-100 text-[#33AFA6] hover:bg-[#33AFA6] hover:text-white transition-all ${startIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProducts.slice(startIndex, startIndex + 3).map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    className="bg-[#E6F7F5] rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300"
                                >
                                    <div className="rounded-xl overflow-hidden mb-4 bg-white">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="space-y-2 flex-grow">
                                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                        <p className="text-[#33AFA6] font-semibold text-sm">{item.price}</p>
                                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{item.desc}</p>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {item.tags.map((t, idx) => (
                                                <span key={idx} className="bg-white/80 text-[#33AFA6] text-[11px] font-medium px-2.5 py-1 rounded-full border border-teal-100">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContact(item.title);
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

                        <button
                            onClick={handleNext}
                            disabled={startIndex + 3 >= relatedProducts.length}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-100 text-[#33AFA6] hover:bg-[#33AFA6] hover:text-white transition-all ${startIndex + 3 >= relatedProducts.length ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-[#04201E] text-white pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start text-xs text-gray-300">
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

                        <div className="grid grid-cols-2 gap-4 md:col-span-1 text-sm font-medium space-y-0">
                            <div className="space-y-2.5">
                                <button onClick={() => navigate('/')} className="block hover:text-[#33AFA6] transition-colors text-left">Trang chủ</button>
                                <button onClick={() => navigate('/')} className="block hover:text-[#33AFA6] transition-colors text-left">Sản phẩm</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Dịch vụ</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Về GeekUp</button>
                            </div>
                            <div className="space-y-2.5">
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Sự kiện</button>
                                <button onClick={() => alert('Tính năng đang phát triển!')} className="block hover:text-[#33AFA6] transition-colors text-left">Tuyển dụng</button>
                            </div>
                        </div>

                        <div className="flex md:justify-end items-center space-x-4 pt-2 md:pt-0">
                            <a href="https://www.facebook.com/GEEKUpVN" target="_blank" rel="noreferrer" aria-label="Facebook">
                                <svg className="w-6 h-6 fill-current text-white hover:text-[#33AFA6] transition-colors" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/geekupvn" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <svg className="w-6 h-6 fill-current text-white hover:text-[#33AFA6] transition-colors" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="text-center my-8 pt-4">
                        <div className="inline-flex flex-col items-center cursor-pointer" onClick={() => navigate('/')}>
                            <img src={logoWhiteSvg} alt="GEEK Up" className="h-10" />
                            <span className="text-gray-400 text-xs mt-2 tracking-wide font-medium">Trusted Product Partner</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-800/80 w-full mb-6"></div>

                    <p className="text-center text-xs text-gray-400 font-medium">
                        Copyright © | GEEK Up Technology JSC. All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}