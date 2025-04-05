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
    CBadge
} from "@coreui/react";
import { useGetReportByIdQuery } from "../../service/reportService";

const BlogReportCompleted = () => {
    const { reportId } = useParams();
    const { data, error, isLoading } = useGetReportByIdQuery(reportId);

    const [status, setStatus] = useState(data?.status);

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

    return (
        <div>
            <h5 className="mb-4">Chi tiết khiếu nại blog đã xử lý</h5>

            <CCard>
                <CCardHeader>
                    Báo cáo blog
                    {status === "COMPLETED" && (
                        <CBadge color="success" className="ms-2">Đã xử lý</CBadge>
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
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Kết quả:</strong> {data?.resolution || "Đã tiếp nhận khiếu nại"}
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>

                    {status === "COMPLETED" && (
                        <CTableRow>
                            <CTableDataCell colSpan={2} className="d-flex justify-content-center">
                                <CButton color="success" disabled>
                                    Báo cáo đã được xử lý
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Thông tin blog đã báo cáo</CCardHeader>
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
        </div>
    );
};

export default BlogReportCompleted;