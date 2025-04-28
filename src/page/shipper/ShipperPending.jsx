import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow, CCol, CCard, CCardBody, CFormInput, CButton, CModal, CModalBody, CModalFooter,
    CModalHeader, CModalTitle, CFormTextarea, CFormCheck
} from '@coreui/react';
import { FaArrowRight, FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShipperByIdQuery, useRejectShipperMutation, useApproveShipperMutation } from '../../service/shipperService.js';

const ShipperPending = () => {
    const [shipper, setShipper] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShipperByIdQuery(id);
    const [approveShipper] = useApproveShipperMutation();
    const [rejectShipper] = useRejectShipperMutation();

    const [showShipperImage, setShowShipperImage] = useState(false);
    const [showCitizenId, setShowCitizenId] = useState(false);
    const [showDrivingLicense, setShowDrivingLicense] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionReasonModal, setShowRejectionReasonModal] = useState(false);
    const [currentSide, setCurrentSide] = useState('front');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showResumeModal, setShowResumeModal] = useState(false);

    const [isChecked, setIsChecked] = useState(false); // State for the checkbox

    useEffect(() => {
        if (data) {
            setShipper(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu shipper</p>;
    if (!shipper) return <p>Không tìm thấy thông tin shipper</p>;

    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        if (status === 'REJECTED') {
            setShowRejectionReasonModal(true);
        } else {
            setShowConfirmModal(true);
        }
    };

    const handleRejectShipper = async () => {
        if (!rejectionReason.trim()) {
            alert('Vui lòng nhập lý do từ chối!');
            return;
        }

        try {
            await rejectShipper({ userId: id, reason: rejectionReason }).unwrap();
            alert('Shipper đã bị từ chối');
            navigate('/shipper-list');
        } catch (e) {
            alert('Không thể từ chối shipper!');
            console.error(e);
        } finally {
            setShowRejectionReasonModal(false);
        }
    };

    const handleApproveShipper = async () => {
        if (!isChecked) {
            alert('Vui lòng xác nhận trước khi duyệt shipper!');
            return;
        }
        try {
            await approveShipper(id).unwrap();
            alert('Shipper đã được duyệt');
            navigate('/shipper-list');
        } catch (error) {
            alert('Không thể duyệt shipper!');
        } finally {
            setShowConfirmModal(false);
        }
    };

    const shipperImage = shipper?.images || [shipper.profileImage];
    const citizenIdFront = shipper?.citizenIDCardFront ? [shipper.citizenIDCardFront] : [];
    const citizenIdBack = shipper?.citizenIDCardBack ? [shipper.citizenIDCardBack] : [];
    const drivingLicenseFront = shipper?.drivingLicenseFront ? [shipper.drivingLicenseFront] : [];
    const drivingLicenseBack = shipper?.drivingLicenseBack ? [shipper.drivingLicenseBack] : [];

    const handleNextImage = () => {
        setCurrentSide(currentSide === 'front' ? 'back' : 'front');
    };

    const handlePrevImage = () => {
        if (currentSide === 'front') {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + citizenIdFront.length) % citizenIdFront.length);
        } else {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + citizenIdBack.length) % citizenIdBack.length);
        }
    };

    const handleOpenResumeModal = () => {
        setShowResumeModal(true);
    };

    const handleCloseResumeModal = () => {
        setShowResumeModal(false);
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách shipper {'>'} Shipper chờ duyệt</h4>
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
                    <CCol md={4} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => setShowDrivingLicense(true)}
                        >
                            Giấy phép lái xe
                        </label>
                    </CCol>
                    <CCol md={4} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => setShowCitizenId(true)}
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

                {/* Checkbox for confirmation */}
                <CRow className="mb-3">
                    <CCol md={12}>
                        <CFormCheck
                            type="checkbox"
                            label="Đã xem đủ thông tin."
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={4}>
                        <CButton
                            color="danger"
                            className="w-100"
                            onClick={() => handleOpenConfirmModal('REJECTED')}
                            disabled={!isChecked}
                        >
                            Từ chối đăng ký
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shipper-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton
                            color="success"
                            className="w-100"
                            onClick={() => handleOpenConfirmModal('ACTIVE')}
                            disabled={!isChecked}
                        >
                            Duyệt shipper
                        </CButton>
                    </CCol>
                </CRow>

            </CCardBody>

            {/* Confirmation Modal */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader><CModalTitle>Xác nhận</CModalTitle></CModalHeader>
                <CModalBody>
                    {confirmStatus === 'ACTIVE' ? 'Bạn có chắc chắn muốn duyệt shipper này?' : 'Bạn có chắc chắn muốn từ chối shipper này?'}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton color={confirmStatus === 'ACTIVE' ? 'success' : 'danger'} onClick={confirmStatus === 'ACTIVE' ? handleApproveShipper : handleRejectShipper}>
                        {confirmStatus === 'ACTIVE' ? 'Duyệt' : 'Từ chối'}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Rejection Reason Modal */}
            <CModal visible={showRejectionReasonModal} onClose={() => setShowRejectionReasonModal(false)} centered>
                <CModalHeader><CModalTitle>Nhập lý do từ chối</CModalTitle></CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        rows={4}
                        placeholder="Vui lòng nhập lý do từ chối shipper này"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)} // Update rejection reason
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowRejectionReasonModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleRejectShipper}>Từ chối</CButton>
                </CModalFooter>
            </CModal>


            {/* Modal for Shipper's Profile Image */}
            <CModal visible={showShipperImage} onClose={() => setShowShipperImage(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center bg-white position-relative">
                    {shipperImage.length > 0 && (
                        <img
                            src={shipperImage[currentImageIndex]}
                            alt="Ảnh profile"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowShipperImage(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Citizen ID */}
            <CModal visible={showCitizenId} onClose={() => setShowCitizenId(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center bg-white position-relative">
                    <FaArrowCircleLeft size={40} className="position-absolute start-0 ms-3" onClick={handlePrevImage} />
                    {currentSide === 'front' && citizenIdFront.length > 0 && (
                        <div className="d-flex flex-column align-items-center">
                            <h5>Mặt trước</h5>
                            <img src={citizenIdFront[currentImageIndex]} alt="Căn cước công dân mặt trước" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        </div>
                    )}
                    {currentSide === 'back' && citizenIdBack.length > 0 && (
                        <div className="d-flex flex-column align-items-center mt-4">
                            <h5>Mặt sau</h5>
                            <img src={citizenIdBack[currentImageIndex]} alt="Căn cước công dân mặt sau" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        </div>
                    )}
                    <FaArrowCircleRight size={40} className="position-absolute end-0 me-3" onClick={handleNextImage} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowCitizenId(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Driving License ID */}
            <CModal visible={showDrivingLicense} onClose={() => setShowDrivingLicense(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center bg-white position-relative">
                    <FaArrowCircleLeft size={40} className="position-absolute start-0 ms-3" onClick={handlePrevImage} />
                    {currentSide === 'front' && drivingLicenseFront.length > 0 && (
                        <div className="d-flex flex-column align-items-center">
                            <h5>Mặt trước</h5>
                            <img src={drivingLicenseFront[currentImageIndex]} alt="Giấy phép lái xe mặt trước" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        </div>
                    )}
                    {currentSide === 'back' && drivingLicenseBack.length > 0 && (
                        <div className="d-flex flex-column align-items-center mt-4">
                            <h5>Mặt sau</h5>
                            <img src={drivingLicenseBack[currentImageIndex]} alt="Giấy phép lái xe mặt sau" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                        </div>
                    )}
                    <FaArrowCircleRight size={40} className="position-absolute end-0 me-3" onClick={handleNextImage} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDrivingLicense(false)}>Đóng</CButton>
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

export default ShipperPending;
