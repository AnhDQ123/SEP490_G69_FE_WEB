import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CForm, CFormInput, CFormLabel, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import { useLoginMutation } from "../../service/loginService.js";
import * as jwt_decode from 'jwt-decode';
import {BASE_URL} from "../../utils/constant.js";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);  // State để điều khiển modal
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginMutation(); // Hook để gọi mutation
    const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Gọi API đăng nhập và nhận token JWT
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }); // Kiểm tra phản hồi từ API

            // Lưu token vào localStorage
            const textToken = await response.text();
            console.log(textToken);
            localStorage.setItem('token', textToken);  // Lưu JWT token vào localStorage

            // Giải mã JWT để lấy thông tin payload
            const decodedToken = jwt_decode.jwtDecode(textToken);  // Giải mã token
            console.log(decodedToken);  // In payload của JWT để kiểm tra thông tin
            localStorage.setItem('userId', decodedToken.userId);

            // Kiểm tra vai trò người dùng từ token
            if (decodedToken.status && decodedToken.status.toUpperCase() === 'INACTIVE') {
                localStorage.removeItem('token');
                setErrorModal({
                    visible: true,
                    message: 'Tài khoản người dùng đã bị chặn. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.'
                });
                setTimeout(() => {
                    setErrorModal({ visible: false, message: '' });
                }, 2000);
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
            setLoginError('Số điện thoại hoặc mật khẩu không đúng.');
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
                                            onChange={(e) =>{
                                                setUsername(e.target.value);
                                                setLoginError('');
                                            }}
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
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setLoginError('');
                                            }}
                                            required
                                        />
                                        {loginError && (
                                            <div style={{ color: 'red', marginTop: '4px', fontSize: '0.9rem' }}>
                                                {loginError}
                                            </div>
                                        )}
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
