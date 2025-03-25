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
    const { id } = useParams();  // Get the ID from the URL params
    const navigate = useNavigate();  // For navigating back to the list

    const { data: shipper, error, isLoading } = useGetShipperByIdQuery(id);
    const [approveShipper] = useApproveShipperMutation();  // Hook to approve shipper
    const [rejectShipper] = useRejectShipperMutation();  // Hook to reject shipper

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);  // State to show the reject reason modal
    const [rejectReason, setRejectReason] = useState('');  // State to hold the reject reason

    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        setShowConfirmModal(true);
    };

    const handleOpenRejectModal = () => {
        setShowRejectModal(true);  // Open the modal to ask for the reason when rejecting
    };

    const handleConfirmUpdateStatus = async () => {
        try {
            if (confirmStatus === 'ACTIVE') {
                // Call the approve API to change status to ACTIVE
                await approveShipper(id).unwrap();
                alert('✅ Duyệt thành công!');
            } else {
                if (!rejectReason.trim()) {
                    alert('❌ Bạn phải nhập lý do từ chối!');
                    return;
                }
                // Call the reject API to change status to REJECTED with reason
                await rejectShipper({ userId: id, reason: rejectReason }).unwrap();
                alert('❌ Đã từ chối shipper!');
            }
            navigate('/shipper-list');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setShowConfirmModal(false);
            setShowRejectModal(false);  // Close the reject modal after action
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
                    <CCol md={6}><label>GPLX (Mặt trước)</label><CImage src={shipper.drivingLicenseFront} width={200} /></CCol>
                    <CCol md={6}><label>Mặt sau</label><CImage src={shipper.drivingLicenseBack} width={200} /></CCol>
                </CRow>

                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton color="danger" className="w-100" onClick={handleOpenRejectModal}>
                            ❌ Từ chối
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>
                            ⬅️ Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="success" className="w-100" onClick={() => handleOpenConfirmModal('ACTIVE')}>
                            ✅ Duyệt
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            {/* Modal for confirming action */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader><CModalTitle>Xác nhận hành động</CModalTitle></CModalHeader>
                <CModalBody>
                    {confirmStatus === 'ACTIVE'
                        ? 'Bạn có chắc chắn muốn duyệt shipper này?'
                        : 'Bạn có chắc chắn muốn từ chối shipper này?'}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton color={confirmStatus === 'ACTIVE' ? 'success' : 'danger'} onClick={handleConfirmUpdateStatus}>
                        {confirmStatus === 'ACTIVE' ? 'Duyệt' : 'Từ chối'}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for entering reject reason */}
            <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)} centered>
                <CModalHeader><CModalTitle>Nhập lý do từ chối</CModalTitle></CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="text"
                        placeholder="Lý do từ chối"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowRejectModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleConfirmUpdateStatus}>
                        Từ chối
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShipperPending;
