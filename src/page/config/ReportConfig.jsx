import React, { useEffect, useState } from 'react';
import {
    CCard, CCardBody, CCardHeader, CFormSelect, CFormLabel, CTable, CTableHead,
    CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CRow, CCol,
    CFormInput, CModalFooter, CModalHeader, CModal, CModalBody, CPagination, CPaginationItem
} from '@coreui/react';
import {
    useGetConfigsByCategoryQuery,
    useCreateConfigMutation,
    useDeleteConfigMutation,
    useUpdateConfigMutation
} from '../../service/reasonConfigService';

const ReportConfig = () => {
    const [configOptions] = useState([
        { value: 'REPORT_PRODUCT_REASON', label: 'Lý do báo cáo sản phẩm' },
        { value: 'REPORT_SHOP_REASON', label: 'Lý do báo cáo cửa hàng' },
        { value: 'REPORT_BLOG_REASON', label: 'Lý do báo cáo bài viết' }
    ]);

    const [configType, setConfigType] = useState('REPORT_PRODUCT_REASON');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [successModal, setSuccessModal] = useState({ visible: false, message: '' });

    const [newItemKey, setNewItemKey] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemPublished, setNewItemPublished] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingConfig, setEditingConfig] = useState(null);
    const [configToDelete, setConfigToDelete] = useState(null);
    const [duplicateCodeError, setDuplicateCodeError] = useState('');

    const { data: configData, isLoading, isError, refetch } = useGetConfigsByCategoryQuery({
        category: configType,
        page,
        size,
        search: debouncedSearch
    });

    const [createConfig] = useCreateConfigMutation();
    const [deleteConfig] = useDeleteConfigMutation();
    const [updateConfig] = useUpdateConfigMutation();

    // Debounce search input
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const showSuccess = (message) => {
        setSuccessModal({ visible: true, message });
        setTimeout(() => {
            setSuccessModal({ visible: false, message: '' });
            refetch();
        }, 2000);
    };

    const handleAddModal = async () => {
        if (!newItemKey || !newItemName) return;

        const isCodeExist = configData?.content?.some(item => item.key === newItemKey);
        if (isCodeExist) {
            setDuplicateCodeError('Mã này đã tồn tại. Vui lòng chọn mã khác.');
            return;
        } else {
            setDuplicateCodeError('');
        }

        try {
            await createConfig({
                category: configType,
                key: newItemKey,
                value: newItemName,
                status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
            }).unwrap();

            setShowAddModal(false);
            setNewItemKey('');
            setNewItemName('');
            setNewItemPublished(true);
            showSuccess('Thêm cấu hình thành công!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditModal = (config) => {
        setEditingConfig(config);
        setNewItemKey(config.key);
        setNewItemName(config.value);
        setNewItemPublished(config.status === 'ACTIVE');
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!newItemName || !editingConfig?.id) return;

        try {
            await updateConfig({
                id: editingConfig.id,
                value: newItemName,
                status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
            }).unwrap();

            setShowEditModal(false);
            showSuccess('Cập nhật cấu hình thành công!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteConfig = async () => {
        if (!configToDelete?.id) return;

        try {
            await deleteConfig(configToDelete.id).unwrap();
            setShowDeleteModal(false);
            showSuccess('Xóa cấu hình thành công!');
        } catch (error) {
            console.error(error);
        }
    };

    const renderTable = () => {
        if (isLoading) return <div>🔄 Đang tải dữ liệu...</div>;
        if (isError) return <div>❌ Lỗi khi lấy dữ liệu!</div>;

        return (
            <CTable striped hover responsive bordered className="table-sm">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Tên cấu hình</CTableHeaderCell>
                        <CTableHeaderCell>Mã</CTableHeaderCell>
                        <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                        <CTableHeaderCell>Hành động</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {configData?.content?.length === 0 ? (
                        <CTableRow>
                            <CTableDataCell colSpan={4} className="text-center text-muted">
                                Không có dữ liệu
                            </CTableDataCell>
                        </CTableRow>
                    ) : (
                        configData?.content?.map(item => (
                            <CTableRow key={item.id}>
                                <CTableDataCell>{item.value}</CTableDataCell>
                                <CTableDataCell>{item.key}</CTableDataCell>
                                <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton size="sm" color="warning" style={{ width: '45%' }}
                                             onClick={() => handleEditModal(item)}>Sửa</CButton>{' '}
                                    <CButton size="sm" color="danger" style={{ width: '45%' }}
                                              onClick={() => { setConfigToDelete(item); setShowDeleteModal(true); }}>Xóa</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    )}
                </CTableBody>
            </CTable>
        );
    };

    return (
        <CCard>
            <CCardHeader>
                <CRow className="align-items-end justify-content-between">
                    <CCol md={4}>
                        <CFormLabel>Chọn loại cấu hình</CFormLabel>
                        <CFormSelect value={configType} onChange={(e) => setConfigType(e.target.value)}>
                            {configOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol className="text-end">
                        <CButton size="sm" color="primary" onClick={() => setShowAddModal(true)}>
                            Thêm mới
                        </CButton>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>
                {renderTable()}

                {/* Pagination */}
                <CRow className="justify-content-center mt-3">
                    <CPagination>
                        <CPaginationItem active>{page + 1}</CPaginationItem>
                    </CPagination>
                </CRow>
            </CCardBody>

            {/* Add Modal */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>Thêm mới cấu hình</CModalHeader>
                <CModalBody>
                    <CFormLabel>Mã</CFormLabel>
                    <CFormInput
                        value={newItemKey}
                        onChange={(e) => setNewItemKey(e.target.value)}
                        placeholder="Nhập mã..."
                        className="mb-3"
                    />
                    {duplicateCodeError && <div style={{ color: 'red' }}>{duplicateCodeError}</div>}
                    <CFormLabel>Tên cấu hình</CFormLabel>
                    <CFormInput
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Nhập tên..."
                        className="mb-3"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddModal}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Success Modal */}
            <CModal visible={successModal.visible} onClose={() => setSuccessModal({ visible: false, message: '' })}>
                <CModalHeader closeButton>Thông báo</CModalHeader>
                <CModalBody>{successModal.message}</CModalBody>
            </CModal>

            {/* Delete Modal */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader closeButton>Xác nhận xóa</CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn xóa mục này không?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDeleteConfig}>Xóa</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ReportConfig;