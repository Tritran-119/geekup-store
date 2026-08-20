import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoSvg from '../assets/logo.svg';
import logoWhiteSvg from '../assets/logo-white.svg';
import {
    Search, PhoneCall, Filter, Grid, List, ChevronDown,
    MapPin, Phone, Mail, LogOut, User, ArrowUp, MessageCircle, X
} from 'lucide-react';

const TAG_LIST = [
    'Agriculture', 'Finance', 'Food & Beverage',
    'Hospitality', 'Media', 'StartUp', 'Transportation', 'Wealth Management'
];

export default function ProductList() {
    const navigate = useNavigate();
    const location = useLocation(); 

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) { }
        }

        if (location.state?.searchKeyword) {
            setSearchTerm(location.state.searchKeyword);
        }

        fetchProducts();
    }, [location.state]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3001/api/product');
            if (Array.isArray(res.data)) {
                setProducts(res.data);
                setFilteredProducts(res.data);
            }
        } catch (err) {
            const unsplashImages = [
                "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop", // Finance / Wealth
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop", // Trading / Stock
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop", // Health Care
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", // Tech / Business
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop", // Teamwork
                "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop"  // Mobile App
            ];

            const dummyProducts = Array.from({ length: 32 }, (_, i) => ({
                id: `kafi-${i}`,
                name: i % 3 === 0 ? "Kafi Wealth" : i % 3 === 1 ? `Kafi Care Health ${i}` : `GEEK Solution ${i + 1}`,
                subtitle: "Giải pháp ứng dụng công nghệ hàng đầu tiên phong cho doanh nghiệp số",
                service: ["UX Research", "Product Concept"],
                description: "Đơn vị tiên phong tại Việt Nam trong triển khai giải pháp chuyển đổi số.",
                price: "Giá thỏa thuận",
                tags: i % 3 === 0 ? ["Finance", "Wealth Management"] : i % 3 === 1 ? ["HealthCare", "Mobile App"] : ["Agriculture", "StartUp"],
                image: unsplashImages[i % unsplashImages.length] // 🎯 Thay ảnh DiceBear bằng ảnh Unsplash sinh động
            }));

            setProducts(dummyProducts);
            setFilteredProducts(dummyProducts);
        } finally {
            setLoading(false);
        }
    };

    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleClearTags = () => {
        setSelectedTags([]);
    };

    useEffect(() => {
        let result = products;

        if (selectedTags.length > 0) {
            result = result.filter(p =>
                p.tags && p.tags.some(tag => selectedTags.includes(tag))
            );
        }

        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.subtitle?.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(result);
        setVisibleCount(8);
    }, [selectedTags, searchTerm, products]);

    const scrollToProducts = () => {
        document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">

            {/* HEADER */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-6">
                        <img
                            src={logoSvg}
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
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#33AFA6] font-semibold hover:opacity-80 transition-opacity"
                        >
                            Sản phẩm
                        </button>
                        <button
                            onClick={() => alert('Tính năng Dịch vụ đang được phát triển!')}
                            className="hover:text-[#33AFA6] transition-colors"
                        >
                            Dịch vụ
                        </button>
                        <button
                            onClick={() => alert('Tính năng Về GeekUp đang được phát triển!')}
                            className="hover:text-[#33AFA6] transition-colors"
                        >
                            Về GeekUp
                        </button>
                        <button
                            onClick={() => alert('Tính năng Liên hệ đang được phát triển!')}
                            className="hover:text-[#33AFA6] transition-colors"
                        >
                            Liên hệ
                        </button>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                                    alt="User Avatar"
                                    className="w-9 h-9 rounded-full border-2 border-[#33AFA6] bg-[#E6F7F5] object-cover shadow-sm"
                                />
                                <span className="text-sm font-semibold text-[#0B7B7A] hidden sm:inline">
                                    Hi, {user.name || 'User'}
                                </span>
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

            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-5xl font-medium text-gray-900 leading-tight">
                            Các sản phẩm của <span className="text-[#33AFA6]">GeekUp</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">Trusted Product Partner</p>

                        <button
                            onClick={scrollToProducts}
                            className="mt-4 px-6 py-3 bg-[#33AFA6] hover:bg-[#0B7B7A] text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                            <span>Xem Ngay</span>
                            <span>→</span>
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <img
                            src="../src/assets/our-services.webp"
                            alt="GeekUp Banner"
                            className="w-full max-h-80 md:max-h-96 object-cover shadow-sm"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80";
                            }}
                        />
                    </div>

                </div>
            </section>

            {/* BỘ LỌC MULTI-SELECT */}
            <section id="product-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-[#0B7B7A] font-semibold text-lg">
                        <Filter size={20} />
                        <span>Bộ lọc</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                        <button className="p-1.5 rounded bg-gray-100 text-[#33AFA6]"><Grid size={18} /></button>
                        <button className="p-1.5 rounded hover:bg-gray-100"><List size={18} /></button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5 items-center">
                    <button
                        onClick={handleClearTags}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedTags.length === 0
                            ? 'bg-[#33AFA6] text-white border-[#33AFA6] shadow-sm'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#33AFA6]'
                            }`}
                    >
                        Tất cả
                    </button>

                    {TAG_LIST.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${isSelected
                                    ? 'bg-[#33AFA6] text-white border-[#33AFA6] shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#33AFA6] hover:text-[#33AFA6]'
                                    }`}
                            >
                                {tag} {isSelected && '✓'}
                            </button>
                        );
                    })}

                    {selectedTags.length > 0 && (
                        <button
                            onClick={handleClearTags}
                            className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium ml-2"
                        >
                            <X size={14} /> Xóa bộ lọc ({selectedTags.length})
                        </button>
                    )}
                </div>
            </section>

            {/* DANH SÁCH SẢN PHẨM */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Đang tải sản phẩm...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        Không tìm thấy sản phẩm nào phù hợp với bộ lọc!
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.slice(0, visibleCount).map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="bg-[#DDF0ED] h-52 flex items-center justify-center relative overflow-hidden">
                                            <img
                                                src={product.image || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop"}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop";
                                                }}
                                            />
                                        </div>

                                        <div className="p-5 space-y-2">
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#33AFA6] transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs font-semibold text-[#33AFA6]">
                                                $ {product.price || "Giá thỏa thuận"}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {product.subtitle || product.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 pt-2">
                                                {product.tags && product.tags.map((t, idx) => (
                                                    <span key={idx} className="bg-[#EDF6F5] text-[#0B7B7A] text-[10px] font-semibold px-2 py-0.5 rounded">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 pt-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!user) {
                                                    navigate('/login');
                                                } else {
                                                    alert('Chức năng liên hệ đang được phát triển!');
                                                }
                                            }}
                                            className="w-full border border-[#33AFA6] text-[#33AFA6] hover:bg-[#33AFA6] hover:text-white font-medium py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                                        >
                                            <PhoneCall size={14} />
                                            <span>Liên hệ ngay</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleCount < filteredProducts.length && (
                            <div className="text-center mt-12 mb-8">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 8)}
                                    className="px-8 py-3 border border-[#33AFA6] text-[#33AFA6] hover:bg-[#33AFA6] hover:text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center space-x-2 mx-auto"
                                >
                                    <span>Xem thêm sản phẩm</span>
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

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

                        <div className="flex md:justify-end items-center space-x-4 pt-2 md:pt-0">
                            <a href="https://www.facebook.com/GEEKUpVN" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
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
                            <a href="https://www.linkedin.com/company/geekupvn" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
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
                                src={logoWhiteSvg}
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

            <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-3 bg-[#33AFA6] text-white rounded-full shadow-lg hover:bg-[#0B7B7A] transition-all"
                >
                    <ArrowUp size={18} />
                </button>
                <button className="p-3 bg-[#0B7B7A] text-white rounded-full shadow-lg hover:bg-[#33AFA6] transition-all">
                    <MessageCircle size={18} />
                </button>
            </div>

        </div>
    );
}