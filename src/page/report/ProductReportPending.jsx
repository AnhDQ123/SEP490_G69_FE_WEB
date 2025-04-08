import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Để lấy reportId từ URL
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CImage,
    CBadge,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
} from "@coreui/react";
import { useGetReportByIdQuery, useUpdateReportStatusMutation } from "../../service/reportService"; // Giả sử bạn đã tạo API này

const ProductReportPending = () => {
    const { reportId } = useParams(); // Lấy reportId từ URL
    const { data, error, isLoading } = useGetReportByIdQuery(reportId); // Gọi API với reportId
    const [updateReportStatus] = useUpdateReportStatusMutation(); // API để cập nhật trạng thái

    const [status, setStatus] = useState(data?.status); // Trạng thái của báo cáo
    const [showModal, setShowModal] = useState(false); // State to toggle the modal
    const [actionType, setActionType] = useState(""); // To store whether it's 'accept' or 'reject'

    useEffect(() => {
        if (data) {
            setStatus(data.status); // Cập nhật trạng thái khi dữ liệu thay đổi
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy chi tiết báo cáo.</p>;

    // Giả sử data trả về có cấu trúc tương tự mock dữ liệu
    const customerSide = data?.customerSide || {};
    const shopSide = data?.shopSide || {};
    const products = data?.products || [];

    // Hàm cập nhật trạng thái báo cáo
    const handleAccept = async () => {
        try {
            await updateReportStatus({ reportId, status: "IN_PROGRESS" });
            setStatus("IN_PROGRESS");
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái", err);
        }
    };

    const handleReject = async () => {
        try {
            await updateReportStatus({ reportId, status: "CANCELLED" });
            setStatus("CANCELLED");
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái", err);
        }
    };

    // Open modal for confirmation
    const handleModalOpen = (type) => {
        setActionType(type);
        setShowModal(true);
    };

    // Close modal without doing anything
    const handleModalClose = () => {
        setShowModal(false);
        setActionType("");
    };

    // Confirm modal action
    const handleConfirmAction = () => {
        if (actionType === "accept") {
            handleAccept();
        } else if (actionType === "reject") {
            handleReject();
        }
        handleModalClose(); // Close modal after action
    };

    return (
        <div>
            <h5 className="mb-4">Chi tiết khiếu nại sản phẩm</h5>

            {/* Display status at the top */}
            <CCard>
                <CCardHeader>
                    Tranh chấp
                    {status === "PENDING" && (
                        <CBadge color="warning" className="ms-2">Chưa xử lý</CBadge>
                    )}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Tên người dùng:</strong> {customerSide.username}
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Khiếu nại:</strong> {customerSide.reason}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Hình ảnh:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {customerSide.images?.map((src, index) => (
                                            <CImage key={index} src={src} width={70} thumbnail />
                                        ))}
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>

                    {/* Actions for pending report */}
                    {status === "PENDING" && (
                        <CTableRow>
                            <CTableDataCell colSpan={2} className="d-flex justify-content-center gap-3">
                                <CButton color="success" onClick={() => handleModalOpen("accept")}>
                                    Ghi nhận khiếu nại
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CCardBody>
            </CCard>

            {/* Modal for confirmation */}
            <CModal visible={showModal} onClose={handleModalClose}>
                <CModalHeader>
                    <h5>Xác nhận</h5>
                </CModalHeader>
                <CModalBody>
                    <p>
                        Bạn có chắc chắn muốn {actionType === "accept" ? "tiếp nhận" : "từ chối"} khiếu nại này?
                    </p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleModalClose}>Hủy</CButton>
                    <CButton color="primary" onClick={handleConfirmAction}>
                        {actionType === "accept" ? "Tiếp nhận" : "Từ chối"}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Product Complaint Section */}
            <CCard className="mt-4">
                <CCardHeader>Thông tin sản phẩm</CCardHeader>
                <CCardBody>
                    <CTable striped bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                                <CTableHeaderCell>Tên cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell>Mô tả</CTableHeaderCell>
                                <CTableHeaderCell>Hình ảnh</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {products?.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.shopName}</CTableDataCell>
                                    <CTableDataCell>{item.description}</CTableDataCell>
                                    <CTableDataCell>
                                        <div className="d-flex gap-2 mt-2">
                                            {item.images?.map((src, index) => (
                                                <CImage key={index} src={src} width={70} thumbnail />
                                            ))}
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ProductReportPending;
