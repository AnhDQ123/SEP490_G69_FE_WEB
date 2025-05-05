import React, { useState, useEffect } from 'react';
import {
    CCard, CCardBody, CCardHeader, CButton, CModal, CModalHeader, CModalBody, CModalFooter,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormSelect,
} from '@coreui/react';
import { FaTrash } from 'react-icons/fa';
import {
    useGetBannersQuery,
    useDeleteBannerMutation,
    useActiveBannerMutation,
    useInactiveBannerMutation,
} from '../../service/bannerService';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {useGetShopByIdQuery, useGetShopQuery} from "../../service/shopService.js";

const BannerList = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [successModal, setSuccessModal] = useState({ visible: false, message: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch banners
    const { data: bannerData, isLoading: isBannerLoading, refetch } = useGetBannersQuery({ page: currentPage - 1, size: itemsPerPage });
    const { data: shopData, isLoading: isShopLoading } = useGetShopQuery();
    const [mergedBanners, setMergedBanners] = useState([]);
    console.log(bannerData);
    console.log(shopData);
    useEffect(() => {
        if (
            !isBannerLoading &&
            !isShopLoading &&
            bannerData?.content &&
            shopData?.content
        ) {
            const bannerList = bannerData.content;
            const shopList = shopData.content;

            const shopMap = {};
            shopList.forEach((shop) => {
                const ownerId = shop?.owner?.profile?.id;
                if (ownerId) {
                    shopMap[ownerId] = shop;
                }
            });

            const merged = bannerList.map((banner) => {
                const shop = shopMap[banner.ownerId]; // banner.ownerId phải đúng kiểu với shopMap key
                return {
                    ...banner,
                    shopName: shop?.name || 'Không rõ',
                };
            });

            setMergedBanners(merged);
        }
    }, [bannerData, shopData, isBannerLoading, isShopLoading]);
    // Mutation hooks
    const [deleteBanner] = useDeleteBannerMutation();
    const [activeBanner] = useActiveBannerMutation(); // API for activating banners
    const [inactiveBanner] = useInactiveBannerMutation(); // API for deactivating banners

    const banners = mergedBanners || [];
    console.log(banners);
    const ShopNameCell = ({ shopName }) => {
        // const { data, isLoading, isError } = useGetShopByIdQuery(shopId);

        if (!shopName) return <span>Không xác định</span>;

        return <span>{shopName || 'Không tên'}</span>;
    };

    const confirmDelete = (id) => {
        setSelectedBanner(id);
        setShowDeleteModal(true);
    };

    const handleDeleteImage = async () => {
        if (selectedBanner) {
            await deleteBanner(selectedBanner);
            await refetch();
            setShowDeleteModal(false);
            setSuccessModal({ visible: true, message: 'Xoá banner thành công!' });
            setTimeout(() => {
                setSuccessModal({ visible: false, message: '' });
            }, 2000);
        }
    };

    const handleActivateBanner = async (banner) => {
        await activeBanner(banner.id); // Kích hoạt banner
        await refetch(); // Làm mới danh sách banner
    };

    const handleDeactivateBanner = async (banner) => {
        await inactiveBanner(banner.id); // Tắt banner
        await refetch(); // Làm mới danh sách banner
    };

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = banners.findIndex(b => b.id === active.id);
            const newIndex = banners.findIndex(b => b.id === over.id);
            const newList = arrayMove(banners, oldIndex, newIndex);
            // We don't need to manually update the banner list state here as we will rely on the refetch
        }
    };

    return (
        <>
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h4>Danh sách Banner</h4>
                </CCardHeader>
                <CCardBody>
                    <CTable striped hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Ảnh</CTableHeaderCell>
                                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                                <CTableHeaderCell>Hành động</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    {banners.map((banner) => (
                                        <CTableRow key={banner.id}>

                                            <CTableDataCell>
                                                {banner.url && (
                                                    <img src={banner.url} alt="banner" width={80} height={60} style={{ objectFit: 'cover' }} />
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex gap-2">
                                                    {banner.status === 'ACTIVE' ? (
                                                        <>
                                                            <CButton
                                                                color="primary"
                                                                size="sm"
                                                                onClick={() => handleActivateBanner(banner)}
                                                                className={banner.status === 'ACTIVE' ? 'active-btn' : 'inactive-btn'}
                                                            >
                                                                Bật
                                                            </CButton>
                                                            <CButton
                                                                color="secondary"
                                                                size="sm"
                                                                onClick={() => handleDeactivateBanner(banner)}
                                                                className={banner.status === 'ACTIVE' ? 'inactive-btn' : 'active-btn'}
                                                            >
                                                                Tắt
                                                            </CButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CButton
                                                                color="primary"
                                                                size="sm"
                                                                onClick={() => handleActivateBanner(banner)}
                                                                className={banner.status === 'INACTIVE' ? 'inactive-btn' : 'active-btn'}
                                                            >
                                                                Bật
                                                            </CButton>
                                                            <CButton
                                                                color="secondary"
                                                                size="sm"
                                                                onClick={() => handleDeactivateBanner(banner)}
                                                                className={banner.status === 'INACTIVE' ? 'active-btn' : 'inactive-btn'}
                                                            >
                                                                Tắt
                                                            </CButton>
                                                        </>
                                                    )}
                                                </div>
                                            </CTableDataCell>



                                            <CTableDataCell>
                                                <CButton color="danger" size="sm" onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(banner.id);
                                                }}>
                                                    <FaTrash />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </CTableBody>
                    </CTable>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Trang <strong>{currentPage}</strong> / {Math.ceil(bannerData?.totalElements / itemsPerPage)}
                        </span>
                        <div>
                            <CButton
                                size="sm"
                                className="me-2"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </CButton>
                            <CButton
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(bannerData?.totalElements / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(bannerData?.totalElements / itemsPerPage)}
                            >
                                Sau
                            </CButton>
                        </div>
                    </div>
                </CCardBody>

                {/* Modals */}
                <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <CModalHeader>Xác nhận xoá</CModalHeader>
                    <CModalBody>Bạn có chắc muốn xoá banner này?</CModalBody>
                    <CModalFooter>
                        <CButton color="danger" onClick={handleDeleteImage}>Xoá</CButton>
                        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Huỷ</CButton>
                    </CModalFooter>
                </CModal>

                <CModal visible={successModal.visible} onClose={() => setSuccessModal({ visible: false, message: '' })}>
                    <CModalHeader closeButton>Thành công</CModalHeader>
                    <CModalBody>{successModal.message}</CModalBody>
                </CModal>
            </CCard>
        </>
    );
};

export default BannerList;
