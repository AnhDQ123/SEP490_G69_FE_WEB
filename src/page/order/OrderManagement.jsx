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
import { useGetOrdersByFilterQuery } from '../../service/orderService';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        status: 'all',
        orderCode: '',
        page: 0,
        size: 10,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setSearchParams(prev => ({
            ...prev,
            page: 0 // reset về trang đầu mỗi khi tìm kiếm
        }));
    };

    // Tạo params chỉ chứa field có giá trị
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

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setSearchParams(prev => ({ ...prev, page: newPage }));
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
                                    <CTableDataCell>{order.code || order.id}</CTableDataCell>
                                        <CTableDataCell>{order.ownerName}</CTableDataCell>
                                        <CTableDataCell>{order.shopName}</CTableDataCell>
                                        <CTableDataCell>{order.createdAt?.slice(0, 10)}</CTableDataCell>
                                        <CTableDataCell>{order.total?.toLocaleString('vi-VN')} đ</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                        {/* Pagination */}
                        <div className="d-flex justify-content-center mt-4">
                            <CPagination>
                                <CPaginationItem
                                    disabled={searchParams.page === 0}
                                    onClick={() => handlePageChange(searchParams.page - 1)}
                                >
                                    Trước
                                </CPaginationItem>
                                <CPaginationItem active>{searchParams.page + 1}</CPaginationItem>
                                <CPaginationItem
                                    disabled={searchParams.page + 1 >= totalPages}
                                    onClick={() => handlePageChange(searchParams.page + 1)}
                                >
                                    Sau
                                </CPaginationItem>
                            </CPagination>
                        </div>
                    </>
                )}
            </CCardBody>
        </CCard>
    );
};

export default OrderManagement;
