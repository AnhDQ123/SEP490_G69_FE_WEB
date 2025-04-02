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
} from "@coreui/react";
import { useGetReportByIdQuery } from "../../service/reportService"; // Giả sử bạn đã tạo API này

const ReportDetail = () => {
    const { reportId } = useParams(); // Lấy reportId từ URL
    const { data, error, isLoading } = useGetReportByIdQuery(reportId); // Gọi API với reportId

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy chi tiết báo cáo.</p>;

    // Giả sử data trả về có cấu trúc tương tự mock dữ liệu
    const customerSide = data?.customerSide || {};
    const shopSide = data?.shopSide || {};
    const products = data?.products || [];

    return (
        <div>
            <h5 className="mb-4">Chi tiết cáo buộc</h5>

            <CCard>
                <CCardHeader>Tranh chấp</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Phía khách hàng</CTableHeaderCell>
                                <CTableHeaderCell>Phía cửa hàng</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong>Tài khoản:</strong> {customerSide.username}</CTableDataCell>
                                <CTableDataCell><strong>Quán:</strong> {shopSide.reportName}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Hướng giải quyết:</strong> {customerSide.solution}</CTableDataCell>
                                <CTableDataCell><strong>Hướng giải quyết:</strong> {shopSide.solution}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Lý do:</strong> {customerSide.reason}</CTableDataCell>
                                <CTableDataCell><strong>Lý do:</strong> {shopSide.reason}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Bằng chứng:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {customerSide.images?.map((src, index) => (
                                            <CImage key={index} src={src} width={70} thumbnail />
                                        ))}
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <strong>Bằng chứng:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {shopSide.images?.map((src, index) => (
                                            <CImage key={index} src={src} width={70} thumbnail />
                                        ))}
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>

                    <CTableRow>
                        <CTableDataCell className="d-flex gap-2">
                            <CButton color="warning">Yêu cầu thêm bằng chứng</CButton>
                            <CButton color="success">Chấp nhận</CButton>
                        </CTableDataCell>
                    </CTableRow>

                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Sản phẩm</CCardHeader>
                <CCardBody>
                    <CTable striped bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Ảnh</CTableHeaderCell>
                                <CTableHeaderCell>Tên món</CTableHeaderCell>
                                <CTableHeaderCell>Giá món</CTableHeaderCell>
                                <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                <CTableHeaderCell>Voucher</CTableHeaderCell>
                                <CTableHeaderCell>Giảm giá</CTableHeaderCell>
                                <CTableHeaderCell>Tổng giá</CTableHeaderCell>
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
                                    <CTableDataCell>{item.discount?.toLocaleString()}đ</CTableDataCell>
                                    <CTableDataCell>{item.total?.toLocaleString()}đ</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ReportDetail;
