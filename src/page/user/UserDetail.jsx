import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CFormSelect,
    CButton,
    CImage,
} from '@coreui/react';
import { useGetUserByIdQuery } from '../../service/userService.js';

const UserDetail = () => {
    const [user, setUser] = useState({});
    const { id } = useParams(); // Lấy id người dùng từ URL
    const navigate = useNavigate();

    // Gọi API để lấy thông tin người dùng theo id
    const { data, error, isLoading } = useGetUserByIdQuery(id);

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi khi lấy dữ liệu người dùng</p>;

    return (
        <CCard className="p-4 shadow-lg">
            <CCardBody>
                <CRow className="mb-3 d-flex align-items-center">
                    <CCol md={8}>
                        <h4 className="fw-bold">📌 Danh sách tài khoản {'>'} Người dùng</h4>
                    </CCol>
                    <CCol md={4} className="text-end">
                        <CImage
                            src={user.avatar}
                            className="border rounded-circle shadow-sm"
                            width={100}
                            height={100}
                            alt="Avatar"
                        />
                    </CCol>
                </CRow>

                {/* Hàng đầu tiên: Họ tên & Vai trò */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">Họ Tên</label>
                        <CFormInput disabled value={user.name || ''} className="border rounded-2" />
                    </CCol>
                    <CCol md={6}>
                        <label className="fw-semibold">Vai trò</label>
                        <CFormInput disabled value={user.role} className="border rounded-2"/>
                    </CCol>
                </CRow>

                {/* Hàng thứ hai: Số điện thoại & Địa chỉ */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">SĐT</label>
                        <CFormInput disabled value={user.phone || ''} className="border rounded-2" />
                    </CCol>
                    <CCol md={6}>
                        <label className="fw-semibold">Địa chỉ</label>
                        <CFormInput disabled value={user.address || ''} className="border rounded-2" />
                    </CCol>
                </CRow>

                {/* createdAt */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">Ngày tham gia</label>
                        <CFormInput disabled value={user.createdAt || ''} className="border rounded-2" />
                    </CCol>
                </CRow>

                {/* change status */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">Trạng thái</label>
                        <CFormSelect value={user.status} className="border rounded-2">
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Tạm dừng</option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                {/* Nút chức năng */}
                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton color="danger" className="w-100 rounded-3 py-2 fw-semibold">
                            🚨 Gửi cảnh báo
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100 rounded-3 py-2 fw-semibold" onClick={() => navigate(-1)}>
                            ⬅️ Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="success" className="w-100 rounded-3 py-2 fw-semibold">
                            💾 Lưu
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

export default UserDetail;
