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
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react';
import { FaArrowRight, FaArrowLeft, FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShopByIdQuery, useUpdateShopStatusMutation } from '../../service/shopService.js';

const ShopActive = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [updateShopStatus] = useUpdateShopStatusMutation();
    const [showModal, setShowModal] = useState(false);
    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu cửa hàng</p>;
    if (!shop) return <p>Không tìm thấy thông tin cửa hàng</p>;

    // Update status
    const handleBlockShop = async () => {
        try {
            await updateShopStatus({ shopId: id, status: 'INACTIVE' }).unwrap();
            setShop({ ...shop, isActive: 'INACTIVE' });
            alert('Cửa hàng đã được kích hoạt lại!');
            navigate('/shop-list');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        }
    };

    const handleConfirmBlock = () => {
        setShowBlockModal(true);
    };

    const imagesBackground = shop?.images || [shop.backgroundImage];
    const imageRegistrationCertificate = shop?.images || [shop.registrationCertificate];

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng đang hoạt động</h4>
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
                    <CCol md={6}>
                        <CButton color="danger" className="w-100" onClick={handleConfirmBlock}>
                            Chặn cửa hàng
                        </CButton>
                    </CCol>
                    <CCol md={6}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

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

            {/* Modal thông báo chặn cửa hàng */}
            <CModal visible={showBlockModal} onClose={() => setShowBlockModal(false)}>
                <CModalHeader>
                    <CModalTitle>Bạn có muốn dừng hoạt động cửa hàng này không</CModalTitle>
                </CModalHeader>
                <CModalFooter>
                    <CButton color="danger" onClick={() => setShowBlockModal(false)}>Hủy</CButton>
                    <CButton color="success" onClick={handleBlockShop}>Xác nhận</CButton>                </CModalFooter>
            </CModal>

        </CCard>
    );
};

export default ShopActive;