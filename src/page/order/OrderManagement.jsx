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
} from '@coreui/react';

const OrderManagement = () => {
    const [setSearchParams] = useState({
        startDate: '',
        endDate: '',
        product: '',
        status: 'all',
        paymentStatus: 'all',
        shippingStatus: 'all',
        store: '',
    });


    const orders = [
        { id: 'ORD001', customer: 'Nguyễn Văn A', product: 'Cơm rang', date: '2024-03-01', status: 'Hoàn thành', paymentStatus: 'Đã thanh toán', shippingStatus: 'Đã giao' },
        { id: 'ORD002', customer: 'Trần Thị B', product: 'Phở bò', date: '2024-03-02', status: 'Chờ xử lý', paymentStatus: 'Chưa thanh toán', shippingStatus: 'Đang giao' },
        { id: 'ORD003', customer: 'Lê Văn C', product: 'Bún chả', date: '2024-03-03', status: 'Hoàn thành', paymentStatus: 'Đã thanh toán', shippingStatus: 'Đã giao' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

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
                        <CCol><CFormInput type="text" name="product" label="Mã đơn" placeholder="Nhập mã đơn..." onChange={handleInputChange} /></CCol>
                    </CRow>
                    <CRow>
                        <CCol><CFormSelect name="status" label="Trạng thái" onChange={handleInputChange}>
                            <option value="all">Tất cả</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="processing">Đang chuẩn bị</option>
                            <option value="shipping">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Đã hủy</option>
                            <option value="return_pending">Chở xứ lý trả hàng</option>
                            <option value="returned">Đã trả</option>
                            <option value="rejected">Đã từ chối</option>
                            <option value="return_rejected">Từ chối trả hàng</option>
                        </CFormSelect></CCol>
                        <CCol><CFormInput type="text" name="store" label="Cửa hàng" placeholder="Nhập tên cửa hàng..."
                                          onChange={handleInputChange} /></CCol>
                        <CCol className="d-flex align-items-end">
                            <CButton color="primary">Tìm kiếm</CButton>
                        </CCol>
                    </CRow>
                </CForm>
                <CTable striped hover className="mt-4">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Mã đơn</CTableHeaderCell>
                            <CTableHeaderCell>Khách hàng</CTableHeaderCell>
                            <CTableHeaderCell>Sản phẩm</CTableHeaderCell>
                            <CTableHeaderCell>Ngày đặt</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Thanh toán</CTableHeaderCell>
                            <CTableHeaderCell>Vận chuyển</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {orders.map((order, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{order.id}</CTableDataCell>
                                <CTableDataCell>{order.customer}</CTableDataCell>
                                <CTableDataCell>{order.product}</CTableDataCell>
                                <CTableDataCell>{order.date}</CTableDataCell>
                                <CTableDataCell>{order.status}</CTableDataCell>
                                <CTableDataCell>{order.paymentStatus}</CTableDataCell>
                                <CTableDataCell>{order.shippingStatus}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
};

export default OrderManagement;
