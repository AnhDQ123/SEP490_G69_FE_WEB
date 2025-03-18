import React, { useState } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CFormCheck,
    CButton,
    CForm,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { FaArrowLeft, FaArrowRight, FaTrash, FaUpload } from 'react-icons/fa';

const BannerList = () => {
    const [showBanner, setShowBanner] = useState(true);
    const [randomBanner, setRandomBanner] = useState(false);
    const [randomInterval, setRandomInterval] = useState(false);
    const [banners, setBanners] = useState([
        { id: 1, name: 'Banner 1', imageUrl: '' },
        { id: 2, name: 'Banner 2', imageUrl: '' },
        { id: 3, name: 'Banner 3', imageUrl: '' },
        { id: 4, name: 'Banner 4', imageUrl: '' },
        { id: 5, name: 'Banner 5', imageUrl: '' },
    ]);
    const [startIndex, setStartIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);

    const handleNext = () => {
        if (startIndex + 2 < banners.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const handleDeleteImage = () => {
        if (selectedBanner !== null) {
            setBanners(banners.map(banner =>
                banner.id === selectedBanner ? { ...banner, imageUrl: '' } : banner
            ));
        }
        setShowDeleteModal(false);
    };

    const confirmDelete = (id) => {
        setSelectedBanner(id);
        setShowDeleteModal(true);
    };

    const handleUploadClick = (id) => {
        setSelectedBanner(id);
        setShowModal(true);
    };

    const handleFileChange = (event) => {
        if (selectedBanner !== null) {
            const file = event.target.files[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setBanners(banners.map(banner =>
                    banner.id === selectedBanner ? { ...banner, imageUrl } : banner
                ));
            }
        }
        setShowModal(false);
    };

    const handleSave = () => {
        console.log({ showBanner, randomBanner, randomInterval, banners });
    };

    return (
        <CCard>
            <CCardHeader>
                <h3>Cài đặt Banner</h3>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CFormCheck
                        label="Hiển thị Banner"
                        checked={showBanner}
                        onChange={() => setShowBanner(!showBanner)}
                    />
                    <h5 className="mt-3">Các Banner đang hiển thị</h5>
                    <div className="d-flex justify-content-center align-items-center position-relative">
                        <FaArrowLeft className="position-absolute start-0" size={32} style={{ cursor: 'pointer' }} onClick={handlePrev} />
                        <CRow className="flex-nowrap overflow-hidden justify-content-center" style={{ width: '80%' }}>
                            {banners.slice(startIndex, startIndex + 2).map((banner) => (
                                <CCol key={banner.id} md={6} className="text-center">
                                    <div className="banner-box p-3 border rounded d-flex flex-column align-items-center justify-content-center" style={{ height: '300px', width: '100%' }}>
                                        <div className="banner-image" style={{ width: '100%', height: '150px', background: banner.imageUrl ? `url(${banner.imageUrl})` : '#ccc', backgroundSize: 'cover' }}></div>
                                        <p className="mt-2">{banner.name}</p>
                                        <div className="d-flex gap-2 mt-2">
                                            <FaUpload size={20} style={{ cursor: 'pointer' }} onClick={() => handleUploadClick(banner.id)} />
                                            <FaTrash size={20} style={{ cursor: 'pointer', color: 'red' }} onClick={() => confirmDelete(banner.id)} />
                                        </div>
                                    </div>
                                </CCol>
                            ))}
                        </CRow>
                        <FaArrowRight className="position-absolute end-0" size={32} style={{ cursor: 'pointer' }} onClick={handleNext} />
                    </div>
                    <CFormCheck
                        className="mt-3"
                        label="Chọn hiển thị banner ngẫu nhiên"
                        checked={randomBanner}
                        onChange={() => setRandomBanner(!randomBanner)}
                    />
                    <CFormCheck
                        className="mt-2"
                        label="Chọn hiển thị banner ngẫu nhiên mỗi 30 phút"
                        checked={randomInterval}
                        onChange={() => setRandomInterval(!randomInterval)}
                    />
                    <div className="mt-4 d-flex justify-content-center">
                        <CButton color="primary" onClick={handleSave}>Lưu</CButton>
                    </div>
                </CForm>
            </CCardBody>

            {/* Modal Upload */}
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader>Upload Ảnh</CModalHeader>
                <CModalBody>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Confirm Delete */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>Xác nhận xóa</CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn xóa ảnh này không?</CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={handleDeleteImage}>Xóa</CButton>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default BannerList;
