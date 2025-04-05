import React, { useEffect } from "react";
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
    CBadge
} from "@coreui/react";
import { useGetReportByIdQuery } from "../../service/reportService"; // Giả sử bạn đã tạo API này
import { useGetUserByIdQuery } from "../../service/userService";
import { useGetShopByIdQuery } from "../../service/shopService";

const ReportCompleted = () => {
    const { reportId } = useParams(); // Lấy reportId từ URL
    const { data, error, isLoading } = useGetReportByIdQuery(reportId); // Gọi API với reportId

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy chi tiết báo cáo.</p>;

    // Giả sử data trả về có cấu trúc tương tự mock dữ liệu
    const customerSide = data?.customerSide || {};
    const shopSide = data?.shopSide || {};
    const products = data?.products || [];
    const reportStatus = data?.status;  // Get the status of the report (e.g., "COMPLETED")

    return (
        <div>
            <h5 className="mb-4">Chi tiết khiếu nại cửa hàng/quán ăn đã tiếp nhận</h5>

            {/* Display status at the top */}
            <CCard>
                <CCardHeader>
                    Tranh chấp
                    {reportStatus === "COMPLETED" && (
                        <CBadge color="success" className="ms-2">Đã hoàn thành</CBadge>
                    )}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Tài khoản:</strong> {customerSide.username}
                                    <strong>Tên người dùng:</strong> {customerSide.username}
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Cửa hàng:</strong> {customerSide.username}</CTableDataCell>
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

                    {/* Indicating that the report is processed */}
                    {reportStatus === "COMPLETED" && (
                        <CTableRow>
                            <CTableDataCell colSpan={2} className="d-flex justify-content-center">
                                <CButton color="success" disabled>
                                    Khiếu nại đã được ghi nhận
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Thông tin cửa hàng</CCardHeader>
                <CCardBody>
                    <CTable striped bordered>
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
                            {products?.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>
                                        <CImage src={item.image} width={60} thumbnail />
                                    </CTableDataCell>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.price?.toLocaleString()}đ</CTableDataCell>
                                    <CTableDataCell>{item.quantity}</CTableDataCell>
                                    <CTableDataCell>{item.voucher}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ReportCompleted;
