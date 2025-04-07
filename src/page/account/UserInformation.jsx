import React from 'react'
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const UserInformation = () => {
    const navigate = useNavigate()

    // Dữ liệu mẫu fix cứng dành cho operator
    const userInfo = {
        fullName: 'Trần Thị B',
        email: 'tranthib.operator@example.com',
        phone: '0912345678',
        username: 'operator.b',
        address: '456 Đường XYZ, Quận 3, TP.HCM',
        role: 'Operator',
    }

    const renderRoleBadge = (role) => {
        switch (role.toLowerCase()) {
            case 'operator':
                return <CBadge color="info">Operator</CBadge>
            case 'admin':
                return <CBadge color="danger">Admin</CBadge>
            default:
                return <CBadge color="secondary">{role}</CBadge>
        }
    }

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
                            <CCol>{userInfo.fullName}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Email:</strong></CCol>
                            <CCol>{userInfo.email}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Số điện thoại:</strong></CCol>
                            <CCol>{userInfo.phone}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Tên đăng nhập:</strong></CCol>
                            <CCol>{userInfo.username}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Địa chỉ:</strong></CCol>
                            <CCol>{userInfo.address}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={3}><strong>Vai trò:</strong></CCol>
                            <CCol>{renderRoleBadge(userInfo.role)}</CCol>
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
    )
}

export default UserInformation
