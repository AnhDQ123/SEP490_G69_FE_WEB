import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CButton,
    CForm,
    CFormInput,
    CFormLabel,
    CFormCheck,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter
} from '@coreui/react';
import {useLoginMutation} from "../../service/loginService.js";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginMutation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password }).unwrap();

            if (!response || !response.role) {
                alert('Không thể xác định vai trò người dùng. Vui lòng thử lại!');
                return;
            }

            if (response.role.toLowerCase() !== 'operator') {
                alert('Bạn không có quyền đăng nhập! Chỉ người dùng có vai trò Operator mới có thể đăng nhập.');
                return;
            }

            alert('Đăng nhập thành công!');
            navigate('/dashboard');
        } catch (err) {
            alert('Đăng nhập thất bại! Vui lòng kiểm tra lại email và mật khẩu.');
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
                                        <CFormLabel htmlFor="email">Email</CFormLabel>
                                        <CFormInput
                                            type="email"
                                            id="email"
                                            placeholder="Nhập email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                    <div className="mb-3">
                                        <CFormCheck
                                            id="rememberMe"
                                            label="Ghi nhớ tài khoản"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
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
        </div>
    );
};

export default Login;