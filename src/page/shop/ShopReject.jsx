import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CButton,
    CImage,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormTextarea
} from '@coreui/react';
import { FaArrowRight } from 'react-icons/fa';
import { useGetShopByIdQuery} from '../../service/shopService.js';

const ShopReject = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams();

    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);
    const [showFoodSafetyCertificate, setShowFoodSafetyCertificate] = useState(false);
    const [showCitizenId, setShowCitizenId] = useState(false);

    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu cửa hàng</p>;
    if (!shop) return <p>Không tìm thấy thông tin cửa hàng</p>;


    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng bị từ chối</h4>

                {/* Shop Details */}
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
                        <CFormInput disabled value={shop.isActive} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={12}>
                        <label>Lí do từ chối</label>
                        <CFormInput disabled value={shop.reason} />
                    </CCol>
                </CRow>

                {/* Images */}
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
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Giấy phép vệ sinh an toàn thực phẩm</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowFoodSafetyCertificate(true)}
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Căn cước công dân</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowCitizenId(true)}
                        />
                    </CCol>
                </CRow>

            </CCardBody>


            {/* Modal for Image: Shop's Background */}
            <CModal visible={showImageBackground} onClose={() => setShowImageBackground(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center">
                    <img
                        src={shop.backgroundImage}
                        alt="Ảnh cửa hàng"
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageBackground(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Image: Shop's Registration Certificate */}
            <CModal visible={showImageRegistrationCertificate} onClose={() => setShowImageRegistrationCertificate(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center">
                    <img
                        src={shop.registrationCertificate}
                        alt="Giấy phép kinh doanh"
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageRegistrationCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Image: Food Safety Certificate */}
            <CModal visible={showFoodSafetyCertificate} onClose={() => setShowFoodSafetyCertificate(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center">
                    <img
                        src={shop.foodSafetyCertificate}
                        alt="Giấy phép vệ sinh an toàn thực phẩm"
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowFoodSafetyCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for Image: Citizen ID */}
            <CModal visible={showCitizenId} onClose={() => setShowCitizenId(false)} size="lg" centered>
                <CModalBody className="d-flex justify-content-center align-items-center">
                    <img
                        src={shop.citizenIDCardFront}
                        alt="Căn cước công dân"
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowCitizenId(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShopReject;
