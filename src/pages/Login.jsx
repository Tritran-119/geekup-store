import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import mailboxSvg from '../assets/mailbox.svg';
import axios from 'axios';
import { Eye, EyeOff, Phone, MapPin } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ account: '', password: '', remember: false });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.account.trim() || !formData.password.trim()) {
            setError('Vui lòng nhập đầy đủ Username/Email và Mật khẩu!');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3001/api/login', {
                username: formData.account,
                password: formData.password,
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            }
        } catch (err) {
            setError('Không thể kết nối đến server API (Mockoon port 3001)!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EDF6F5] flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <div className="w-full max-w-5xl bg-[#EDF6F5] rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">

                {/* CỘT TRÁI: THÔNG TIN THƯƠNG HIỆU & HÌNH FLOATING */}
                <div className="space-y-6 md:pr-6 text-left relative flex flex-col justify-between h-full">
                    <div className="space-y-6">
                        {/* Logo GEEK Up căn trái */}
                        <div className="flex justify-center">
                            <img
                                src={logoSvg}
                                alt="GEEK Up Logo"
                                className="h-10 w-auto object-contain"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            Vui lòng gửi email đến địa chỉ{' '}
                            <a href="mailto:hello@geekup.vn" className="text-[#33AFA6] font-semibold hover:underline">
                                hello@geekup.vn
                            </a>{' '}
                            nếu bạn cần trao đổi thông tin về dự án sản phẩm số.
                        </p>

                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-[#33AFA6] mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-[#0B7B7A]">Số điện thoại</p>
                                    <p className="text-gray-600">+84 28 6262 4400</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-[#33AFA6] mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-[#0B7B7A]">Văn phòng</p>
                                    <p className="text-gray-600">244/31 Huỳnh Văn Bánh, Phường Phú Nhuận, TP.HCM</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-[#33AFA6] mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-[#0B7B7A]">Chi nhánh</p>
                                    <p className="text-gray-600">27B/9 Nguyễn Đình Chiểu, Phường Tân Định, TP.HCM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HÌNH MAILBOX TO BỰ & FLOATING TRÀN LỆCH TRAI DƯỚI */}
                    <div className="pt-6 hidden md:block relative">
                        <img
                            src={mailboxSvg}
                            alt="Mailbox Illustration"
                            className="w-72 lg:w-96 h-auto object-contain -ml-8 -mb-6 transform hover:scale-105 transition-transform duration-300 drop-shadow-md"
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
                <div className="bg-[#EDF6F5] md:pl-6">
                    <h2 className="text-3xl font-bold text-[#33AFA6] text-center mb-8">Đăng nhập</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
                            <input
                                type="text"
                                placeholder="Nhập Username hoặc Email"
                                value={formData.account}
                                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#33AFA6] py-2 px-1 outline-none transition-colors text-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Nhập Mật khẩu"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#33AFA6] py-2 px-1 outline-none transition-colors text-gray-800 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                    className="rounded border-gray-300 text-[#33AFA6] focus:ring-[#33AFA6]"
                                />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#33AFA6] hover:bg-[#0B7B7A] text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => alert('Chức năng Quên mật khẩu đang được phát triển!')}
                                className="text-sm text-[#33AFA6] hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>

                        <div className="text-center text-xs text-gray-400 my-4">Hoặc đăng nhập bằng</div>

                        <button
                            type="button"
                            onClick={() => alert('Tính năng Đăng nhập bằng Google đang được phát triển!')}
                            className="w-full border border-gray-300 hover:bg-white text-gray-700 font-medium py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-colors bg-white/50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Google</span>
                        </button>

                        <p className="text-center text-xs text-gray-500 pt-2">
                            Bạn chưa có tài khoản?{' '}
                            <button
                                type="button"
                                onClick={() => alert('Chức năng Đăng ký đang được phát triển!')}
                                className="text-[#33AFA6] font-semibold hover:underline"
                            >
                                Đăng ký ngay
                            </button>
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}