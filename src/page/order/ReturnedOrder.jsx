import React, { useState } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CImage,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
    CSpinner,
    CModalFooter,
    CModalHeader,
    CModalBody,
    CModalTitle,
    CModal,
    CForm,
    CFormInput
} from "@coreui/react";
import { useLocation } from "react-router-dom";
import { useViewReturnOrderQuery } from "../../service/returnOrderService";
import { useAcceptReturnOrderMutation, useRejectReturnOrderMutation } from "../../service/returnOrderService";

const ReturnedOrder = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('id');

    const {
        data: orderDetails,
        isLoading,
        isError,
        error
    } = useViewReturnOrderQuery(orderId);

    const [showShopModal, setShowShopModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [actorToProcess, setActorToProcess] = useState(null);
    const [processingDirection, setProcessingDirection] = useState("");
    const [acceptReturnOrder, { isLoading: isAccepting }] = useAcceptReturnOrderMutation();
    const [rejectReturnOrder, { isLoading: isRejecting }] = useRejectReturnOrderMutation();

    const handleAction = (actor) => {
        setActorToProcess(actor);
        if (actor === 'shop') setShowShopModal(true);
        else if (actor === 'customer') setShowCustomerModal(true);
    };

    const confirmAction = () => {
        if (actorToProcess === 'shop') {
            if (processingDirection.trim() === "") {
                alert("Vui lòng nhập hướng xử lý.");
                return;
            }
            acceptReturnOrder(orderId)
                .then(() => {
                    alert(`Đã xử lý cho ${actorToProcess}`);
                    closeModals();
                    setShowSuccessModal(true);
                })
                .catch((err) => alert(`Lỗi: ${err.message}`));
        }

        if (actorToProcess === 'customer') {
            rejectReturnOrder(orderId)
                .then(() => {
                    alert(`Đã xử lý cho ${actorToProcess}`);
                    closeModals();
                    setShowSuccessModal(true);
                })
                .catch((err) => alert(`Lỗi: ${err.message}`));
        }
    };

    const closeModals = () => {
        setShowShopModal(false);
        setShowCustomerModal(false);
        setProcessingDirection("");
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    if (isLoading) return <CSpinner color="primary" />;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div>
            <h4 className="mb-4">Chi tiết trả hàng</h4>
            <CCard className="mb-4">
                <CCardHeader>Đơn hàng #{orderDetails?.order.orderCode}</CCardHeader>
                <CCardBody>
                    <p><strong>Tổng tiền:</strong> {orderDetails?.order.total?.toLocaleString('vi-VN')} đ</p>
                    <p><strong>Lý do trả hàng:</strong> {orderDetails?.order.reason || 'Không có lý do'}</p>
                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Danh sách sản phẩm</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                                <CTableHeaderCell>Giá</CTableHeaderCell>
                                <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {orderDetails?.order?.products?.map((product, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{product.productName}</CTableDataCell>
                                    <CTableDataCell>{product.price?.toLocaleString('vi-VN')} đ</CTableDataCell>
                                    <CTableDataCell>{product.quantity}</CTableDataCell>
                                    <CTableDataCell>{(product.price * product.quantity).toLocaleString('vi-VN')} đ</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            <CCard className="mb-4">
                <CCardHeader>Ảnh minh chứng</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Người dùng</CTableHeaderCell>
                                <CTableHeaderCell>Ảnh</CTableHeaderCell>
                                <CTableHeaderCell>Image ID</CTableHeaderCell>
                                <CTableHeaderCell>User ID</CTableHeaderCell>
                                <CTableHeaderCell>Hành động</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {['shop', 'shipper', 'customer'].map((actor, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{actor}</CTableDataCell>
                                    <CTableDataCell>
                                        <CImage rounded thumbnail src={orderDetails?.[actor]?.image} width={150} />
                                    </CTableDataCell>
                                    <CTableDataCell>{orderDetails?.[actor]?.imageId}</CTableDataCell>
                                    <CTableDataCell>{orderDetails?.[actor]?.userId}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            color="primary"
                                            size="sm"
                                            onClick={() => handleAction(actor)}
                                        >
                                            Xử lý {actor === 'shop' ? 'Shop' : actor === 'shipper' ? 'Shipper' : 'Người mua'}
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Shop Modal */}
            <CModal visible={showShopModal} onClose={closeModals} centered>
                <CModalHeader closeButton>
                    <CModalTitle>Xác nhận xử lý Shop</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormInput
                            type="text"
                            value={processingDirection}
                            onChange={(e) => setProcessingDirection(e.target.value)}
                            placeholder="Nhập hướng xử lý..."
                            required
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModals}>Hủy</CButton>
                    <CButton
                        color="primary"
                        onClick={confirmAction}
                        disabled={isAccepting}
                    >
                        {isAccepting ? <CSpinner size="sm" /> : "Xác nhận"}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Customer Modal */}
            <CModal visible={showCustomerModal} onClose={closeModals} centered>
                <CModalHeader closeButton>
                    <CModalTitle>Xác nhận xử lý Người mua</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Bạn có chắc chắn muốn xử lý đơn hàng cho Người mua này?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModals}>Hủy</CButton>
                    <CButton color="primary" onClick={confirmAction} disabled={isRejecting}>
                        {isRejecting ? <CSpinner size="sm" /> : "Xác nhận"}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Success Modal */}
            <CModal visible={showSuccessModal} onClose={closeSuccessModal} centered>
                <CModalHeader closeButton>
                    <CModalTitle>Thông báo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Đơn hàng đã được xử lý thành công!</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeSuccessModal}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ReturnedOrder;
