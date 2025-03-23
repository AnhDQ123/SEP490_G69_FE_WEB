import React, { useState } from 'react';
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
    CImage,
} from '@coreui/react';
import {
    useGetShipperByIdQuery,
    useApproveShipperMutation,
    useRejectShipperMutation,
} from '../../service/shipperService';

const ShipperPending = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: shipper, error, isLoading } = useGetShipperByIdQuery(id);
    const [approveShipper] = useApproveShipperMutation();
    const [rejectShipper] = useRejectShipperMutation();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');

    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        setShowConfirmModal(true);
    };

    const handleConfirmUpdateStatus = async () => {
        try {
            if (confirmStatus === 'ACTIVE') {
                await approveShipper(id).unwrap();
                alert('✅ Duyệt thành công!');
            } else {
                await rejectShipper({ userId: id, reason: 'Từ chối bởi admin' }).unwrap();
                alert('❌ Đã từ chối shipper!');
            }
            navigate('/shipper-list');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setShowConfirmModal(false);
        }
    };

    if (isLoading) return <p>🔄 Đang tải dữ liệu shipper...</p>;
    if (error) return <p>❌ Lỗi khi lấy dữ liệu shipper</p>;
    if (!shipper) return <p>⚠️ Không tìm thấy thông tin shipper</p>;

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">📦 Danh sách shipper {'>'} Thông tin chờ duyệt</h4>

                <CRow className="mb-3">
                    <CCol md={6}><label>Tài khoản</label><CFormInput disabled value={shipper.username} /></CCol>
                    <CCol md={6}><label>Họ tên</label><CFormInput disabled value={shipper.name} /></CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}><label>SĐT</label><CFormInput disabled value={shipper.phone} /></CCol>
                    <CCol md={6}><label>Email</label><CFormInput disabled value={shipper.email} /></CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}><label>Ngày sinh</label><CFormInput disabled value={shipper.birthDate} /></CCol>
                    <CCol md={6}><label>Ngày đăng ký</label><CFormInput disabled value={shipper.registrationDate} /></CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}><label>Trạng thái</label><CFormInput disabled value={shipper.shipperStatus} /></CCol>
                </CRow>

                <CRow>
                    <CCol md={6}><label>Ảnh CCCD (Mặt trước)</label><CImage src={shipper.citizenIDCardFront} width={200} /></CCol>
                    <CCol md={6}><label>Mặt sau</label><CImage src={shipper.citizenIDCardBack} width={200} /></CCol>
                </CRow>

                <CRow className="mt-3 mb-3">
                    <CCol md={6}><label>GPLX (Mặt trước)</label><CImage src={shipper.licenseFront} width={200} /></CCol>
                    <CCol md={6}><label>Mặt sau</label><CImage src={shipper.licenseBack} width={200} /></CCol>
                </CRow>

                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton color="danger" className="w-100" onClick={() => handleOpenConfirmModal('REJECTED')}>
                            ❌ Từ chối
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>
                            ⬅️ Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="success" className="w-100" onClick={() => handleOpenConfirmModal('APPROVED')}>
                            ✅ Duyệt
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader><CModalTitle>Xác nhận hành động</CModalTitle></CModalHeader>
                <CModalBody>
                    {confirmStatus === 'APPROVED'
                        ? 'Bạn có chắc chắn muốn duyệt shipper này?'
                        : 'Bạn có chắc chắn muốn từ chối shipper này?'}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton color={confirmStatus === 'APPROVED' ? 'success' : 'danger'} onClick={handleConfirmUpdateStatus}>
                        {confirmStatus === 'APPROVED' ? 'Duyệt' : 'Từ chối'}
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShipperPending;
