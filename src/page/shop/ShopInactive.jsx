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
} from '@coreui/react';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShopByIdQuery, useActivateShopMutation } from '../../service/shopService.js';

const ShopInactive = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentSide, setCurrentSide] = useState('front'); // 'front' or 'back'
    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [updateShopStatus] = useActivateShopMutation();
    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);
    const [showFoodSafetyCertificate, setShowFoodSafetyCertificate] = useState(false);
    const [showCitizenId, setShowCitizenId] = useState(false); // New state for Citizen ID
    const [showConfirmModal, setShowConfirmModal] = useState(false);
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
    const handleUnblockShop = async () => {
        try {
            console.log(id);
            await updateShopStatus({ shopId: id}).unwrap();
            setShop({ ...shop, isActive: 'ACTIVE' });
            alert('Cửa hàng đã được kích hoạt lại!');
            navigate('/shop-list');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Cập nhật thất bại!');
        }
    };

    const handleConfirmUnblock = () => {
        setShowConfirmModal(true);
    };

    const imagesBackground = shop?.images || [shop.backgroundImage];
    const imageRegistrationCertificate = shop?.images || [shop.registrationCertificate];
    const foodSafetyCertificate = shop?.images || [shop.foodSafetyCertificate];
    const citizenIdFront = shop?.images || [shop.owner.profile.citizenIDCardFront];
    const citizenIdBack = shop?.images || [shop?.owner.profile.citizenIDCardBack];

    const handleNextSide = () => {
        setCurrentSide(currentSide === 'front' ? 'back' : 'front');
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng ngừng hoạt động</h4>
                <CRow className="mb-3">
                    <CCol>
                        <label>Tên cửa hàng</label>
                        <CFormInput disabled value={shop.name}/>
                    </CCol>
                    <CCol>
                        <label>Chủ cửa hàng</label>
                        <CFormInput disabled value={shop.owner.username}/>
                    </CCol>
                    <CCol>
                        <label>Số điện thoại</label>
                        <CFormInput disabled value={shop.phone}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={10}>
                        <label>Địa chỉ</label>
                        <CFormInput disabled value={shop.address}/>
                    </CCol>
                    <CCol md={2}>
                        <label>Đánh giá</label>
                        <CFormInput disabled value={shop.rate}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={4}>
                        <label>Loại cửa hàng</label>
                        <CFormInput disabled value={shop.sellType}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ hoạt động</label>
                        <CFormInput disabled value={shop.openTime}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ đóng cửa</label>
                        <CFormInput disabled value={shop.closeTime}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={4}>
                        <label>Mã số thuế</label>
                        <CFormInput disabled value={shop.owner.profile.taxCode}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Trạng thái</label>
                        <CFormInput disabled value={shop.isActive}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Số khiếu nại</label>
                        <CFormInput disabled value={shop.owner.profile.taxCode}/>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowImageBackground(true)}
                        >
                            Ảnh cửa hàng
                        </label>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowImageRegistrationCertificate(true)}
                        >
                            Giấy phép kinh doanh
                        </label>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowFoodSafetyCertificate(true)}
                        >
                            Giấy phép vệ sinh an toàn thực phẩm
                        </label>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowCitizenId(true)}
                        >
                            Căn cước công dân
                        </label>
                    </CCol>
                </CRow>

                <CRow className="text-center mt-4">
                    <CCol md={6}>
                        <CButton color="success" className="w-100" onClick={handleConfirmUnblock}>
                            Mở lại cửa hàng
                        </CButton>
                    </CCol>
                    <CCol md={6}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            {/* Modal for shop background image */}
            <CModal visible={showImageBackground} onClose={() => setShowImageBackground(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center bg-white position-relative">
                    <FaArrowCircleLeft size={40} className="position-absolute start-0 ms-3" onClick={handleNextSide} />
                    {imagesBackground.length > 0 && (
                        <img src={imagesBackground[currentImageIndex]} alt="Ảnh cửa hàng" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                    )}
                    <FaArrowCircleRight size={40} className="position-absolute end-0 me-3" onClick={handleNextSide} />
                </CModalBody>
                <CModalFooter><CButton color="secondary" onClick={() => setShowImageBackground(false)}>Đóng</CButton></CModalFooter>
            </CModal>
            {/* Modal for registration certificate */}
            <CModal visible={showImageRegistrationCertificate} onClose={() => setShowImageRegistrationCertificate(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center bg-white position-relative">
                    <FaArrowCircleLeft size={40} className="position-absolute start-0 ms-3" onClick={handleNextSide} />
                    {imageRegistrationCertificate.length > 0 && (
                        <img src={imageRegistrationCertificate[currentImageIndex]} alt="Giấy phép kinh doanh" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
                    )}
                    <FaArrowCircleRight size={40} className="position-absolute end-0 me-3" onClick={handleNextSide} />
                </CModalBody>
                <CModalFooter><CButton color="secondary" onClick={() => setShowImageRegistrationCertificate(false)}>Đóng</CButton></CModalFooter>
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
                        borderRadius: '10px',
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextSide}
                    />
                    {foodSafetyCertificate.length > 0 && (
                        <img
                            src={foodSafetyCertificate[currentImageIndex]}
                            alt="Giấy phép vệ sinh an toàn thực phẩm"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }}
                        />
                    )}
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextSide}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowFoodSafetyCertificate(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Citizen ID */}
            <CModal visible={showCitizenId} onClose={() => setShowCitizenId(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px',
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextSide}
                    />
                    {currentSide === 'front' && citizenIdFront.length > 0 && (
                        <img
                            src={citizenIdFront[currentImageIndex]}
                            alt="Căn cước công dân mặt trước"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }}
                        />
                    )}
                    {currentSide === 'back' && citizenIdBack.length > 0 && (
                        <img
                            src={citizenIdBack[currentImageIndex]}
                            alt="Căn cước công dân mặt sau"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }}
                        />
                    )}
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextSide} // Change between front and back
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowCitizenId(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal thông báo chặn cửa hàng */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Bạn có muốn dừng hoạt động cửa hàng này không</CModalTitle>
                </CModalHeader>
                <CModalFooter>
                    <CButton color="danger" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton color="success" onClick={handleUnblockShop}>Xác nhận</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShopInactive;
