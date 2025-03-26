import React, {useEffect, useState} from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CSpinner
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
                        <p><strong>Email:</strong> {order.ownerEmail || 'N/A'}</p>
                        <p><strong>SĐT:</strong> {order.ownerPhone || 'N/A'}</p>
                        <p><strong>Ngày đặt:</strong> {order.createdAt?.slice(0, 10) || 'N/A'}</p>
                        <p><strong>Trạng thái:</strong> {order.status || 'N/A'}</p>
                    </CCol>
                    <CCol md={6}>
                        <p><strong>Cửa hàng:</strong> {order.shopName || 'N/A'}</p>
                        <p><strong>Tổng tiền:</strong> {order.total?.toLocaleString('vi-VN') || 0} đ</p>
                        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod || 'N/A'}</p>
                        <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus || 'N/A'}</p>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

export default OrderDetail;
