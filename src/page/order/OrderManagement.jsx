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
    CPagination,
    CPaginationItem,
    CSpinner,
} from '@coreui/react';
import { useGetOrdersByStatusAndDateQuery } from '../../service/orderService';

const OrderManagement = () => {
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        status: 'all',
        storeName: '',
        shipperName: '',
        page: 0,
        size: 10,
    });

    const [triggerSearch, setTriggerSearch] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setTriggerSearch(true);
    };

    const shouldSkip = !searchParams.startDate || !searchParams.endDate || !triggerSearch;

    const { data, isLoading } = useGetOrdersByStatusAndDateQuery({
        status: searchParams.status !== 'all' ? searchParams.status : 'PENDING',
        startDate: `${searchParams.startDate}T00:00:00`,
        endDate: `${searchParams.endDate}T23:59:59`,
        page: searchParams.page,
        size: searchParams.size,
    }, { skip: shouldSkip });

    const orders = data?.content || [];

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
                        <CCol><CFormInput type="text" name="orderId" label="Mã đơn hàng" placeholder="Nhập mã đơn hàng..." onChange={handleInputChange} /></CCol>
                        <CCol><CFormSelect name="status" label="Trạng thái" onChange={handleInputChange}>
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
                        </CFormSelect></CCol>
                        <CCol className="d-flex align-items-end">
                            <CButton color="primary" onClick={handleSearch}>Tìm kiếm</CButton>
                        </CCol>
                    </CRow>
                </CForm>

                {isLoading ? (
                    <div className="text-center mt-4">
                        <CSpinner color="primary" />
                    </div>
                ) : (
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
                                <CTableRow key={index}>
                                    <CTableDataCell>{order.code || order.id}</CTableDataCell>
                                    <CTableDataCell>{order.username}</CTableDataCell>
                                    <CTableDataCell>{order.name}</CTableDataCell>
                                    <CTableDataCell>{order.createdAt?.slice(0, 10)}</CTableDataCell>
                                    <CTableDataCell>{order.total}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                )}
            </CCardBody>
        </CCard>
    );
};

export default OrderManagement;
