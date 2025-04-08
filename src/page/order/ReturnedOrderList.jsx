import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import {
    useGetAllPendingReturnRequestsQuery,
    useGetAllRejectedReturnRequestsQuery,
    useGetAllAcceptedReturnRequestsQuery
} from '../../service/returnOrderService';

const ReturnedOrderList = () => {
    const [page, setPage] = useState(1); // Start with page 1

    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        status: 'RETURN_PENDING', // Default status is 'RETURN_PENDING'
        orderCode: '',
        page: 1, // Default starting page is 0 (API page starts at 0)
        size: 10, // Default records per page set to 10
    });

    const { status } = searchParams;

    // API hooks based on the status of the return order
    const {
        data: pendingOrders,
        isLoading: isLoadingPending,
        isError: isErrorPending,
    } = useGetAllPendingReturnRequestsQuery(searchParams);

    const {
        data: rejectedOrders,
        isLoading: isLoadingRejected,
        isError: isErrorRejected,
    } = useGetAllRejectedReturnRequestsQuery(searchParams);

    const {
        data: acceptedOrders,
        isLoading: isLoadingAccepted,
        isError: isErrorAccepted,
    } = useGetAllAcceptedReturnRequestsQuery(searchParams);

    // Logic to determine which orders to display based on selected status
    let orders = [];
    if (status === 'RETURN_PENDING') {
        orders = pendingOrders?.content || [];
    } else if (status === 'RETURN_REJECTED') {
        orders = rejectedOrders?.content || [];
    } else if (status === 'RETURNED') {
        orders = acceptedOrders?.content || [];
    }

    // Handle input change for search
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // Handle search button click
    const handleSearch = () => {
        setSearchParams(prev => ({
            ...prev,
            page: 0 // Reset to first page on search
        }));
    };

    // Calculate total pages based on orders length
    const totalPages = Math.ceil((orders.length || 1) / searchParams.size);

    // Handle page change
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
                <h3>Quản lý Đơn Hàng Trả Lại</h3>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CRow className="mb-3">
                        <CCol><CFormInput type="date" name="startDate" label="Ngày bắt đầu" onChange={handleInputChange} /></CCol>
                        <CCol><CFormInput type="date" name="endDate" label="Ngày kết thúc" onChange={handleInputChange} /></CCol>
                        <CCol><CFormInput type="text" name="orderCode" label="Mã đơn hàng" placeholder="Nhập mã đơn hàng..." onChange={handleInputChange} /></CCol>
                        <CCol>
                            <CFormSelect name="status" label="Trạng thái" onChange={handleInputChange}>
                                <option value="RETURN_PENDING">Đang chờ xử lý</option>
                                <option value="RETURN_REJECTED">Đã từ chối</option>
                                <option value="RETURNED">Đã chấp nhận</option>
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

                {/* Display loading spinner while fetching data */}
                {(isLoadingPending || isLoadingRejected || isLoadingAccepted) && (
                    <CSpinner color="primary" />
                )}

                {/* Handle Error */}
                {(isErrorPending || isErrorRejected || isErrorAccepted) && (
                    <div>Đã xảy ra lỗi khi tải dữ liệu.</div>
                )}

                <CTable striped hover className="mt-4">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Mã đơn</CTableHeaderCell>
                            <CTableHeaderCell>Người mua</CTableHeaderCell>
                            <CTableHeaderCell>Cửa hàng</CTableHeaderCell>
                            <CTableHeaderCell>Ngày đặt</CTableHeaderCell>
                            <CTableHeaderCell>Giá đơn</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell> {/* Column for View Detail */}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {orders.slice((page - 1) * searchParams.size, page * searchParams.size).map((order, index) => (
                            <CTableRow
                                key={index}
                                style={{ cursor: 'pointer' }}
                            >
                                <CTableDataCell>{order.orderCode}</CTableDataCell>
                                <CTableDataCell>{order.ownerName}</CTableDataCell>
                                <CTableDataCell>{order.shopName}</CTableDataCell>
                                <CTableDataCell>{order.createdAt}</CTableDataCell>
                                <CTableDataCell>{order.total?.toLocaleString('vi-VN')} đ</CTableDataCell>
                                <CTableDataCell>
                                    {/* Change to query string format for navigation */}
                                    <CButton color="info" onClick={() => navigate(`/returned-order?id=${order.id}`)}>
                                        Xem chi tiết
                                    </CButton>
                                </CTableDataCell>
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
            </CCardBody>
        </CCard>
    );
};

export default ReturnedOrderList;
