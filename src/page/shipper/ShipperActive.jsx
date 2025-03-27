import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow, CCol, CCard, CCardBody, CFormInput, CButton, CModal, CModalBody, CModalFooter,
    CModalHeader, CModalTitle
} from '@coreui/react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { useGetShipperByIdQuery, useDeactivateShipperMutation } from "../../service/shipperService.js";

const ShipperActive = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShipperByIdQuery(id);
    const [deactivateShipper] = useDeactivateShipperMutation();  // Mutation to deactivate shipper

    const [shipper, setShipper] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');  // 'INACTIVE' when deactivating
    const [showCitizenIdModal, setShowCitizenIdModal] = useState(false);
    const [showDrivingLicenseModal, setShowDrivingLicenseModal] = useState(false);
    const [currentSide, setCurrentSide] = useState('front'); // 'front' or 'back'

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

    // Handle the status update (Deactivating Shipper)
    const handleConfirmUpdateStatus = async () => {
        try {
            if (confirmStatus === 'INACTIVE') {
                // Call the deactivate API to change status to INACTIVE
                await deactivateShipper({ userId: id, reason: 'Chặn người dùng' }).unwrap();  // Adding a reason for the deactivation
                setShipper({ ...shipper, status: 'INACTIVE' });
                alert('Trạng thái shipper cập nhật thành công: INACTIVE');
                navigate('/shipper-list');  // Redirect back to the shipper list
            }
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');  // Show general error message
            if (error.response) {
                console.log("Server Error:", error.response.data);
            } else if (error.message) {
                console.log("Error message:", error.message);
            }
        } finally {
            setShowConfirmModal(false);  // Close the modal
        }
    };

    // Modal for Citizen ID images
    const handleOpenCitizenIdModal = () => {
        setShowCitizenIdModal(true);
    };

    const handleCloseCitizenIdModal = () => {
        setShowCitizenIdModal(false);
    };

    // Modal for Driving License images
    const handleOpenDrivingLicenseModal = () => {
        setShowDrivingLicenseModal(true);
    };

    const handleCloseDrivingLicenseModal = () => {
        setShowDrivingLicenseModal(false);
    };

    const handleNextSide = () => {
        setCurrentSide(currentSide === 'front' ? 'back' : 'front');
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách shipper {'>'} Thông tin shipper</h4>
                <CRow className="mb-3">
                    <CCol md={6}><label>Tên shipper</label><CFormInput disabled value={shipper.name} /></CCol>
                    <CCol md={6}><label>Giới tính</label><CFormInput disabled value={shipper.gender} /></CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}><label>Số điện thoại</label><CFormInput disabled value={shipper.phone} /></CCol>
                    <CCol md={6}><label>Email</label><CFormInput disabled value={shipper.email} /></CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}><label>Ngày sinh</label><CFormInput disabled value={shipper.dob} /></CCol>
                    <CCol md={6}><label>Ngày đăng ký</label><CFormInput disabled value={shipper.registrationDate} /></CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}><label>Trạng thái</label><CFormInput disabled value={shipper.shipperStatus} /></CCol>
                </CRow>

                {/* Citizen ID and Driving License */}
                <CRow>
                    <CCol md={6}>
                        <label>Ảnh CMND/CCCD</label>
                        <FaArrowCircleRight
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={handleOpenCitizenIdModal} // Open Citizen ID modal
                        />
                    </CCol>
                    <CCol md={6}>
                        <label>Ảnh GPLX</label>
                        <FaArrowCircleRight
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={handleOpenDrivingLicenseModal} // Open Driving License modal
                        />
                    </CCol>
                </CRow>

                <CRow className="text-center mt-4">
                    <CCol><CButton color="danger" className="w-100" onClick={() => handleOpenConfirmModal('INACTIVE')}>Chặn người dùng</CButton></CCol>
                    <CCol><CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>Quay lại</CButton></CCol>
                </CRow>
                <CRow className="text-center mt-4">
                    <CCol><CButton color="success" className="w-100" onClick={() => navigate('/shipper-list')}>Danh sách đơn hàng</CButton></CCol>
                    <CCol><CButton color="dark" className="w-100" onClick={() => navigate('/shipper-list')}>Danh sách cáo buộc</CButton></CCol>
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
                    <CButton color="danger" onClick={handleConfirmUpdateStatus}>Chặn</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Citizen ID images */}
            <CModal visible={showCitizenIdModal} onClose={handleCloseCitizenIdModal} centered>
                <CModalHeader>
                    <CModalTitle>Ảnh CMND/CCCD</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="d-flex justify-content-center align-items-center bg-white position-relative">
                        {currentSide === 'front' && shipper.citizenIDCardFront && (
                            <img src={shipper.citizenIDCardFront} alt="Căn cước công dân mặt trước" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        )}
                        {currentSide === 'back' && shipper.citizenIDCardBack && (
                            <img src={shipper.citizenIDCardBack} alt="Căn cước công dân mặt sau" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        )}
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <FaArrowCircleLeft
                            size={40}
                            className="position-absolute start-0 ms-3"
                            style={{ cursor: 'pointer' }}
                            onClick={handleNextSide} // Switch sides (front <-> back)
                        />
                        <FaArrowCircleRight
                            size={40}
                            className="position-absolute end-0 me-3"
                            style={{ cursor: 'pointer' }}
                            onClick={handleNextSide} // Switch sides (front <-> back)
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseCitizenIdModal}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Driving License images */}
            <CModal visible={showDrivingLicenseModal} onClose={handleCloseDrivingLicenseModal} centered>
                <CModalHeader>
                    <CModalTitle>Ảnh Giấy phép lái xe</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="d-flex justify-content-center align-items-center bg-white position-relative">
                        {currentSide === 'front' && shipper.drivingLicenseFront && (
                            <img src={shipper.drivingLicenseFront} alt="Giấy phép lái xe mặt trước" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        )}
                        {currentSide === 'back' && shipper.drivingLicenseBack && (
                            <img src={shipper.drivingLicenseBack} alt="Giấy phép lái xe mặt sau" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        )}
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <FaArrowCircleLeft
                            size={40}
                            className="position-absolute start-0 ms-3"
                            style={{ cursor: 'pointer' }}
                            onClick={handleNextSide} // Switch sides (front <-> back)
                        />
                        <FaArrowCircleRight
                            size={40}
                            className="position-absolute end-0 me-3"
                            style={{ cursor: 'pointer' }}
                            onClick={handleNextSide} // Switch sides (front <-> back)
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseDrivingLicenseModal}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShipperActive;
