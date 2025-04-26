import React, { useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormFeedback,
    CRow,
    CAlert,
} from '@coreui/react';
import { useChangePasswordMutation } from '../../service/userService';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Use the changePassword mutation from your usersService
    const [changePassword, { isLoading, isError, error: apiError, isSuccess }] = useChangePasswordMutation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Validation function for the new password
    const validateNewPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setError('');
        setSuccess(false);

        const { currentPassword, newPassword, confirmNewPassword } = formData;

        // Kiểm tra xem người dùng đã nhập đủ các trường
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Kiểm tra mật khẩu mới có đúng yêu cầu không
        if (!validateNewPassword(newPassword)) {
            setError('Mật khẩu mới phải có ít nhất 8 ký tự, chứa ít nhất một ký tự in hoa, một chữ số và một ký tự đặc biệt.');
            return;
        }

        // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp không
        if (newPassword !== confirmNewPassword) {
            setError('Mật khẩu không khớp.');
            return;
        }

        try {
            // Lấy userId từ localStorage
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Không tìm thấy thông tin người dùng.');
                return;
            }

            // Call the changePassword mutation with the necessary parameters
            await changePassword({
                id: userId,  // Sử dụng userId lấy từ localStorage
                oldPassword: currentPassword,
                newPassword,
                confirmPassword: confirmNewPassword,
            }).unwrap();

            // On success
            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (err) {
            // Handle any error that occurs during the mutation
            setError(apiError?.data?.message || 'Đã có lỗi xảy ra.');
        } finally {
            setSubmitted(false);
        }
    };

    return (
        <CRow>
            <CCol xs={12} md={6} className="mx-auto">
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Đổi mật khẩu</strong>
                    </CCardHeader>
                    <CCardBody>
                        {error && <CAlert color="danger">{error}</CAlert>}
                        {success && <CAlert color="success">Đổi mật khẩu thành công!</CAlert>}
                        <CForm onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="currentPassword">Mật khẩu hiện tại</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    invalid={submitted && !formData.currentPassword}
                                />
                                <CFormFeedback invalid>Bắt buộc</CFormFeedback>
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="newPassword">Mật khẩu mới</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    invalid={submitted && !formData.newPassword}
                                />
                                <CFormFeedback invalid>Bắt buộc</CFormFeedback>
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    invalid={submitted && !formData.confirmNewPassword}
                                />
                                <CFormFeedback invalid>Bắt buộc</CFormFeedback>
                            </div>

                            <CButton type="submit" color="primary" disabled={isLoading}>
                                {isLoading ? 'Đang thay đổi...' : 'Lưu thay đổi'}
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ChangePassword;
