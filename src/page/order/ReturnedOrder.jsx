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
import { useViewReturnOrderQuery } from "../../service/returnOrderService"; // Import your API hook
import { useAcceptReturnOrderMutation, useRejectReturnOrderMutation } from "../../service/returnOrderService"; // Import reject mutation

const ReturnedOrder = () => {
    // Get orderId from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('id'); // Get 'id' from the query string
    // Use the query hook to fetch order details
    const {
        data: orderDetails,
        isLoading,
        isError,
        error
    } = useViewReturnOrderQuery(orderId);
    console.log(orderDetails)
    const [showShopModal, setShowShopModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal
    const [actorToProcess, setActorToProcess] = useState(null);
    const [processingDirection, setProcessingDirection] = useState(""); // State for input field
    const [acceptReturnOrder, { isLoading: isAccepting, error: acceptError }] = useAcceptReturnOrderMutation();
    const [rejectReturnOrder, { isLoading: isRejecting, error: rejectError }] = useRejectReturnOrderMutation();

    // Handle action (e.g., processing different actors)
    const handleAction = (actor) => {
        setActorToProcess(actor);
        if (actor === 'shop') {
            setShowShopModal(true);
        } else if (actor === 'customer') {
            setShowCustomerModal(true);
        }
        console.log(actor)
        console.log(showShopModal);
    };

    const confirmAction = () => {
        // Handle Shop action
        if (actorToProcess === 'shop') {
            // Only handle Shop action if processing direction is provided
            if (processingDirection.trim() === "") {
                alert("Vui lòng nhập hướng xử lý.");
                return;
            }

            // Perform API mutation for accepting the return order
            acceptReturnOrder(orderId)
                .then(() => {
                    alert(`Đã xử lý cho ${actorToProcess === 'shop' ? 'Shop' : 'Người mua'}`);
                    closeModals();
                    setShowSuccessModal(true); // Show success modal
                })
                .catch((err) => {
                    alert(`Đã xảy ra lỗi: ${err.message}`);
                });
        }

        // Handle Customer action
        if (actorToProcess === 'customer') {
            // Perform API mutation for rejecting the return order
            rejectReturnOrder(orderId)
                .then(() => {
                    alert(`Đã xử lý cho ${actorToProcess === 'shop' ? 'Shop' : 'Người mua'}`);
                    closeModals();
                    setShowSuccessModal(true); // Show success modal
                })
                .catch((err) => {
                    alert(`Đã xảy ra lỗi: ${err.message}`);
                });
        }
    };

    const closeModals = () => {
        setShowShopModal(false);
        setShowCustomerModal(false);
        setProcessingDirection(""); // Reset the input field
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false); // Close the success modal
    };

    // Render the page based on loading, error, or data
    if (isLoading) {
        return <CSpinner color="primary" />;
    }

    if (isError) {
        return <div>Đã xảy ra lỗi: {error?.message}</div>;
    }

    return (
        <div>
            <h4 className="mb-4">Chi tiết trả hàng</h4>

            {/* Order Details */}
            <CCard className="mb-4">
                <CCardHeader>Đơn hàng #{orderDetails?.order.orderCode}</CCardHeader>
                <CCardBody>
                    <p><strong>Tổng tiền:</strong> {orderDetails?.order.total?.toLocaleString('vi-VN')} đ</p>
                    <p><strong>Lý do trả hàng:</strong> {orderDetails?.order.reason || 'Không có lý do'}</p>
                </CCardBody>
            </CCard>

            {/* Product Table */}
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
                                    <CTableDataCell>{orderDetails?.order.orderItem.products?.productName}</CTableDataCell>
                                    <CTableDataCell>{product.price?.toLocaleString('vi-VN')} đ</CTableDataCell>
                                    <CTableDataCell>{product.quantity}</CTableDataCell>
                                    <CTableDataCell>{(product.price * product.quantity).toLocaleString('vi-VN')} đ</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Proof Images */}
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
                                    <CTableDataCell>
                                        {actor === 'shop' ? '🏬 Shop' : actor === 'shipper' ? '🚚 Shipper' : '👤 Người mua'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CImage
                                            rounded
                                            thumbnail
                                            src={orderDetails?.[actor]?.image || "/images/default_image.png"} // Assuming each actor has an image field
                                            width={150}
                                        />
                                    </CTableDataCell>
                                    <CTableDataCell>{orderDetails?.[actor]?.imageId}</CTableDataCell>
                                    <CTableDataCell>
                                        {actor === 'shop' ? orderDetails?.order?.shopId : actor === 'shipper' ? orderDetails?.order?.shipperId : orderDetails?.order?.ownerId}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            color={actor === 'shop' ? 'primary' : actor === 'shipper' ? 'warning' : 'danger'}
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
            <CModal
                visible={showShopModal}
                onClose={closeModals}
                centered
            >
                <CModalHeader closeButton>
                    <CModalTitle>Xác nhận xử lý Shop</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Vui lòng nhập hướng xử lý đơn hàng cho Shop:</p>
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
                        disabled={isAccepting} // Disable button while the API request is in progress
                    >
                        {isAccepting ? <CSpinner size="sm" /> : "Xác nhận"}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Customer Modal */}
            <CModal
                visible={showCustomerModal}
                onClose={closeModals}
                centered
            >
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
            <CModal
                visible={showSuccessModal}
                onClose={closeSuccessModal}
                centered
            >
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
