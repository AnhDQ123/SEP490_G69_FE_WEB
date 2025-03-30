import React, { useState, useEffect } from 'react';
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
    const [configOptions] = useState([
        { value: 'ORDER_DECLINE_REASON', label: 'Lý do từ chối nhận đơn' },
        { value: 'RETURN_REASON', label: 'Lý do từ chối trả hàng' },
        { value: 'ORDER_CANCEL_REASON', label: 'Lý do hủy đơn' },
        { value: 'REPORT_REASON', label: 'Lý do khiếu nại' },
    ]);
    const [configType, setConfigType] = useState('ORDER_DECLINE_REASON'); // Default value should match API
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchTerm] = useState(''); // For search input
    const [debouncedSearch, setDebouncedSearch] = useState(''); // For debounced search
    const [successModal, setSuccessModal] = useState({
        visible: false,
        message: ''
    });
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

    const showSuccessModal = (message) => {
        setSuccessModal({ visible: true, message });

        setTimeout(() => {
            setSuccessModal({ visible: false, message: '' });
            refetch(); // hoặc window.location.reload()
        }, 2000); // 2 giây sau tự ẩn + refetch
    };

    const handleAddModal = async () => {
        if (!newItemName || !newItemValue) return;

        try {
            await createConfig({
                category: configType,
                key: newItemName,
                value: newItemValue,
            }).unwrap(); // unwrap giúp bắt lỗi dễ hơn

            setNewItemName('');
            setNewItemValue('');
            setNewItemPublished(true);
            setShowAddModal(false);
            showSuccessModal('Thêm cấu hình thành công!');
        } catch (err) {
            console.error('Tạo cấu hình thất bại:', err);
            alert('Không thể tạo cấu hình mới. Vui lòng kiểm tra lại.');
        }
    };

    const handleDeleteConfig = async () => {
        if (configToDelete?.id) {
            await deleteConfig(configToDelete.id);
            setShowDeleteModal(false);
            showSuccessModal('Xóa cấu hình thành công!');
        }
    };

    const handleEditModal = (config) => {
        setEditingConfig(config); // Set the config being edited
        setNewItemName(config.name); // Set the current name value
        setNewItemValue(config.value); // Set the current value
        setNewItemPublished(config.published); // Set the current published status
        setShowEditModal(true); // Show the edit modal
    };

    const handleSaveEdit = async () => {
        if (!newItemValue || !editingConfig?.id) return;

        await updateConfig({ id: editingConfig.id, value: newItemValue });

        setNewItemName('');
        setNewItemValue('');
        setNewItemPublished(true);
        setShowEditModal(false);
        showSuccessModal('Cập nhật cấu hình thành công!');
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
                                    <CTableDataCell>{item.value}</CTableDataCell>
                                    <CTableDataCell>{item.key}</CTableDataCell>
                                    <CTableDataCell>
                                        {item.status === 'ACTIVE' ? 'Hiển thị' : 'Không hiển thị'}
                                    </CTableDataCell>
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

            {/* Modal Add */}
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
                    <CFormCheck
                        type="radio"
                        name="ACTIVE"
                        label="Hiển thị"
                        checked={newItemPublished === true}
                        onChange={() => setNewItemPublished(true)}
                    />
                    <CFormCheck
                        type="radio"
                        name="INACTIVE"
                        label="Không hiển thị"
                        checked={newItemPublished === false}
                        onChange={() => setNewItemPublished(false)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddModal}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal edit */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader closeButton>
                    <strong>Chỉnh sửa cấu hình</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên cấu hình</CFormLabel>
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

            {/* Modal confirm */}
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

            {/* Modal message */}
            <CModal visible={successModal.visible} onClose={() => setSuccessModal({ visible: false, message: '' })}>
                <CModalHeader closeButton>Thành công</CModalHeader>
                <CModalBody>
                    {successModal.message}
                </CModalBody>
            </CModal>

        </CCard>
    );
};

export default ReasonConfig;
