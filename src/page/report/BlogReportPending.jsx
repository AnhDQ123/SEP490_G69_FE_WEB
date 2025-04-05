import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
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
import { useGetReportByIdQuery, useUpdateReportStatusMutation } from "../../service/reportService";

const BlogReportPending = () => {
    const { reportId } = useParams();
    const { data, error, isLoading } = useGetReportByIdQuery(reportId);
    const [updateBlogReportStatus] = useUpdateReportStatusMutation();

    const [status, setStatus] = useState(data?.status);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        if (data) {
            setStatus(data.status);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy chi tiết báo cáo blog.</p>;

    const reporterInfo = data?.reporter || {};
    const blogInfo = data?.blog || {};
    const reportDetails = data?.reportDetails || {};

    const handleAccept = async () => {
        try {
            await updateBlogReportStatus({ reportId, status: "IN_PROGRESS" });
            setStatus("IN_PROGRESS");
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái", err);
        }
    };


    const handleModalOpen = (type) => {
        setActionType(type);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setActionType("");
    };

    const handleConfirmAction = () => {
        actionType === "accept"
            handleAccept();
    };

    return (
        <div>
            <h5 className="mb-4">Chi tiết khiếu nại blog</h5>

            <CCard>
                <CCardHeader>
                    Báo cáo blog
                    {status === "PENDING" && (
                        <CBadge color="warning" className="ms-2">Chưa xử lý</CBadge>
                    )}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Người báo cáo:</strong> {reporterInfo.username}
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Lý do báo cáo:</strong> {reportDetails.reason}
                                </CTableDataCell>
                            </CTableRow>
                            {reportDetails.images && reportDetails.images.length > 0 && (
                                <CTableRow>
                                    <CTableDataCell>
                                        <strong>Hình ảnh đính kèm:</strong>
                                        <div className="d-flex gap-2 mt-2">
                                            {reportDetails.images.map((src, index) => (
                                                <CImage key={index} src={src} width={70} thumbnail />
                                            ))}
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>

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

            <CCard className="mt-4">
                <CCardHeader>Thông tin blog bị khiếu nại</CCardHeader>
                <CCardBody>
                    <CTable striped bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                                <CTableHeaderCell>Tác giả</CTableHeaderCell>
                                <CTableHeaderCell>Ngày đăng</CTableHeaderCell>
                                <CTableHeaderCell>Nội dung</CTableHeaderCell>
                                <CTableHeaderCell>Hình ảnh</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{blogInfo.title}</CTableDataCell>
                                <CTableDataCell>{blogInfo.author}</CTableDataCell>
                                <CTableDataCell>{blogInfo.createdAt}</CTableDataCell>
                                <CTableDataCell>
                                    <div className="blog-content-preview">
                                        {blogInfo.content?.substring(0, 100)}
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    {blogInfo.images && blogInfo.images.length > 0 && (
                                        <div className="d-flex gap-2">
                                            <CImage src={blogInfo.images[0]} width={60} thumbnail />
                                        </div>
                                    )}
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            <CModal visible={showModal} onClose={handleModalClose}>
                <CModalHeader>
                    <h5>Xác nhận</h5>
                </CModalHeader>
                <CModalBody>
                    <p>
                        Bạn có chắc chắn muốn {actionType === "accept" ? "tiếp nhận" : "từ chối"} báo cáo này?
                    </p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleModalClose}>Hủy</CButton>
                    <CButton color="primary" onClick={handleConfirmAction}>
                        {actionType === "accept" ? "Tiếp nhận" : "Từ chối"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default BlogReportPending;