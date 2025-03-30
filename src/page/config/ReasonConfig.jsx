import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CFormSelect,
    CFormLabel,
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
    CPaginationItem
} from '@coreui/react';
import { useGetConfigsByCategoryQuery, useCreateConfigMutation, useDeleteConfigMutation, useUpdateConfigMutation } from '../../service/reasonConfigService'; // Import hooks

const ReasonConfig = () => {
    const navigate = useNavigate();
    const [configOptions, setConfigOptions] = useState([
        { value: 'ORDER_DECLINE_REASON', label: 'Lý do từ chối nhận đơn' },
        { value: 'RETURN_REASON', label: 'Lý do từ chối trả hàng' },
        { value: 'ORDER_CANCEL_REASON', label: 'Lý do hủy đơn' },
        { value: 'REPORT_REASON', label: 'Lý do khiếu nại' },
    ]);
    const [configType, setConfigType] = useState('ORDER_DECLINE_REASON'); // Default value should match API
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState(''); // For search input
    const [debouncedSearch, setDebouncedSearch] = useState(''); // For debounced search

    // Debouncing search input
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0); // Reset page when search changes
        }, 400);
        return () => clearTimeout(delay);  // Cleanup timeout
    }, [searchTerm]);

    // Fetch data from API using useGetConfigsByCategoryQuery hook
    const { data: configData, isLoading, isError, refetch } = useGetConfigsByCategoryQuery({
        category: configType,  // The category of config data
        page,      // Current page
        size,      // Items per page
        search: debouncedSearch, // Debounced search term
    });

    const [newItemName, setNewItemName] = useState('');
    const [newItemValue, setNewItemValue] = useState('');
    const [newItemPublished, setNewItemPublished] = useState(true); // Default to "Hiển thị"
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // State to show edit modal
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to show delete confirmation modal
    const [editingConfig, setEditingConfig] = useState(null); // Store the config being edited
    const [configToDelete, setConfigToDelete] = useState(null); // Store the config being deleted

    const [createConfig] = useCreateConfigMutation();
    const [deleteConfig] = useDeleteConfigMutation();
    const [updateConfig] = useUpdateConfigMutation();

    const handleAddModal = async () => {
        if (!newItemName || !newItemValue) return;

        const newItem = {
            name: newItemName,
            value: newItemValue,
            published: newItemPublished,
        };

        // Call API to create new config
        await createConfig({ category: configType, ...newItem });

        // Reset form
        setNewItemName('');
        setNewItemValue('');
        setNewItemPublished(true);
        setShowAddModal(false);
        refetch(); // Refetch the data after adding
    };

    const handleDeleteConfig = async () => {
        if (configToDelete) {
            // Update the config status to "DELETED"
            await updateConfig({ id: configToDelete.id, value: configToDelete.value, published: false }); // assuming "published" is used as status
            setShowDeleteModal(false);
            refetch(); // Refetch the data after deleting
        }
    };

    const handleUpdateConfig = async (id, updatedValue) => {
        await updateConfig({ id, value: updatedValue });
        refetch(); // Refetch the data after update
    };

    // Handle opening the edit modal with the current config data
    const handleEditModal = (config) => {
        setEditingConfig(config); // Set the config being edited
        setNewItemName(config.name); // Set the current name value
        setNewItemValue(config.value); // Set the current value
        setNewItemPublished(config.published); // Set the current published status
        setShowEditModal(true); // Show the edit modal
    };

    const handleSaveEdit = async () => {
        if (!newItemName || !newItemValue) return;

        const updatedItem = {
            id: editingConfig.id,
            name: newItemName,
            value: newItemValue,
            published: newItemPublished,
        };

        // Update the config in the DB
        await updateConfig(updatedItem);

        // Reset form and close modal
        setNewItemName('');
        setNewItemValue('');
        setNewItemPublished(true);
        setShowEditModal(false);
        refetch(); // Refetch the data after updating
    };

    const renderTable = () => {
        if (isLoading) return <div>🔄 Đang tải dữ liệu...</div>;
        if (isError) return <div>❌ Lỗi khi lấy dữ liệu cấu hình!</div>;

        return (
            <>
                <CRow className="justify-content-between mb-3">
                    <CCol><h5>Danh sách cấu hình</h5></CCol>
                    <CCol className="text-end">
                        <CButton size="sm" color="primary" onClick={() => setShowAddModal(true)}>
                            Thêm mới
                        </CButton>
                    </CCol>
                </CRow>

                <CTable striped hover responsive bordered className="table-sm">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tên cấu hình</CTableHeaderCell>
                            <CTableHeaderCell>Giá trị</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {configData?.content?.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={4} className="text-center text-muted">
                                    Không có cấu hình nào phù hợp
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            configData?.content?.map((item) => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.value}</CTableDataCell>
                                    <CTableDataCell>{item.status}</CTableDataCell>
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
                                                onClick={() => { setConfigToDelete(item); setShowDeleteModal(true); }}
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
                        {Array.from({ length: configData?.totalPages }, (_, i) => (
                            <CPaginationItem
                                key={i}
                                active={i === page}
                                onClick={() => setPage(i)}
                            >
                                {i + 1}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem
                            disabled={page + 1 === configData?.totalPages}
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
                        <CFormLabel>Chọn loại cấu hình</CFormLabel>
                        <CFormSelect value={configType} onChange={(e) => setConfigType(e.target.value)}>
                            {configOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                </CRow>
            </CCardHeader>

            <CCardBody>
                {renderTable()}
            </CCardBody>

            {/* Modal Thêm nội dung cấu hình */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>
                    <strong>Thêm cấu hình mới</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên cấu hình</CFormLabel>
                    <CFormInput
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Nhập tên cấu hình..."
                        className="mb-3"
                    />
                    <CFormLabel>Giá trị / Nội dung</CFormLabel>
                    <CFormInput
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder="Nhập giá trị..."
                        className="mb-3"
                    />
                    <CFormCheck
                        label="Hiển thị"
                        checked={newItemPublished}
                        onChange={(e) => setNewItemPublished(e.target.checked)}
                    />
                    <CFormCheck
                        label="Không hiển thị"
                        checked={!newItemPublished}
                        onChange={(e) => setNewItemPublished(!e.target.checked)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddModal}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Chỉnh sửa nội dung cấu hình */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader closeButton>
                    <strong>Chỉnh sửa cấu hình</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên cấu hình</CFormLabel>
                    <CFormInput
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Nhập tên cấu hình..."
                        className="mb-3"
                    />
                    <CFormLabel>Giá trị / Nội dung</CFormLabel>
                    <CFormInput
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder="Nhập giá trị..."
                        className="mb-3"
                    />
                    <CFormCheck
                        label="Hiển thị"
                        checked={newItemPublished}
                        onChange={(e) => setNewItemPublished(e.target.checked)}
                    />
                    <CFormCheck
                        label="Không hiển thị"
                        checked={!newItemPublished}
                        onChange={(e) => setNewItemPublished(!e.target.checked)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Xác nhận xóa */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader closeButton>
                    <strong>Xác nhận xóa</strong>
                </CModalHeader>
                <CModalBody>
                    <p>Bạn có chắc chắn muốn xóa mục này không?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDeleteConfig}>Xóa</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ReasonConfig;
