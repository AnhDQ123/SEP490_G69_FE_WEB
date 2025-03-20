import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CImage
} from '@coreui/react';
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../service/userService.js";

const ShipperActive = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetUserByIdQuery(id);
    const [updateUser] = useUpdateUserMutation();

    const [shipper, setShipper] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');

    useEffect(() => {
        if (data) {
            setShipper(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi khi lấy dữ liệu shipper</p>;
    if (!shipper) return <p>Không tìm thấy thông tin shipper</p>;

    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        setShowConfirmModal(true);
    };

    const handleConfirmUpdateStatus = async () => {
        try {
            await updateUser({ id, status: confirmStatus }).unwrap();
            setShipper({ ...shipper, status: confirmStatus });
            alert(`Trạng thái shipper cập nhật thành công: ${confirmStatus}`);
            navigate('/shipper-list');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách shipper {'>'} Thông tin shipper</h4>
                <CRow className="mb-3">
                    <CCol md={6}><label>Tài khoản</label><CFormInput disabled value={shipper.username} /></CCol>
                    <CCol md={6}><label>Tên shipper</label><CFormInput disabled value={shipper.name} /></CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}><label>Số điện thoại</label><CFormInput disabled value={shipper.phone} /></CCol>
                    <CCol md={6}><label>Email</label><CFormInput disabled value={shipper.email} /></CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}><label>Ngày sinh</label><CFormInput disabled value={shipper.birthDate} /></CCol>
                    <CCol md={6}><label>Ngày đăng ký</label><CFormInput disabled value={shipper.registrationDate} /></CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}><label>Trạng thái</label><CFormInput disabled value={shipper.status} /></CCol>
                </CRow>
                <CRow>
                    <CCol md={6}><label>Ảnh CMND/CCCD</label><CImage src={shipper.citizenIDCardFront} alt="Ảnh mặt trước" width={200} /></CCol>
                    <CCol md={6}><CImage src={shipper.citizenIDCardBack} alt="Ảnh mặt sau" width={200} /></CCol>
                </CRow>
                <CRow className="mb-3 mt-3">
                    <CCol md={6}><label>Giấy phép lái xe</label><CImage src={shipper.licenseFront} alt="Mặt trước" width={200} /></CCol>
                    <CCol md={6}><CImage src={shipper.licenseBack} alt="Mặt sau" width={200} /></CCol>
                </CRow>
                <CRow className="text-center mt-4">
                    <CCol md={4}><CButton color="danger" className="w-100" onClick={() => handleOpenConfirmModal('INACTIVE')}>Chặn người dùng</CButton></CCol>
                    <CCol md={4}><CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>Quay lại</CButton></CCol>
                </CRow>
            </CCardBody>
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Xác nhận</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {confirmStatus === 'INACTIVE' ? 'Bạn có chắc chắn muốn chặn shipper này?' : 'Bạn có chắc chắn muốn cập nhật trạng thái này?'}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleConfirmUpdateStatus}>
                        Chặn
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShipperActive;
