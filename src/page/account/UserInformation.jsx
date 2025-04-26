import React, { useEffect, useState } from 'react';
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery } from "../../service/userService.js";

const UserInformation = () => {
    const userId = localStorage.getItem('userId');  // Lấy userId từ localStorage
    const navigate = useNavigate();
    const { data: userInfo, isLoading, isError } = useGetUserByIdQuery(userId);  // Truyền userId vào API query

    // Kiểm tra nếu userId không tồn tại, tránh lỗi
    if (!userId) {
        return <p>Không tìm thấy thông tin người dùng.</p>;
    }

    // Sử dụng useGetUserByIdQuery để lấy dữ liệu người dùng

    const renderRoleBadge = (role) => {
        switch (role.toLowerCase()) {
            case 'operator':
                return <CBadge color="info">Operator</CBadge>;
            case 'admin':
                return <CBadge color="danger">Admin</CBadge>;
            default:
                return <CBadge color="secondary">{role}</CBadge>;
        }
    };

    // Hiển thị thông báo khi dữ liệu đang tải hoặc có lỗi
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Thông tin người dùng</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Họ tên:</strong></CCol>
                            <CCol>{userInfo?.fullName}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Email:</strong></CCol>
                            <CCol>{userInfo?.email}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Số điện thoại:</strong></CCol>
                            <CCol>{userInfo?.phone}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Tên đăng nhập:</strong></CCol>
                            <CCol>{userInfo?.username}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Địa chỉ:</strong></CCol>
                            <CCol>{userInfo?.address}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Vai trò:</strong></CCol>
                            <CCol>{renderRoleBadge(userInfo?.role)}</CCol>
                        </CRow>

                        {/* Mật khẩu và nút Thay đổi */}
                        <CRow className="align-items-center">
                            <CCol md={3}><strong>Mật khẩu:</strong></CCol>
                            <CCol className="d-flex justify-content-between align-items-center">
                                <span>••••••••</span>
                                <CButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => navigate('/change-password')}
                                >
                                    Thay đổi
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default UserInformation;
