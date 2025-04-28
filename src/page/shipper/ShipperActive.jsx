import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow, CCol, CCard, CCardBody, CFormInput, CButton, CModal, CModalBody, CModalFooter,
    CModalHeader, CModalTitle
} from '@coreui/react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { useGetShipperByIdQuery, useShipperInactiveMutation } from "../../service/shipperService.js";

const ShipperActive = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShipperByIdQuery(id);
    const [deactivateShipper] = useShipperInactiveMutation();  // Mutation to deactivate shipper

    const [shipper, setShipper] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCitizenIdModal, setShowCitizenIdModal] = useState(false);
    const [showDrivingLicenseModal, setShowDrivingLicenseModal] = useState(false);
    const [currentSide, setCurrentSide] = useState('front'); // 'front' or 'back'
    const [reason, setReason] = useState('');  // Store the reason for deactivating the shipper
    const [showResumeModal, setShowResumeModal] = useState(false);

    useEffect(() => {
        if (data) {
            setShipper(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi khi lấy dữ liệu shipper</p>;
    if (!shipper) return <p>Không tìm thấy thông tin shipper</p>;

    // Open the confirmation modal to update status with reason
    const handleOpenConfirmModal = () => {
        setShowConfirmModal(true);
    };

    // Handle the status update (Deactivating Shipper) with reason
    const handleConfirmUpdateStatus = async () => {
        try {
            if (reason.trim()) {
                // Call the deactivate API to change status to INACTIVE with reason
                await deactivateShipper({ userId: id, reason }).unwrap();  // Send reason to the API
                setShipper({ ...shipper, status: 'INACTIVE' });
                alert('Trạng thái shipper cập nhật thành công: INACTIVE');
                navigate('/shipper-list');  // Redirect back to the shipper list
            } else {
                alert('Vui lòng nhập lý do!');
            }
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');  // Show general error message
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

    const handleOpenResumeModal = () => {
        setShowResumeModal(true);
    };

    const handleCloseResumeModal = () => {
        setShowResumeModal(false);
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

                <CRow className="mb-3">
                    <CCol md={4} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={handleOpenDrivingLicenseModal}
                        >
                            Giấy phép lái xe
                        </label>
                    </CCol>
                    <CCol md={4} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={handleOpenCitizenIdModal}
                        >
                            Căn cước công dân
                        </label>
                    </CCol>
                    <CCol md={4} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={handleOpenResumeModal}
                        >
                            Sơ yếu lý lịch
                        </label>
                    </CCol>
                </CRow>


                <CRow className="text-center mt-4">
                    <CCol><CButton color="danger" className="w-100" onClick={handleOpenConfirmModal}>Chặn người dùng</CButton></CCol>
                    <CCol><CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>Quay lại</CButton></CCol>
                </CRow>

            </CCardBody>

            {/* Modal for confirming action */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Xác nhận</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        Bạn có chắc chắn muốn chặn shipper này?
                    </div>
                    <div className="mt-3">
                        <label>Lý do chặn:</label>
                        <CFormInput
                            value={reason}
                            onChange={(e) => setReason(e.target.value)} // Update reason on change
                            placeholder="Nhập lý do chặn"
                        />
                    </div>
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

            <CModal visible={showResumeModal} onClose={handleCloseResumeModal} centered>
                <CModalHeader>
                    <CModalTitle>Ảnh Sơ yếu lý lịch</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="d-flex justify-content-center align-items-center bg-white position-relative">
                        {shipper.judicialRecord ? (
                            <img
                                src={shipper.judicialRecord}
                                alt="Sơ yếu lý lịch"
                                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                            />
                        ) : (
                            <p>Không có ảnh Sơ yếu lý lịch</p>
                        )}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseResumeModal}>Đóng</CButton>
                </CModalFooter>
            </CModal>

        </CCard>
    );
};

export default ShipperActive;
