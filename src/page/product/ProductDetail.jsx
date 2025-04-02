import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CButton,
    CImage,
} from '@coreui/react';
import { useGetProductByIdQuery } from '../../service/productService.js';

const ProductDetail = () => {
    const [product, setProduct] = useState({});
    const { id } = useParams(); // Lấy product_id từ URL
    const navigate = useNavigate();

    // Gọi API để lấy dữ liệu sản phẩm theo ID
    const { data, error, isLoading } = useGetProductByIdQuery(id);

    useEffect(() => {
        if (data) {
            setProduct(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu sản phẩm</p>;

    return (
        <CCard className="p-4 shadow-lg">
            <CCardBody>
                <h4 className="mb-4 fw-bold">📌 Danh sách sản phẩm {'>'} Chi tiết sản phẩm</h4>

                <CRow>
                    {/* Thông tin sản phẩm bên trái */}
                    <CCol md={8}>
                        <CRow className="mb-3">
                            <CCol md={6}>
                                <label className="fw-semibold">Tên sản phẩm</label>
                                <CFormInput disabled value={product.name || ''} className="border rounded-2" />
                            </CCol>
                            <CCol md={6}>
                                <label className="fw-semibold">Nhà sản xuất</label>
                                <CFormInput disabled value={product.manufacturer || ''} className="border rounded-2" />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <label className="fw-semibold">Nhà cung cấp</label>
                                <CFormInput disabled value={product.supplier || ''} className="border rounded-2" />
                            </CCol>
                            <CCol md={6}>
                                <label className="fw-semibold">Mô tả</label>
                                <CFormInput disabled value={product.description || ''} className="border rounded-2" />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <label className="fw-semibold">Danh mục sản phẩm</label>
                                <CFormInput disabled value={product.category || ''} className="border rounded-2" />
                            </CCol>
                            <CCol md={6}>
                                <label className="fw-semibold">Discount</label>
                                <CFormInput disabled value={product.discount || ''} className="border rounded-2" />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <label className="fw-semibold">Ngày hết hạn</label>
                                <CFormInput disabled value={product.expiryDate || ''} className="border rounded-2" />
                            </CCol>
                            <CCol md={6}>
                                <label className="fw-semibold">Giảm giá</label>
                                <CFormInput disabled value={product.discount_id ? `${product.discount_id} %` : "Không có"} className="border rounded-2" />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <label className="fw-semibold">Đánh giá</label>
                                <CFormInput disabled value={product.rate || ''} className="border rounded-2" />
                            </CCol>
                            <CCol md={6}>
                                <label className="fw-semibold">Số lượng trong kho</label>
                                <CFormInput disabled value={product.quantity || ''} className="border rounded-2" />
                            </CCol>
                        </CRow>
                    </CCol>

                    {/* Hình ảnh sản phẩm bên phải */}
                    <CCol md={4} className="text-center">
                        <label className="fw-semibold">Hình ảnh sản phẩm</label>
                        <CImage
                            src={product.image}
                            className="border rounded-3 shadow-sm mt-2"
                            width={300}
                            height={200}
                            alt="Product Image"
                        />
                    </CCol>
                </CRow>

                {/* Nút chức năng */}
                <CRow className="text-center mt-4">
                    <CCol md={6}>
                        <CButton color="danger" className="w-100 rounded-3 py-2 fw-semibold">
                            ❌ Xóa sản phẩm
                        </CButton>
                    </CCol>
                    <CCol md={6}>
                        <CButton color="secondary" className="w-100 rounded-3 py-2 fw-semibold" onClick={() => navigate(-1)}>
                            ⬅️ Quay lại
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

export default ProductDetail;
