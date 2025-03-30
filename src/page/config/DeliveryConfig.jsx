import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CRow,
    CCol,
    CFormInput,
    CModalFooter,
    CFormCheck,
    CModalHeader,
    CModal,
    CModalBody,
    CPagination,
    CPaginationItem,
    CFormLabel,
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
    const [newItemValue, setNewItemValue] = useState('');
    const [newItemPublished, setNewItemPublished] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDeliveryMethod, setEditingDeliveryMethod] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deliveryMethodToDelete, setDeliveryMethodToDelete] = useState(null);

    // Debounced search effect
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0); // Reset page when search changes
        }, 400); // Delay for debounced search
        return () => clearTimeout(delay); // Cleanup timeout when search term changes
    }, [searchTerm]);

    // Fetch data using the API hook with the debounced search term
    const { data, error, isLoading, refetch } = useGetAllDeliveryMethodsQuery(
        { page, size, search: debouncedSearch }
    );

    const [createDeliveryMethod] = useCreateDeliveryMethodMutation();
    const [deleteDeliveryMethod] = useDeleteDeliveryMethodMutation();
    const [updateDeliveryMethod] = useUpdateDeliveryMethodMutation();

    const handleAddModal = async () => {
        if (!newItemName || !newItemValue) return;

        const newItem = {
            name: newItemName,
            value: newItemValue,
            published: newItemPublished,
        };

        await createDeliveryMethod(newItem);
        setNewItemName('');
        setNewItemValue('');
        setNewItemPublished(true);
        setShowAddModal(false);
        refetch();
    };

    const handleDeleteDeliveryMethod = async () => {
        if (deliveryMethodToDelete) {
            await deleteDeliveryMethod(deliveryMethodToDelete.id);
            setShowDeleteModal(false);
            refetch();
        }
    };

    const handleEditModal = (deliveryMethod) => {
        setEditingDeliveryMethod(deliveryMethod);
        setNewItemName(deliveryMethod.name);
        setNewItemValue(deliveryMethod.value);
        setNewItemPublished(deliveryMethod.published);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!newItemName || !newItemValue) return;

        const updatedItem = {
            id: editingDeliveryMethod.id,
            name: newItemName,
            value: newItemValue,
            published: newItemPublished,
        };

        await updateDeliveryMethod(updatedItem);
        setNewItemName('');
        setNewItemValue('');
        setNewItemPublished(true);
        setShowEditModal(false);
        refetch();
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
                            <CTableHeaderCell>Giá trị</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
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
                                    <CTableDataCell>{item.value}</CTableDataCell>
                                    <CTableDataCell>{item.published ? '✔️' : '❌'}</CTableDataCell>
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
                                                onClick={() => { setDeliveryMethodToDelete(item); setShowDeleteModal(true); }}
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

                {/* Pagination Controls */}
                <CRow className="justify-content-center mt-3">
                    <CPagination>
                        <CPaginationItem
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Trước
                        </CPaginationItem>
                        {Array.from({ length: data?.totalPages }, (_, i) => (
                            <CPaginationItem
                                key={i}
                                active={i === page}
                                onClick={() => setPage(i)}
                            >
                                {i + 1}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem
                            disabled={page + 1 === data?.totalPages}
                            onClick={() => setPage(page + 1)}
                        >
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

            <CCardBody>
                {renderTable()}
            </CCardBody>
        </CCard>
    );
};

export default DeliveryConfig;
