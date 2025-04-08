import React, {useState} from 'react';
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
    CSpinner,
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import {FaArrowLeft, FaArrowRight, FaPen, FaTrash, FaUpload, FaPlus} from 'react-icons/fa';
import {
    useGetBannersQuery,
    useDeleteBannerMutation,
    useUpdateBannerMutation,
    useGetAllBannersQuery
} from '../../service/bannerService';

const BannerList = () => {
    const [showBanner, setShowBanner] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedBannerUrl, setSelectedBannerUrl] = useState('');
    const [startIndex, setStartIndex] = useState(0);

    const {data, isLoading, refetch} = useGetBannersQuery({page: 0, size: 5});
    const {data: allBannersData} = useGetAllBannersQuery();
    const [deleteBanner] = useDeleteBannerMutation();
    const [updateBanner] = useUpdateBannerMutation();

    const handleDeleteImage = async () => {
        if (selectedBanner) {
            await deleteBanner(selectedBanner);
            await refetch();
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

    const handleCloseModal = async () => {
        if (selectedBanner && selectedBannerUrl) {
            await updateBanner({id: selectedBanner, url: selectedBannerUrl});
            await refetch();
        }
        setShowModal(false);
        setSelectedBannerUrl('');
    };

    const handleSave = () => {
        console.log({showBanner});
    };

    const banners = data?.content || [];
    const allBanners = allBannersData?.content || [];

    if (isLoading) return <CSpinner color="primary"/>;

    const handleNext = () => {
        if (startIndex + 2 < banners.length) {
            setStartIndex(startIndex + 2);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 2);
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
                        <FaArrowLeft className="position-absolute start-0" size={32} style={{cursor: 'pointer'}}
                                     onClick={handlePrev}/>
                        <CRow className="flex-nowrap overflow-hidden justify-content-center" style={{width: '80%'}}>
                            {banners.slice(startIndex, startIndex + 2).map((banner, index) => (
                                <CCol key={banner.id} md={6} className="text-center">
                                    <div
                                        className="banner-box p-3 border rounded d-flex flex-column align-items-center justify-content-center"
                                        style={{height: '300px', width: '100%'}}>
                                        {banner.url ? (
                                            <>
                                                <div className="banner-image" style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    background: `url(${banner.url})`,
                                                    backgroundSize: 'cover'
                                                }}></div>
                                                <p className="mt-2">Banner {startIndex + index + 1}</p>
                                                <div className="d-flex gap-2 mt-2">
                                                    <FaPen size={20} style={{cursor: 'pointer', color: 'blue'}}
                                                           onClick={() => handleUploadClick(banner.id)}/>
                                                    <FaTrash size={20} style={{cursor: 'pointer', color: 'red'}}
                                                             onClick={() => confirmDelete(banner.id)}/>
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                className="d-flex flex-column align-items-center justify-content-center"
                                                style={{height: '100%', cursor: 'pointer'}}
                                                onClick={() => handleUploadClick(banner.id)}
                                            >
                                                <FaPlus size={48} style={{color: 'gray'}}/>
                                                <p className="mt-2">Thêm banner</p>
                                            </div>
                                        )}
                                    </div>
                                </CCol>
                            ))}
                        </CRow>
                        <FaArrowRight className="position-absolute end-0" size={32} style={{cursor: 'pointer'}}
                                      onClick={handleNext}/>
                    </div>
                    <div className="mt-4 d-flex justify-content-center">
                        <CButton color="primary" onClick={handleSave}>Lưu</CButton>
                    </div>
                </CForm>
            </CCardBody>

            {/* Modal Upload (Danh sách Banner) */}
            <CModal visible={showModal} onClose={() => {
                setShowModal(false);
                setSelectedBannerUrl('');
            }}>
                <CModalHeader>Chọn Banner để Upload</CModalHeader>
                <CModalBody>
                    <CListGroup>
                        {allBanners.map((banner) => (
                            <CListGroupItem
                                key={banner.id}
                                onClick={() => setSelectedBannerUrl(banner.url)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedBannerUrl === banner.url ? '#d3d3d3' : 'transparent',
                                    transition: 'background-color 0.3s',
                                }}
                                className={selectedBannerUrl === banner.url ? 'border-primary' : ''}
                            >
                                <div className="d-flex justify-content-between">
                                    <div>Banner #{banner.id}</div>
                                    <img
                                        src={banner.url}
                                        alt={`Banner ${banner.id}`}
                                        width="50"
                                        height="50"
                                        style={{objectFit: 'cover'}}
                                    />
                                </div>
                            </CListGroupItem>
                        ))}
                    </CListGroup>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => {
                        setShowModal(false);
                        setSelectedBannerUrl('');
                    }}>Đóng</CButton>
                    <CButton color="primary" onClick={handleCloseModal}>Lưu</CButton>
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