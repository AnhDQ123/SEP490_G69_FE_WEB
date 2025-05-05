import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CButton, CForm, CFormInput, CFormLabel, CContainer, CRow, CCol, CCard, CCardBody,
    CCardHeader, CCardFooter, CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/react';
import { useLoginMutation } from '../../service/loginService.js';
import * as jwt_decode from 'jwt-decode';
import { BASE_URL } from '../../utils/constant.js';
import '../../scss/login.scss';
import logo from '../../assets/logo.jpg';
import backgroundImage from '../../assets/bgr.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const textToken = await response.text();
            localStorage.setItem('token', textToken);

            const decodedToken = jwt_decode.jwtDecode(textToken);
            localStorage.setItem('userId', decodedToken.userId);


            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                setErrorModal({
                    visible: true,
                    message: 'Token đã hết hạn. Vui lòng đăng nhập lại!',
                });
                setTimeout(() => setErrorModal({ visible: false, message: '' }), 2000);
                return;
            }

            setShowModal(true);
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (err) {
            console.error('Login error:', err);
            setLoginError('Số điện thoại hoặc mật khẩu không đúng.');
        }
    };

    return (
        <div
            className="login-page"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                padding: 0,
                overflow: 'hidden',
            }}
        >
            {/* Login form nằm bên trái */}
            <div style={{
                flex: '0 0 750px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '1rem',
                marginLeft: '5%',
            }}>
                <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                    <CCard className="border-0 bg-transparent" style={{ textAlign: 'left' }}>
                        <CCardHeader className="text-center bg-transparent border-0">
                            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                                <img src={logo} alt="Logo" width="80" />
                                <h2 style={{ fontWeight: 'bold', color: '#e63946', margin: 0 }}>FastF&B Đăng Nhập</h2>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
                                    <CFormInput
                                        type="tel"
                                        id="phone"
                                        placeholder="Nhập số điện thoại"
                                        value={username}
                                        onChange={(e) => {
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
                                        <div className="text-danger small mt-1">{loginError}</div>
                                    )}
                                </div>
                                <div className="text-center mb-3">
                                    <CButton type="submit" color="danger" style={{ width: '100%' }} disabled={isLoading}>
                                        Đăng nhập
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                        <CCardFooter className="text-center bg-transparent border-0">
                            <a href="/forgot-password" style={{ color: '#1d3557', textDecoration: 'none' }}>
                                Quên mật khẩu?
                            </a>
                        </CCardFooter>
                    </CCard>
                </div>
            </div>

            {/* Cột trống bên phải */}
            <div style={{ flex: 1 }} />

            {/* Modals giữ nguyên như trước */}
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader><h5>Thông báo</h5></CModalHeader>
                <CModalBody>
                    <p>Đăng nhập thành công! Chúc mừng bạn đã đăng nhập.</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={errorModal.visible} onClose={() => setErrorModal({visible: false, message: ''})}>
                <CModalHeader><h5>Lỗi đăng nhập</h5></CModalHeader>
                <CModalBody>
                    <p>{errorModal.message}</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary"
                             onClick={() => setErrorModal({visible: false, message: ''})}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Login;
