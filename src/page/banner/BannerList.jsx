import React, {useState, useEffect} from 'react';
import {
    CCard, CCardBody, CCardHeader, CButton, CModal, CModalHeader, CModalBody, CModalFooter,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormSelect,
    CFormSwitch
} from '@coreui/react';
import {FaTrash, FaPlus} from 'react-icons/fa';
import {
    useGetBannersQuery,
    useDeleteBannerMutation,
    useUpdateBannerMutation,
    useGetAllBannersQuery
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
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableRow = ({banner, index, onToggleStatus, onDelete}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: banner.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
    };

    return (
        <CTableRow ref={setNodeRef} style={style}>
            <CTableDataCell {...attributes} {...listeners}>Banner #{banner.id}</CTableDataCell>
            <CTableDataCell>{banner.ownerId?.name || '---'}</CTableDataCell>
            <CTableDataCell>
                {banner.url && (
                    <img src={banner.url} alt="banner" width={80} height={60} style={{objectFit: 'cover'}}/>
                )}
            </CTableDataCell>
            <CTableDataCell>
                <CFormSwitch
                    label={banner.status === 'ACTIVE' ? 'Đang hiển thị' : 'Ẩn'}
                    checked={banner.status === 'ACTIVE'}
                    onChange={(e) => onToggleStatus(banner, e.target.checked)}
                />
            </CTableDataCell>
            <CTableDataCell>
                <CButton color="danger" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onDelete(banner.id);
                }}>
                    <FaTrash/>
                </CButton>
            </CTableDataCell>
        </CTableRow>
    );
};

const BannerList = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedBannerUrl, setSelectedBannerUrl] = useState('');
    const [bannerList, setBannerList] = useState([]);
    const [successModal, setSuccessModal] = useState({visible: false, message: ''});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const {data, isLoading, refetch} = useGetBannersQuery({page: currentPage - 1, size: itemsPerPage});
    const {data: allBannersData} = useGetAllBannersQuery();
    const [deleteBanner] = useDeleteBannerMutation();
    const [updateBanner] = useUpdateBannerMutation();


    const banners = data?.content || [];
    const allBanners = allBannersData?.content || [];

    useEffect(() => {
        setBannerList(banners);
    }, [banners]);

    const confirmDelete = (id) => {
        setSelectedBanner(id);
        setShowDeleteModal(true);
    };

    const handleDeleteImage = async () => {
        if (selectedBanner) {
            await deleteBanner(selectedBanner);
            await refetch();
            setShowDeleteModal(false);
            setSuccessModal({visible: true, message: 'Xoá banner thành công!'});
            setTimeout(() => {
                setSuccessModal({visible: false, message: ''});
            }, 2000);
        }
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

    const handleToggleStatus = async (banner, checked) => {
        const newStatus = checked ? 'ACTIVE' : 'INACTIVE';
        await updateBanner({id: banner.id, status: newStatus});
        await refetch();
    };

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex = bannerList.findIndex(b => b.id === active.id);
            const newIndex = bannerList.findIndex(b => b.id === over.id);
            const newList = arrayMove(bannerList, oldIndex, newIndex);
            setBannerList(newList);
        }
    };

    return (
        <>
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h4>Danh sách Banner</h4>
                </CCardHeader>
                <CCardBody>
                    <div className="d-flex mb-3 gap-2">
                        <CFormInput placeholder="Tìm kiếm theo tên cửa hàng..."/>
                        <CFormSelect
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            options={[{ label: 'Hiển thị 5', value: 5 }, { label: 'Hiển thị 10', value: 10 }]}
                        />
                    </div>
                    <CTable striped hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Thứ tự banner</CTableHeaderCell>
                                <CTableHeaderCell>Chủ banner</CTableHeaderCell>
                                <CTableHeaderCell>Ảnh</CTableHeaderCell>
                                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                                <CTableHeaderCell>Hành động</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={bannerList.map(b => b.id)}
                                                 strategy={verticalListSortingStrategy}>
                                    {bannerList.map((banner, index) => (
                                        <SortableRow
                                            key={banner.id}
                                            banner={banner}
                                            index={index}
                                            onToggleStatus={handleToggleStatus}
                                            onDelete={confirmDelete}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </CTableBody>
                    </CTable>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                            <span>
                                Trang <strong>{currentPage}</strong> / {Math.ceil(data?.totalElements / itemsPerPage)}
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
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data?.totalElements / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(data?.totalElements / itemsPerPage)}
                            >
                                Sau
                            </CButton>
                        </div>
                    </div>
                </CCardBody>

                <CModal visible={showModal} onClose={() => {
                    setShowModal(false);
                    setSelectedBannerUrl('');
                }}>
                    <CModalHeader>Chọn Banner để Upload</CModalHeader>
                    <CModalBody>
                        {allBanners.map((banner) => (
                            <div
                                key={banner.id}
                                className="d-flex justify-content-between align-items-center p-2 border mb-2"
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedBannerUrl === banner.url ? '#eee' : 'transparent'
                                }}
                                onClick={() => setSelectedBannerUrl(banner.url)}
                            >
                                <span>Banner #{banner.id}</span>
                                <img src={banner.url} alt="option" width={60} height={40} style={{objectFit: 'cover'}}/>
                            </div>
                        ))}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowModal(false)}>Đóng</CButton>
                        <CButton color="primary" onClick={handleCloseModal}>Lưu</CButton>
                    </CModalFooter>
                </CModal>

                <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <CModalHeader>Xác nhận xoá</CModalHeader>
                    <CModalBody>Bạn có chắc muốn xoá banner này?</CModalBody>
                    <CModalFooter>
                        <CButton color="danger" onClick={handleDeleteImage}>Xoá</CButton>
                        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Huỷ</CButton>
                    </CModalFooter>
                </CModal>

                <CModal visible={successModal.visible} onClose={() => setSuccessModal({visible: false, message: ''})}>
                    <CModalHeader closeButton>Thành công</CModalHeader>
                    <CModalBody>{successModal.message}</CModalBody>
                </CModal>
            </CCard>
        </>
    );
};

export default BannerList;
