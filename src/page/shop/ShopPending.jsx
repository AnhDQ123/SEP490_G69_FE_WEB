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
    CFormTextarea, CFormCheck
} from '@coreui/react';
import { FaArrowRight, FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShopByIdQuery, useRejectShopMutation, useApproveShopMutation} from '../../service/shopService.js';

import 'react-toastify/dist/ReactToastify.css';
const ShopPending = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [successModal, setSuccessModal] = useState({
        visible: false,
        message: ''
    });

    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [rejectShop] = useRejectShopMutation();
    const [approveShop] = useApproveShopMutation(); // Thêm approveShop mutation

    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);
    const [showFoodSafetyCertificate, setShowFoodSafetyCertificate] = useState(false);
    const [showCitizenId, setShowCitizenId] = useState(false); // New state for Citizen ID

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionReasonError, setRejectionReasonError] = useState('');
    const [showRejectionReasonModal, setShowRejectionReasonModal] = useState(false);


    const [currentSide, setCurrentSide] = useState('front');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu cửa hàng</p>;
    if (!shop) return <p>Không tìm thấy thông tin cửa hàng</p>;


    // Mở modal xác nhận
    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        setShowConfirmModal(true);  // Mở modal xác nhận
    };

    const handleShowSuccessModal = (message) => {
        setSuccessModal({ visible: true, message });
        setTimeout(() => {
            setSuccessModal({ visible: false, message: '' }); // Tự động đóng modal sau 2 giây
        }, 2000); // 2 giây để modal hiển thị
    };

    const handleRejectShop = async () => {
        if (!rejectionReason.trim()) {
            setRejectionReasonError('Lý do từ chối là bắt buộc!');
            return;
        }
        setRejectionReasonError('');

        try {
            await rejectShop({ shopId: id, reason: rejectionReason }).unwrap();

            // Hiển thị modal thông báo thành công
            handleShowSuccessModal('Cửa hàng đã bị từ chối!');
            setTimeout(() => {
                navigate('/shop-list');  // Chuyển hướng sau khi thao tác xong
            }, 2500); // Đợi 2.5 giây để modal hiển thị trước khi chuyển hướng
        } catch (error) {
            handleShowSuccessModal('Không thể từ chối cửa hàng!');
        } finally {
            setShowRejectionReasonModal(false);
        }
    };


    const handleApproveShop = async () => {
        try {
            await approveShop(id).unwrap();
            setSuccessModal({ visible: true, message: 'Đã duyệt cửa hàng thành công!' });
            setTimeout(() => {
                navigate('/shop-list');
            }, 2500);
        } catch (error) {
            setSuccessModal({ visible: true, message: 'Cập nhật thất bại!' });
        } finally {
            setShowConfirmModal(false);
        }
    };

    const imagesBackground = shop?.images || [shop.backgroundImage];
    const imageRegistrationCertificate = shop?.images || [shop.registrationCertificate];
    const foodSafetyCertificate = shop?.images || [shop.foodSafetyCertificate];
    const citizenIdFront = shop?.images || [shop.owner.profile.citizenIDCardFront];
    console.log(citizenIdFront[currentImageIndex])
    const citizenIdBack = shop?.images || [shop.owner.profile.citizenIDCardBack];
    console.log(shop)
    const handleNextImage = () => {
        if (currentSide === 'front') {
            setCurrentSide('back');
        }
    };

    const handlePrevImage = () => {
        if (currentSide === 'back') {
            setCurrentSide('front');
        }
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng chờ duyệt</h4>
                <CRow className="mb-3">
                    <CCol>
                        <label>Tên cửa hàng</label>
                        <CFormInput disabled value={shop.name} />
                    </CCol>
                    <CCol>
                        <label>Chủ cửa hàng</label>
                        <CFormInput disabled value={shop.owner.username} />
                    </CCol>
                    <CCol>
                        <label>Số điện thoại</label>
                        <CFormInput disabled value={shop.phone} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={12}>
                        <label>Địa chỉ</label>
                        <CFormInput disabled value={shop.address} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={4}>
                        <label>Loại cửa hàng</label>
                        <CFormInput disabled value={shop.sellType} />
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ hoạt động</label>
                        <CFormInput disabled value={shop.openTime} />
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ đóng cửa</label>
                        <CFormInput disabled value={shop.closeTime} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Mã số thuế</label>
                        <CFormInput disabled value={shop.owner.profile.taxCode} />
                    </CCol>
                    <CCol md={6}>
                        <label>Trạng thái</label>
                        <CFormInput disabled value={shop.isActive ? 'Chờ duyệt' : 'Hoạt động'} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Ảnh cửa hàng</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowImageBackground(true)}
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Giấy phép kinh doanh</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowImageRegistrationCertificate(true)}
                        />
                    </CCol>
                </CRow>
                {/* New section for food safety certificate */}
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Giấy phép vệ sinh an toàn thực phẩm</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowFoodSafetyCertificate(true)} // Show food safety certificate modal
                        />
                    </CCol>
                </CRow>
                {/* New section for Citizen ID */}
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Căn cước công dân</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowCitizenId(true)} // Show Citizen ID modal
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={12}>
                        <CFormCheck
                            type="checkbox"
                            label="Đã xem đủ thông tin cửa hàng"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                    </CCol>
                </CRow>

                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton
                            color="danger"
                            className="w-100"
                            onClick={() => setShowRejectionReasonModal(true)}
                            disabled={!isChecked} // Vô hiệu hóa nếu chưa tick checkbox
                        >
                            Từ chối đăng ký
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton
                            color="secondary"
                            className="w-100"
                            onClick={() => navigate('/shop-list')}
                        >
                            Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton
                            color="success"
                            className="w-100"
                            onClick={() => handleOpenConfirmModal('ACTIVE')}
                            disabled={!isChecked} // Vô hiệu hóa nếu chưa tick checkbox
                        >
                            Duyệt cửa hàng
                        </CButton>
                    </CCol>
                </CRow>
                {/* Checkbox for confirmation */}

            </CCardBody>

            {/* Modal xác nhận */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Xác nhận</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {confirmStatus === 'ACTIVE' ? 'Bạn có chắc chắn muốn duyệt cửa hàng này?' : 'Bạn có chắc chắn muốn từ chối cửa hàng này?'}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton
                        color={confirmStatus === 'ACTIVE' ? 'success' : 'danger'}
                        onClick={confirmStatus === 'ACTIVE' ? handleApproveShop : null}
                    >
                        {confirmStatus === 'ACTIVE' ? 'Duyệt' : 'Từ chối'}
                    </CButton>
                </CModalFooter>
            </CModal>


            {/* Modal nhập lý do từ chối */}
            <CModal visible={showRejectionReasonModal} onClose={() => setShowRejectionReasonModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Nhập lý do từ chối</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        rows={4}
                        placeholder="Vui lòng nhập lý do từ chối cửa hàng này"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    {rejectionReasonError && <div className="text-danger mb-2">{rejectionReasonError}</div>}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowRejectionReasonModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleRejectShop}>Từ chối</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal hiển thị thông báo thành công */}
            <CModal visible={successModal.visible} onClose={() => setSuccessModal({ visible: false, message: '' })} centered>
                <CModalHeader>
                    <CModalTitle>Thành công</CModalTitle>
                </CModalHeader>
                <CModalBody>{successModal.message}</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setSuccessModal({ visible: false, message: '' })}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal image shop's background */}
            <CModal visible={showImageBackground} onClose={() => setShowImageBackground(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    {imagesBackground.length > 0 && (
                        <img
                            src={imagesBackground[currentImageIndex]}
                            alt="Ảnh cửa hàng"
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
                    <CButton color="secondary" onClick={() => setShowImageBackground(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal image shop's registration certificate */}
            <CModal visible={showImageRegistrationCertificate} onClose={() => setShowImageRegistrationCertificate(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    {imageRegistrationCertificate.length > 0 && (
                        <img
                            src={imageRegistrationCertificate[currentImageIndex]}
                            alt="Giấy phép kinh doanh"
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
                    <CButton color="secondary" onClick={() => setShowImageRegistrationCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for food safety certificate */}
            <CModal visible={showFoodSafetyCertificate} onClose={() => setShowFoodSafetyCertificate(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    {foodSafetyCertificate.length > 0 && (
                        <img
                            src={foodSafetyCertificate[currentImageIndex]}
                            alt="Giấy phép vệ sinh an toàn thực phẩm"
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
                    <CButton color="secondary" onClick={() => setShowFoodSafetyCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Citizen ID */}
            <CModal visible={showCitizenId} onClose={() => setShowCitizenId(false)} size="lg" centered="true">
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />

                    {/* Hiển thị ảnh căn cước công dân mặt trước */}
                    {currentSide === 'front' && citizenIdFront.length > 0 && (
                        <div className="d-flex flex-column align-items-center mt-4">
                            <h5>Mặt trước</h5>
                            <img
                                src={citizenIdFront[currentImageIndex]}
                                alt="Căn cước công dân mặt trước"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    )}

                    {/* Hiển thị ảnh căn cước công dân mặt sau */}
                    {currentSide === 'back' && citizenIdBack.length > 0 && (
                        <div className="d-flex flex-column align-items-center mt-4">
                            <h5>Mặt sau</h5>
                            <img
                                src={citizenIdBack[currentImageIndex]}
                                alt="Căn cước công dân mặt sau"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    )}

                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowCitizenId(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShopPending;
