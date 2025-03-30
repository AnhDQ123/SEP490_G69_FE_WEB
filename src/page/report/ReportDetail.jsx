import React from "react";
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

const ReportDetail = () => {
    // Dữ liệu mock
    const customerSide = {
        username: "Nhat123",
        solution: "Yêu cầu trả hàng",
        reason: "Đồ ăn khi nhận được không giống như hình hay mô tả được đăng trên quán",
        images: ["/img1.png", "/img2.png", "/img3.png"],
    };

    const shopSide = {
        name: "Cơm rang 123",
        solution: "Từ chối trả hàng",
        reason: "Đồ ăn được chế biến đúng với thực đơn được đăng",
        images: ["/img4.png", "/img5.png"],
    };

    const products = [
        {
            name: "Cơm rang thập cẩm",
            price: 60000,
            quantity: 1,
            voucher: "N/A",
            discount: 10000,
            total: 50000,
            image: "/food.png",
        },
    ];

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
                                <CTableDataCell><strong>Quán:</strong> {shopSide.name}</CTableDataCell>
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
                                        {customerSide.images.map((src, index) => (
                                            <CImage key={index} src={src} width={70} thumbnail />
                                        ))}
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <strong>Bằng chứng:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {shopSide.images.map((src, index) => (
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
                            {products.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>
                                        <CImage src={item.image} width={60} thumbnail />
                                    </CTableDataCell>
                                    <CTableDataCell>{item.name}</CTableDataCell>
                                    <CTableDataCell>{item.price.toLocaleString()}đ</CTableDataCell>
                                    <CTableDataCell>{item.quantity}</CTableDataCell>
                                    <CTableDataCell>{item.voucher}</CTableDataCell>
                                    <CTableDataCell>{item.discount.toLocaleString()}đ</CTableDataCell>
                                    <CTableDataCell>{item.total.toLocaleString()}đ</CTableDataCell>
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
