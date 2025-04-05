import React, { useState, useEffect } from 'react';
import {
    CCard, CCardBody, CCardHeader,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CButton, CRow, CCol, CFormInput, CModalFooter, CFormCheck, CModalHeader,
    CModal, CModalBody, CPagination, CPaginationItem, CFormLabel
} from '@coreui/react';
import {
    useGetAllDeliveryMethodsQuery,
    useCreateDeliveryMethodMutation,
    useDeleteDeliveryMethodMutation,
    useUpdateDeliveryMethodMutation,
} from '../../service/deliveryMethodService';

const DeliveryConfig = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const [newItemName, setNewItemName] = useState('');
    const [newItemFee, setNewItemFee] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');

    const [newItemPublished, setNewItemPublished] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDeliveryMethod, setEditingDeliveryMethod] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deliveryMethodToDelete, setDeliveryMethodToDelete] = useState(null);

    const [successModal, setSuccessModal] = useState({
        visible: false,
        message: ''
    });

    const { data, error, isLoading, refetch } = useGetAllDeliveryMethodsQuery(
        { page, size, search: debouncedSearch }
    );

    const [createDeliveryMethod] = useCreateDeliveryMethodMutation();
    const [deleteDeliveryMethod] = useDeleteDeliveryMethodMutation();
    const [updateDeliveryMethod] = useUpdateDeliveryMethodMutation();

    // Debounced search
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const showSuccessModal = (message) => {
        setSuccessModal({ visible: true, message });
        setTimeout(() => {
            setSuccessModal({ visible: false, message: '' });
            refetch();
        }, 2000);
    };

    const handleAddModal = async () => {
        if (!newItemName || !newItemFee) return;
        const newItem = {
            name: newItemName,
            description: newItemDescription,
            fee: parseFloat(newItemFee),
            status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
        };

        await createDeliveryMethod(newItem);
        setNewItemName('');
        setNewItemDescription('');
        setNewItemFee('');
        setNewItemPublished(true);
        setShowAddModal(false);
        showSuccessModal('Thêm phương thức giao hàng thành công!');
    };

    const handleDeleteDeliveryMethod = async () => {
        if (deliveryMethodToDelete) {
            await deleteDeliveryMethod(deliveryMethodToDelete.id);
            setShowDeleteModal(false);
            showSuccessModal('Xóa phương thức giao hàng thành công!');
        }
    };

    const handleEditModal = (deliveryMethod) => {
        setEditingDeliveryMethod(deliveryMethod);
        setNewItemName(deliveryMethod.name);
        setNewItemDescription(deliveryMethod.description);
        setNewItemFee(deliveryMethod.fee);
        setNewItemPublished(deliveryMethod.status === 'ACTIVE');
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!newItemName || !newItemFee || !editingDeliveryMethod?.id) return;

        const updatedItem = {
            id: editingDeliveryMethod.id,
            name: newItemName,
            description: newItemDescription,
            fee: parseFloat(newItemFee),
            status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
        };

        await updateDeliveryMethod(updatedItem); // id đi vào URL, phần còn lại đi vào body
        setNewItemName('');
        setNewItemDescription('');
        setNewItemFee('');
        setNewItemPublished(true);
        setShowEditModal(false);
        showSuccessModal('Cập nhật phương thức giao hàng thành công!');
    };



    const renderTable = () => {
        if (isLoading) return <div>🔄 Đang tải dữ liệu...</div>;
        if (error) return <div>❌ Lỗi khi lấy dữ liệu phương thức giao hàng!</div>;

        return (
            <>
                <CRow className="justify-content-between mb-3">
                    <CCol>
                        <h5>Danh sách phương thức giao hàng</h5>
                    </CCol>
                    <CCol className="text-end">
                        <CButton size="sm" color="primary" onClick={() => setShowAddModal(true)}>
                            Thêm mới
                        </CButton>
                    </CCol>
                </CRow>

                <CTable striped hover responsive bordered className="table-sm">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tên phương thức</CTableHeaderCell>
                            <CTableHeaderCell>Mô tả</CTableHeaderCell>
                            <CTableHeaderCell>Giá</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.content?.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={4} className="text-center text-muted">
                                    Không có phương thức giao hàng nào phù hợp
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            data?.content?.map((item) => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.description}</CTableDataCell>
                                    <CTableDataCell>{item.fee}</CTableDataCell>
                                    <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                                    <CTableDataCell>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CButton
                                                size="sm"
                                                color="secondary"
                                                onClick={() => handleEditModal(item)}
                                                style={{ width: '45%' }}
                                            >
                                                Chỉnh sửa
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                color="danger"
                                                onClick={() => {
                                                    setDeliveryMethodToDelete(item);
                                                    setShowDeleteModal(true);
                                                }}
                                                style={{ width: '45%' }}
                                            >
                                                Xóa
                                            </CButton>
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>

                <CRow className="justify-content-center mt-3">
                    <CPagination>
                        <CPaginationItem disabled={page === 0} onClick={() => setPage(page - 1)}>
                            Trước
                        </CPaginationItem>
                        {Array.from({ length: data?.totalPages || 1 }, (_, i) => (
                            <CPaginationItem key={i} active={i === page} onClick={() => setPage(i)}>
                                {i + 1}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem disabled={page + 1 === data?.totalPages} onClick={() => setPage(page + 1)}>
                            Sau
                        </CPaginationItem>
                    </CPagination>
                </CRow>
            </>
        );
    };

    return (
        <CCard>
            <CCardHeader>
                <CRow className="align-items-end justify-content-between">
                    <CCol md={4}>
                        <h5>Quản lý phương thức giao hàng</h5>
                    </CCol>
                </CRow>
            </CCardHeader>

            <CCardBody>{renderTable()}</CCardBody>

            {/* Modal create */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>Thêm phương thức giao hàng</CModalHeader>
                <CModalBody>
                    <CFormInput className="mb-3" placeholder="Tên phương thức" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                    <CFormInput className="mb-3" placeholder="Mô tả" value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} />
                    <CFormInput className="mb-3" placeholder="Giá" value={newItemFee} onChange={(e) => setNewItemFee(e.target.value)} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddModal}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Edit */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader closeButton>Chỉnh sửa phương thức giao hàng</CModalHeader>
                <CModalBody>
                    <CFormInput className="mb-3" placeholder="Tên phương thức" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                    <CFormInput className="mb-3" placeholder="Mô tả" value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} />
                    <CFormInput className="mb-3" placeholder="Giá" value={newItemFee} onChange={(e) => setNewItemFee(e.target.value)} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Delete */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader closeButton>Xác nhận xóa</CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn xóa phương thức này không?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDeleteDeliveryMethod}>Xóa</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal message */}
            <CModal visible={successModal.visible} onClose={() => setSuccessModal({ visible: false, message: '' })}>
                <CModalHeader closeButton>Thành công</CModalHeader>
                <CModalBody>{successModal.message}</CModalBody>
            </CModal>
        </CCard>
    );
};

export default DeliveryConfig;
