import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CForm, CFormInput, CFormLabel, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import { useLoginMutation } from "../../service/loginService.js";
import * as jwt_decode from 'jwt-decode';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);  // State để điều khiển modal
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginMutation(); // Hook để gọi mutation

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Gọi API đăng nhập và nhận token JWT
            const response = await fetch(`http://localhost:8080/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }); // Kiểm tra phản hồi từ API

            // Kiểm tra nếu token được trả về không phải null hoặc undefined
            if (!response.ok) {
                alert('Không thể đăng nhập. Vui lòng thử lại!');
                return;
            }

            // Lưu token vào localStorage
            const textToken = await response.text();
            console.log(textToken);
            localStorage.setItem('token', textToken);  // Lưu JWT token vào localStorage

            // Giải mã JWT để lấy thông tin payload
            const decodedToken = jwt_decode.jwtDecode(textToken);  // Giải mã token
            console.log(decodedToken);  // In payload của JWT để kiểm tra thông tin
            localStorage.setItem('userId', decodedToken.userId);

            // Kiểm tra vai trò người dùng từ token
            if (decodedToken.role && decodedToken.role.toLowerCase() !== 'operator') {
                alert('Bạn không có quyền đăng nhập! Chỉ người dùng có vai trò Operator mới có thể đăng nhập.');
                return;
            }

            // Kiểm tra thời gian hết hạn của token
            const currentTime = Date.now() / 1000;  // Lấy thời gian hiện tại (giây)
            if (decodedToken.exp < currentTime) {
                alert('Token đã hết hạn. Vui lòng đăng nhập lại!');
                localStorage.removeItem('token');  // Xóa token hết hạn
                return;
            }

            // Hiển thị modal thông báo đăng nhập thành công
            setShowModal(true);

            // Điều hướng đến trang dashboard
            setTimeout(() => {
                navigate('/dashboard');  // Điều hướng đến trang dashboard sau 2 giây
            }, 2000);

        } catch (err) {
            console.error("Login error:", err);
            alert('Đăng nhập thất bại! Vui lòng kiểm tra lại số điện thoại và mật khẩu.');
        }
    };

    return (
        <div className="login-page" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <CCard>
                            <CCardHeader className="text-center"><h2>Đăng Nhập</h2></CCardHeader>
                            <CCardBody>
                                <CForm onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
                                        <CFormInput
                                            type="tel"
                                            id="phone"
                                            placeholder="Nhập số điện thoại"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="password">Mật khẩu</CFormLabel>
                                        <CFormInput
                                            type="password"
                                            id="password"
                                            placeholder="Nhập mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 text-center">
                                        <CButton type="submit" color="primary" disabled={isLoading}>Đăng nhập</CButton>
                                    </div>
                                </CForm>
                            </CCardBody>
                            <CCardFooter className="text-center">
                                <a href="/forgot-password">Quên mật khẩu?</a>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>

            {/* Modal thông báo đăng nhập thành công */}
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader><h5>Thông báo</h5></CModalHeader>
                <CModalBody>
                    <p>Đăng nhập thành công! Chúc mừng bạn đã đăng nhập.</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Login;
