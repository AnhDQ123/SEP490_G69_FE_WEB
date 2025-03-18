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
    CModalTitle
} from '@coreui/react';
import { FaArrowRight, FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShopByIdQuery, useUpdateShopStatusMutation } from '../../service/shopService.js';

const ShopPending = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [updateShopStatus] = useUpdateShopStatusMutation();

    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        setShowConfirmModal(true);
    };

    // Update status
    const handleConfirmUpdateStatus = async () => {
        try {
            await updateShopStatus({ shopId: id, status: confirmStatus }).unwrap();
            setShop({ ...shop, isActive: confirmStatus });
            alert(`Cửa hàng đã được cập nhật trạng thái: ${confirmStatus}`);
            navigate('/shop-list');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setShowConfirmModal(false);
        }
    };

    const imagesBackground = shop?.images || [shop.backgroundImage];
    const imageRegistrationCertificate = shop?.images || [shop.registrationCertificate];

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesBackground.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesBackground.length) % imagesBackground.length);
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng chờ duyệt</h4>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Tên cửa hàng</label>
                        <CFormInput disabled value={shop.name} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Chủ cửa hàng</label>
                        <CFormInput disabled value={shop.owner.username} />
                    </CCol>
                    <CCol md={6}>
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
                    <CCol md={6}>
                        <label>Loại cửa hàng</label>
                        <CFormInput disabled value={shop.sellType} />
                    </CCol>
                    <CCol md={6}>
                        <label>Giờ hoạt động</label>
                        <CFormInput disabled value={shop.open_time} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Mã số thuế</label>
                        <CFormInput disabled value={shop.tax_code} />
                    </CCol>
                    <CCol md={6}>
                        <label>Trạng thái</label>
                        <CFormInput disabled value={shop.isActive} />
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
                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton color="danger" className="w-100" onClick={() => handleOpenConfirmModal('REJECTED')}>
                            Từ chối đăng ký
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="success" className="w-100" onClick={() => handleOpenConfirmModal('ACTIVE')}>
                            Duyệt cửa hàng
                        </CButton>
                    </CCol>
                </CRow>
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
                    <CButton color={confirmStatus === 'ACTIVE' ? 'success' : 'danger'} onClick={handleConfirmUpdateStatus}>
                        {confirmStatus === 'ACTIVE' ? 'Duyệt' : 'Từ chối'}
                    </CButton>
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
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />
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
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageBackground(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>


            {/* Modal image shop's registranation */}
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
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />
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
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageRegistrationCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

        </CCard>
    );
};

export default ShopPending;
