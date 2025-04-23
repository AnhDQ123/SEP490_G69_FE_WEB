import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
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
    CModalHeader,
    CModal,
    CModalBody,
    CPagination,
    CPaginationItem,
    CToast,
    CToastBody,
    CToaster,
    CToastHeader, CFormCheck
} from '@coreui/react';
import {
    useGetAllPaymentMethodsQuery,
    useCreatePaymentMethodMutation,
    useUpdatePaymentMethodMutation,
    useDeletePaymentMethodMutation
} from '../../service/paymentMethodService';

const PaymentConfig = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [newItemPublished, setNewItemPublished] = useState(true); // Default to "Hiển thị"
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingPayment, setEditingPayment] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [addErrorMessage, setAddErrorMessage] = useState('');
    const [editErrorMessage, setEditErrorMessage] = useState('');

    const [successModal, setSuccessModal] = useState({
        visible: false,
        message: ''
    });

    const { data, isLoading, isError, refetch } = useGetAllPaymentMethodsQuery({ page, size });
    const [createPaymentMethod] = useCreatePaymentMethodMutation();
    const [updatePaymentMethod] = useUpdatePaymentMethodMutation();
    const [deletePaymentMethod] = useDeletePaymentMethodMutation();

    const pushToast = (message, color = 'success') => {
        const newToast = {
            id: Date.now(),
            message,
            color,
            visible: true,
        };
        setToasts((prev) => [...prev, newToast]);
    };


    const showSuccessModal = (message) => {
        setSuccessModal({ visible: true, message });

        setTimeout(() => {
            setSuccessModal({ visible: false, message: '' });
            refetch(); // hoặc window.location.reload()
        }, 2000); // 2 giây sau tự ẩn + refetch
    };

    const handleCreate = async () => {
        if (!newName.trim()) {
            setAddErrorMessage('Tên phương thức là bắt buộc!');
            return;
        }
        if (!newDescription.trim()) {
            setAddErrorMessage('Mô tả là bắt buộc!');
            return;
        }

        try {
            await createPaymentMethod({
                name: newName,
                description: newDescription,
            }).unwrap();
            setShowAddModal(false);
            setNewName('');
            setNewDescription('');
            setAddErrorMessage('');
            showSuccessModal('Thêm phương thức thành công!');
        } catch (error) {
            console.error("Create failed:", error);
            setAddErrorMessage('Thêm phương thức thất bại!');
        }
    };

    const handleUpdate = async () => {
        if (!newName.trim()) {
            setEditErrorMessage('Tên phương thức là bắt buộc!');
            return;
        }
        if (!newDescription.trim()) {
            setEditErrorMessage('Mô tả là bắt buộc!');
            return;
        }

        try {
            await updatePaymentMethod({
                id: editingPayment.id,
                name: newName,
                description: newDescription,
                status: newItemPublished ? 'ACTIVE' : 'INACTIVE'
            }).unwrap();
            setShowEditModal(false);
            setNewName('');
            setNewDescription('');
            setEditErrorMessage('');
            showSuccessModal('Cập nhật phương thức thành công!');
        } catch (error) {
            console.error("Update failed:", error);
            setEditErrorMessage('Cập nhật phương thức thất bại!');
        }
    };

    const handleDelete = async () => {
        try {
            await deletePaymentMethod(deletingId).unwrap();
            setShowDeleteModal(false);
            showSuccessModal('Xóa phương thức thành công!');
        } catch (error) {
            console.error("Delete failed:", error);
            pushToast('Xóa phương thức thất bại!', 'danger');
        }
    };

    const renderTable = () => {
        if (isLoading) return <div>🔄 Đang tải dữ liệu...</div>;
        if (isError) return <div>❌ Lỗi khi lấy dữ liệu!</div>;

        return (
            <>
                <CRow className="justify-content-between mb-3">
                    <CCol><h5>Danh sách phương thức thanh toán</h5></CCol>
                    <CCol className="text-end">
                        <CButton size="sm" color="primary" onClick={() => setShowAddModal(true)}>Thêm mới</CButton>
                    </CCol>
                </CRow>

                <CTable striped hover responsive bordered className="table-sm">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Mã</CTableHeaderCell>
                            <CTableHeaderCell>Mô tả</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.content?.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={4} className="text-center text-muted">
                                    Không có phương thức nào phù hợp
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            data?.content?.map((item) => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.description}</CTableDataCell>
                                    <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="secondary" onClick={() => {
                                            setEditingPayment(item);
                                            setNewName(item.name);
                                            setNewDescription(item.description);
                                            setNewItemPublished(item.status === 'ACTIVE');
                                            setShowEditModal(true);
                                        }} className="me-2">Chỉnh sửa</CButton>
                                        <CButton size="sm" color="danger" onClick={() => {
                                            setDeletingId(item.id);
                                            setShowDeleteModal(true);
                                        }}>Xóa</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>

                <CRow className="justify-content-center mt-3">
                    <CPagination>
                        <CPaginationItem disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</CPaginationItem>
                        {Array.from({ length: data?.totalPages || 1 }, (_, i) => (
                            <CPaginationItem key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</CPaginationItem>
                        ))}
                        <CPaginationItem disabled={page + 1 === data?.totalPages} onClick={() => setPage(page + 1)}>Sau</CPaginationItem>
                    </CPagination>
                </CRow>
            </>
        );
    };

    return (
        <>
            <CToaster placement="middle-center  ">
                {toasts.map((toast) =>
                    toast.visible ? (
                        <CToast
                            key={toast.id}
                            autohide
                            visible
                            color={toast.color}
                            delay={3000}
                            onClose={() =>
                                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                            }
                        >
                            <CToastHeader closeButton>{toast.color === 'danger' ? 'Lỗi' : 'Thông báo'}</CToastHeader>
                            <CToastBody>{toast.message}</CToastBody>
                        </CToast>
                    ) : null
                )}
            </CToaster>


            <CCard>
                <CCardBody>
                    {renderTable()}
                </CCardBody>

                {/* Modal Thêm */}
                <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                    <CModalHeader closeButton>Thêm phương thức thanh toán</CModalHeader>
                    <CModalBody>
                        {addErrorMessage && <div className="text-danger mb-2">{addErrorMessage}</div>}
                        <CFormInput className="mb-3" placeholder="Tên phương thức" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <CFormInput placeholder="Mô tả" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                        <CButton color="primary" onClick={handleCreate}>Lưu</CButton>
                    </CModalFooter>
                </CModal>

                {/* Modal edit */}
                <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                    <CModalHeader closeButton>Chỉnh sửa phương thức thanh toán</CModalHeader>
                    <CModalBody>
                        {editErrorMessage && <div className="text-danger mb-2">{editErrorMessage}</div>}
                        <CFormInput className="mb-3" placeholder="Tên phương thức" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <CFormInput className="mb-3" placeholder="Mô tả" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
                        <CButton color="primary" onClick={handleUpdate}>Lưu</CButton>
                    </CModalFooter>
                </CModal>

                {/* Modal delete */}
                <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <CModalHeader closeButton>Xác nhận xóa</CModalHeader>
                    <CModalBody>Bạn có chắc chắn muốn xóa phương thức này không?</CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                        <CButton color="danger" onClick={handleDelete}>Xóa</CButton>
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
        </>
    );
};

export default PaymentConfig;