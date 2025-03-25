import React, { useState, useEffect } from 'react';
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
import { useGetShipperByIdQuery, useDeactivateShipperMutation } from "../../service/shipperService.js";

const ShipperActive = () => {
    const { id } = useParams();  // Get the ID from the URL params
    const navigate = useNavigate();  // For navigating back to the list

    // Fetch shipper data using the id from the URL
    const { data, error, isLoading } = useGetShipperByIdQuery(id);
    const [deactivateShipper] = useDeactivateShipperMutation();

    const [shipper, setShipper] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');

    // State for image modal
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageToShow, setImageToShow] = useState('');

    // Update shipper details once data is fetched
    useEffect(() => {
        if (data) {
            setShipper(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi khi lấy dữ liệu shipper</p>;
    if (!shipper) return <p>Không tìm thấy thông tin shipper</p>;

    // Open the confirmation modal to update status
    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        setShowConfirmModal(true);
    };

    // Handle the status update
    const handleConfirmUpdateStatus = async () => {
        try {
            if (confirmStatus === 'INACTIVE') {
                // Call the deactivate API to change status to INACTIVE
                await deactivateShipper(id).unwrap();
                setShipper({ ...shipper, status: 'INACTIVE' });
                alert('Trạng thái shipper cập nhật thành công: INACTIVE');
                navigate('/shipper-list');  // Redirect back to the shipper list
            }
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setShowConfirmModal(false);  // Close the modal
        }
    };

    // Function to open the image modal with the selected image
    const handleOpenImageModal = (imageUrl) => {
        setImageToShow(imageUrl);
        setShowImageModal(true);
    };

    // Function to close the image modal
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageToShow('');
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
                    <CCol md={6}>
                        <label>Ảnh CMND/CCCD (Mặt trước)</label>
                        <CImage
                            src={shipper.citizenIDCardFront}
                            alt="Ảnh mặt trước"
                            width={200}
                            onClick={() => handleOpenImageModal(shipper.citizenIDCardFront)}
                            style={{ cursor: 'pointer' }}
                        />
                    </CCol>
                    <CCol md={6}>
                        <label>Mặt sau</label>
                        <CImage
                            src={shipper.citizenIDCardBack}
                            alt="Ảnh mặt sau"
                            width={200}
                            onClick={() => handleOpenImageModal(shipper.citizenIDCardBack)}
                            style={{ cursor: 'pointer' }}
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-3 mt-3">
                    <CCol md={6}>
                        <label>GPLX (Mặt trước)</label>
                        <CImage
                            src={shipper.drivingLicenseFront}
                            alt="Mặt trước"
                            width={200}
                            onClick={() => handleOpenImageModal(shipper.drivingLicenseFront)}
                            style={{ cursor: 'pointer' }}
                        />
                    </CCol>
                    <CCol md={6}>
                        <label>Mặt sau</label>
                        <CImage
                            src={shipper.drivingLicenseBack}
                            alt="Mặt sau"
                            width={200}
                            onClick={() => handleOpenImageModal(shipper.drivingLicenseBack)}
                            style={{ cursor: 'pointer' }}
                        />
                    </CCol>
                </CRow>
                <CRow className="text-center mt-4">
                    <CCol md={4}><CButton color="danger" className="w-100" onClick={() => handleOpenConfirmModal('INACTIVE')}>Chặn người dùng</CButton></CCol>
                    <CCol md={4}><CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>Quay lại</CButton></CCol>
                </CRow>
            </CCardBody>

            {/* Modal for confirming action */}
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

            {/* Modal for showing image in full size */}
            <CModal visible={showImageModal} onClose={handleCloseImageModal} centered>
                <CModalHeader>
                    <CModalTitle>Ảnh chi tiết</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CImage src={imageToShow} alt="Chi tiết ảnh" width="100%" />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseImageModal}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShipperActive;
