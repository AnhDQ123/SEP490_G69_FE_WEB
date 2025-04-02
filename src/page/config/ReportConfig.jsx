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
import { useGetConfigsByCategoryQuery, useCreateConfigMutation, useDeleteConfigMutation, useUpdateConfigMutation } from '../../service/reasonConfigService';

const ReportConfig = () => {
    const [configOptions] = useState([
        { value: 'REPORT_PRODUCT_REASON', label: 'Lý do báo cáo sản phẩm' },
        { value: 'REPORT_SHOP_REASON', label: 'Lý do báo cáo cửa hàng' },
        { value: 'REPORT_BLOG_REASON', label: 'Lý do báo cáo bài viết' },
    ]);
    const [configType, setConfigType] = useState('REPORT_PRODUCT_REASON');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [successModal, setSuccessModal] = useState({
        visible: false,
        message: ''
    });

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const { data: configData, isLoading, isError, refetch } = useGetConfigsByCategoryQuery({
        category: configType,
        page,
        size,
        search: debouncedSearch,
    });

    const [newItemName, setNewItemName] = useState('');
    const [newItemValue, setNewItemValue] = useState('');
    const [newItemPublished, setNewItemPublished] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [configToDelete, setConfigToDelete] = useState(null);

    const [createConfig] = useCreateConfigMutation();
    const [deleteConfig] = useDeleteConfigMutation();
    const [updateConfig] = useUpdateConfigMutation();

    const showSuccessModal = (message) => {
        setSuccessModal({ visible: true, message });
        setTimeout(() => {
            setSuccessModal({ visible: false, message: '' });
            refetch();
        }, 2000);
    };

    const handleAddModal = async () => {
        if (!newItemName || !newItemValue) return;

        try {
            await createConfig({
                category: configType,
                key: newItemName,
                value: newItemValue,
                status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
            }).unwrap();

            setNewItemName('');
            setNewItemValue('');
            setNewItemPublished(true);
            setShowAddModal(false);
            showSuccessModal('Thêm lý do báo cáo thành công!');
        } catch (err) {
            console.error('Tạo lý do báo cáo thất bại:', err);
            alert('Không thể tạo lý do mới. Vui lòng kiểm tra lại.');
        }
    };

    const handleDeleteConfig = async () => {
        if (configToDelete?.id) {
            await deleteConfig(configToDelete.id);
            setShowDeleteModal(false);
            showSuccessModal('Xóa lý do báo cáo thành công!');
        }
    };

    const handleEditModal = (config) => {
        setEditingConfig(config);
        setNewItemName(config.key);
        setNewItemValue(config.value);
        setNewItemPublished(config.status === 'ACTIVE');
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!newItemValue || !editingConfig?.id) return;

        try {
            await updateConfig({
                id: editingConfig.id,
                value: newItemValue,
                status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
            }).unwrap();

            setShowEditModal(false);
            showSuccessModal('Cập nhật lý do báo cáo thành công!');
        } catch (err) {
            console.error('Cập nhật thất bại:', err);
            alert('Có lỗi xảy ra khi cập nhật lý do báo cáo');
        }
    };

    const renderTable = () => {
        if (isLoading) return <div>🔄 Đang tải dữ liệu...</div>;
        if (isError) return <div>❌ Lỗi khi lấy dữ liệu lý do báo cáo!</div>;

        return (
            <>
                <CRow className="justify-content-between mb-3">
                    <CCol><h5>Danh sách lý do báo cáo</h5></CCol>
                    <CCol className="text-end">
                        <CButton size="sm" color="primary" onClick={() => setShowAddModal(true)}>
                            Thêm mới
                        </CButton>
                    </CCol>
                </CRow>

                <CTable striped hover responsive bordered className="table-sm">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tên lý do</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Mô tả</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {configData?.content?.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={4} className="text-center text-muted">
                                    Không có lý do báo cáo nào
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            configData?.content?.map((item) => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.key}</CTableDataCell>
                                    <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                                    <CTableDataCell>{item.value}</CTableDataCell>
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
                        <CFormLabel>Chọn loại báo cáo</CFormLabel>
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

            {/* Add Modal */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>
                    <strong>Thêm lý do báo cáo mới</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên lý do</CFormLabel>
                    <CFormInput
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Nhập tên lý do..."
                        className="mb-3"
                    />
                    <CFormLabel>Mô tả chi tiết</CFormLabel>
                    <CFormInput
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder="Nhập mô tả..."
                        className="mb-3"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddModal}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Edit Modal */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader closeButton>
                    <strong>Chỉnh sửa lý do báo cáo</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên lý do</CFormLabel>
                    <CFormInput
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="mb-3"
                        disabled
                    />
                    <CFormLabel>Mô tả chi tiết</CFormLabel>
                    <CFormInput
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        className="mb-3"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleSaveEdit}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Delete Modal */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader closeButton>
                    <strong>Xác nhận xóa</strong>
                </CModalHeader>
                <CModalBody>
                    <p>Bạn có chắc chắn muốn xóa lý do báo cáo này không?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDeleteConfig}>Xóa</CButton>
                </CModalFooter>
            </CModal>

            {/* Success Modal */}
            <CModal visible={successModal.visible} onClose={() => setSuccessModal({ visible: false, message: '' })}>
                <CModalHeader closeButton>Thông báo</CModalHeader>
                <CModalBody>
                    {successModal.message}
                </CModalBody>
            </CModal>
        </CCard>
    );
};

export default ReportConfig;