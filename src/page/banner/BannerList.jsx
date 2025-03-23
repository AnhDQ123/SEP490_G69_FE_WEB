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
    CSpinner
} from '@coreui/react';
import { FaArrowLeft, FaArrowRight, FaTrash, FaUpload } from 'react-icons/fa';
import {
    useGetBannersQuery,
    useDeleteBannerMutation,
    useUpdateBannerMutation
} from '../../service/bannerService';

const BannerList = () => {
    const [showBanner, setShowBanner] = useState(true);
    const [randomBanner, setRandomBanner] = useState(false);
    const [randomInterval, setRandomInterval] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [startIndex, setStartIndex] = useState(0);

    const { data, isLoading } = useGetBannersQuery({ page: 0, size: 10 });
    const [deleteBanner] = useDeleteBannerMutation();
    const [updateBanner] = useUpdateBannerMutation();

    const handleDeleteImage = async () => {
        if (selectedBanner) {
            await deleteBanner(selectedBanner);
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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && selectedBanner) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', 'Updated Banner');
            formData.append('description', 'Banner updated via UI');

            await updateBanner({ bannerId: selectedBanner, formData });
        }
        setShowModal(false);
    };

    const handleSave = () => {
        console.log({ showBanner, randomBanner, randomInterval });
    };

    const banners = data?.content || [];

    if (isLoading) return <CSpinner color="primary" />;

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
                                <CCol key={banner.imageId} md={6} className="text-center">
                                    <div className="banner-box p-3 border rounded d-flex flex-column align-items-center justify-content-center" style={{ height: '300px', width: '100%' }}>
                                        <div className="banner-image" style={{ width: '100%', height: '150px', background: banner.url ? `url(${banner.url})` : '#ccc', backgroundSize: 'cover' }}></div>
                                        <p className="mt-2">Banner #{banner.imageId}</p>
                                        <div className="d-flex gap-2 mt-2">
                                            <FaUpload size={20} style={{ cursor: 'pointer' }} onClick={() => handleUploadClick(banner.imageId)} />
                                            <FaTrash size={20} style={{ cursor: 'pointer', color: 'red' }} onClick={() => confirmDelete(banner.imageId)} />
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
                        label="Chọn hiển thị banner ngắu nhiên mỗi 30 phút"
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