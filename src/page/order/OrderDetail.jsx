import React, {useEffect, useState} from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CSpinner, CTableDataCell, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody
} from '@coreui/react';
import {useParams} from 'react-router-dom';
import {useGetOrderByIdQuery} from '../../service/orderService';

const OrderDetail = () => {
    const {id} = useParams();
    const [order, setOrder] = useState({});
    const {data, isLoading} = useGetOrderByIdQuery(id);
    useEffect(() => {
        if (data) {
            setOrder(data);
        }
    }, [data]);
    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <CSpinner color="primary"/>
            </div>
        );
    }

    if (!order) return <p>Không tìm thấy đơn hàng.</p>;

    return (
        <CCard>
            <CCardHeader>
                <h4>Chi tiết đơn hàng #{order.code || order.id}</h4>
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol md={6}>
                        <p><strong>Người mua:</strong> {order.ownerName || 'N/A'}</p>
                        <p><strong>SĐT:</strong> {order.phone || 'N/A'}</p>
                        <p><strong>Ngày đặt:</strong> {order.createdAt?.slice(0, 10) || 'N/A'}</p>
                        <p><strong>Trạng thái:</strong> {order.status || 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                        <p><strong>Cửa hàng:</strong> {order.shopName || 'N/A'}</p>
                        <p><strong>Tổng tiền:</strong> {order.total?.toLocaleString('vi-VN')}đ</p>
                        <p><strong>Phí ship: </strong> {order.shippingFee?.toLocaleString('vi-VN')}đ</p>
                        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethodName}</p>
                    </CCol>
                </CRow>
                    <CRow>
                        <CCol xs={12}>
                            <strong>Sản phẩm trong đơn:</strong>
                            <CTable bordered responsive className="mt-2">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: '66.66%' }}>Tên sản phẩm</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: '34.33%' }}>Số lượng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {order?.orderItem?.length > 0 ? (
                                        order.orderItem.map((item, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell>{item.productName}</CTableDataCell>
                                                <CTableDataCell>{item.quantity}</CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} className="text-center">
                                                Không có sản phẩm
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCol>
                    </CRow>
                <CTableRow>
                    <CTableDataCell><strong>Tổng giá:</strong> {order?.total?.toLocaleString()} VNĐ</CTableDataCell>
                </CTableRow>
            </CCardBody>
        </CCard>
    );
};

export default OrderDetail;
