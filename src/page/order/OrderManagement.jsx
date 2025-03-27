import React, { useState, useEffect } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem
} from '@coreui/react';
import { useGetOrdersByFilterQuery } from '../../service/orderService';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
    const [page, setPage] = useState(1); // Start with page 1
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        status: 'all',
        orderCode: '',
        page: 0, // Default starting page is 0 (API page starts at 0)
        size: 10, // Default records per page set to 10
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setSearchParams(prev => ({
            ...prev,
            page: 0 // reset to first page on search
        }));
    };

    // Adjust query parameters based on the current state
    const queryParams = {
        page: searchParams.page,
        size: searchParams.size,
    };

    if (searchParams.status !== 'all') {
        queryParams.status = searchParams.status;
    }
    if (searchParams.startDate) {
        queryParams.startDate = `${searchParams.startDate}T00:00:00`;
    }
    if (searchParams.endDate) {
        queryParams.endDate = `${searchParams.endDate}T23:59:59`;
    }
    if (searchParams.orderCode) {
        queryParams.orderCode = searchParams.orderCode;
    }

    const { data, isLoading, isFetching } = useGetOrdersByFilterQuery(queryParams);

    const orders = data?.content || [];
    const totalPages = data?.totalPages || 1;

    // Handle page change based on user interaction
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage); // Set the new page number
            setSearchParams(prev => ({
                ...prev,
                page: newPage - 1 // API expects the page to be 0-based
            }));
        }
    };

    const navigate = useNavigate();

    return (
        <CCard>
            <CCardHeader>
                <h3>Quản lý Đơn Hàng</h3>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CRow className="mb-3">
                        <CCol><CFormInput type="date" name="startDate" label="Ngày bắt đầu" onChange={handleInputChange} /></CCol>
                        <CCol><CFormInput type="date" name="endDate" label="Ngày kết thúc" onChange={handleInputChange} /></CCol>
                        <CCol><CFormInput type="text" name="orderCode" label="Mã đơn hàng" placeholder="Nhập mã đơn hàng..." onChange={handleInputChange} /></CCol>
                        <CCol>
                            <CFormSelect name="status" label="Trạng thái" onChange={handleInputChange}>
                                <option value="all">Tất cả</option>
                                <option value="PENDING">Chờ xác nhận</option>
                                <option value="PROCESSING">Đang chuẩn bị</option>
                                <option value="SHIPPING">Đang giao</option>
                                <option value="DELIVERED">Đã giao</option>
                                <option value="CANCELLED">Đã hủy</option>
                                <option value="RETURN_PENDING">Chờ xử lý trả hàng</option>
                                <option value="RETURNED">Đã trả</option>
                                <option value="REJECTED">Đã từ chối</option>
                                <option value="RETURN_REJECTED">Từ chối trả hàng</option>
                            </CFormSelect>
                        </CCol>
                        <CCol>
                            <CFormSelect
                                name="size"
                                label="Số lượng hiển thị"
                                value={searchParams.size}
                                onChange={handleInputChange}
                            >
                                <option value="10">Hiển thị 10</option>
                                <option value="20">Hiển thị 20</option>
                                <option value="50">Hiển thị 50</option>
                            </CFormSelect>
                        </CCol>
                        <CCol className="d-flex align-items-end">
                            <CButton color="primary" onClick={handleSearch}>Tìm kiếm</CButton>
                        </CCol>
                    </CRow>
                </CForm>

                {isLoading || isFetching ? (
                    <div className="text-center mt-4">
                        <CSpinner color="primary" />
                    </div>
                ) : (
                    <>
                        <CTable striped hover className="mt-4">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Mã đơn</CTableHeaderCell>
                                    <CTableHeaderCell>Người mua</CTableHeaderCell>
                                    <CTableHeaderCell>Cửa hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Ngày đặt</CTableHeaderCell>
                                    <CTableHeaderCell>Giá đơn</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {orders.map((order, index) => (
                                    <CTableRow
                                        key={index}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >
                                        <CTableDataCell>{order.orderCode}</CTableDataCell>
                                        <CTableDataCell>{order.ownerName}</CTableDataCell>
                                        <CTableDataCell>{order.shopName}</CTableDataCell>
                                        <CTableDataCell>{order.createdAt?.slice(0, 10)}</CTableDataCell>
                                        <CTableDataCell>{order.total?.toLocaleString('vi-VN')} đ</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                        {/* Pagination */}
                        <CRow className="mt-3 d-flex justify-content-center">
                            <CPagination align="center">
                                <CPaginationItem disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                                    Trước
                                </CPaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                    <CPaginationItem key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                                        {pageNumber}
                                    </CPaginationItem>
                                ))}
                                <CPaginationItem disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
                                    Sau
                                </CPaginationItem>
                            </CPagination>
                        </CRow>
                    </>
                )}
            </CCardBody>
        </CCard>
    );
};

export default OrderManagement;
