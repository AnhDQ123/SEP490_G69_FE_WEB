import React from "react";
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

const ProductReportCompleted = () => {
    const { reportId } = useParams();
    const { data, error, isLoading } = useGetReportByIdQuery(reportId);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy chi tiết báo cáo.</p>;

    const customerSide = data?.customerSide || {};
    const products = data?.products || [];
    const reportStatus = data?.status;

    return (
        <div>
            <h5 className="mb-4">Chi tiết khiếu nại sản phẩm đã tiếp nhận</h5>

            {/* Complaint Information Section */}
            <CCard>
                <CCardHeader>
                    Tranh chấp sản phẩm
                    {reportStatus === "COMPLETED" && (
                        <CBadge color="success" className="ms-2">Đã hoàn thành</CBadge>
                    )}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
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

                    {/* Completed Status Indicator */}
                    {reportStatus === "COMPLETED" && (
                        <CTableRow>
                            <CTableDataCell colSpan={2} className="d-flex justify-content-center">
                                <CButton color="success" disabled>
                                    Khiếu nại đã được giải quyết
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CCardBody>
            </CCard>

            {/* Product Information Section */}
            <CCard className="mt-4">
                <CCardHeader>Thông tin sản phẩm</CCardHeader>
                <CCardBody>
                    <CTable striped bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Hình ảnh</CTableHeaderCell>
                                <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                                <CTableHeaderCell>Tên cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell>Mô tả</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {products?.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>
                                        <div className="d-flex gap-2">
                                            {item.images?.map((src, idx) => (
                                                <CImage key={idx} src={src} width={60} thumbnail />
                                            ))}
                                        </div>
                                    </CTableDataCell>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.shopName}</CTableDataCell>
                                    <CTableDataCell>{item.description}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ProductReportCompleted;