import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    CSpinner,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
} from "@coreui/react";
import { useGetReportByIdQuery, useUpdateReportStatusMutation } from "../../service/reportService";
import { useGetUserByIdQuery } from "../../service/userService";
import { useGetShopByIdQuery } from "../../service/shopService";

const ReportPending = () => {
    let { reportId } = useParams();

    // Lấy thông tin báo cáo
    const { data: reportData, error: reportError, isLoading: isReportLoading } = useGetReportByIdQuery(reportId);

    // Lấy thông tin người dùng từ báo cáo
    const customerUserId = reportData?.reporterId;
    const { data: userData, error: userError, isLoading: isUserLoading } = useGetUserByIdQuery(customerUserId, {
        skip: !customerUserId
    });

    // Lấy thông tin cửa hàng từ báo cáo
    const shopId = reportData?.reportItemId;
    const { data: shopData, error: shopError, isLoading: isShopLoading } = useGetShopByIdQuery(shopId, {
        skip: !shopId
    });

    const [updateReportStatus] = useUpdateReportStatusMutation();
    const [status, setStatus] = useState(reportData?.status);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (reportData) setStatus(reportData.status);
    }, [reportData]);

    const handleAccept = async () => {
        try {
            await updateReportStatus(reportId);
            setStatus("COMPLETED");
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái", err);
        }
    };

    const handleModalClose = () => setShowModal(false);
    const handleConfirmAction = () => {
        handleAccept();
        handleModalClose();
    };

    if (isReportLoading || isUserLoading || isShopLoading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <CSpinner color="primary" />
                <span className="ms-2">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (reportError) return <p className="text-danger">Có lỗi khi lấy chi tiết báo cáo.</p>;
    if (userError) return <p className="text-danger">Có lỗi khi lấy thông tin người dùng.</p>;
    if (shopError) return <p className="text-danger">Có lỗi khi lấy thông tin cửa hàng.</p>;

    return (
        <div>
            <h5 className="mb-4">Chi tiết khiếu nại cửa hàng/quán ăn</h5>

            <CCard>
                <CCardHeader>
                    Tranh chấp
                    {status === "PENDING" && <CBadge color="warning" className="ms-2">Chưa xử lý</CBadge>}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong>Tên người dùng:</strong> {userData?.name || 'Không xác định'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Khiếu nại:</strong> {reportData?.reason}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Hình ảnh:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {reportData?.images?.map((src, index) => (
                                            <CImage key={index} src={src} width={70} thumbnail />
                                        ))}
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>

                    {status === "PENDING" && (
                        <div>
                            <CButton color="success" onClick={() => setShowModal(true)}>Ghi nhận khiếu nại</CButton>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Thông tin cửa hàng</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Tên cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell>Mô tả</CTableHeaderCell>
                                <CTableHeaderCell>Địa chỉ cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                                <CTableHeaderCell>Điểm đánh giá</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{shopData?.name}</CTableDataCell>
                                <CTableDataCell>{shopData?.description}</CTableDataCell>
                                <CTableDataCell>{shopData?.address}</CTableDataCell>
                                <CTableDataCell>{shopData?.phone}</CTableDataCell>
                                <CTableDataCell>{shopData?.rating?.toFixed(1)}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            <CModal visible={showModal} onClose={handleModalClose}>
                <CModalHeader>
                    <h5>Xác nhận tiếp nhận khiếu nại</h5>
                </CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn ghi nhận khiếu nại này không?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleModalClose}>Hủy</CButton>
                    <CButton color="primary" onClick={handleConfirmAction}>Tiếp nhận</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ReportPending;
