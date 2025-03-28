import React, { useState } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton
} from '@coreui/react';

const NotificationsList = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, orderCode: 'ORD001', seller: 'Nguyễn Văn A', buyer: 'Trần Thị B', deliveryPerson: 'Lê Văn C', time: '2024-03-01', status: 'Chưa đọc' },
        { id: 2, orderCode: 'ORD002', seller: 'Hoàng Minh D', buyer: 'Phan Thị E', deliveryPerson: 'Trần Văn F', time: '2024-03-02', status: 'Đã đọc' },
        { id: 3, orderCode: 'ORD003', seller: 'Lê Minh G', buyer: 'Nguyễn Thị H', deliveryPerson: 'Đoàn Văn I', time: '2024-03-03', status: 'Chưa đọc' }
    ]);

    const markAsRead = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, status: 'Đã đọc' } : notification
            )
        );
    };

    return (
        <CCard>
            <CCardHeader>
                <h3>Danh sách Đơn hàng</h3>
            </CCardHeader>
            <CCardBody>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>#</CTableHeaderCell>
                            <CTableHeaderCell>Mã đơn hàng</CTableHeaderCell>
                            <CTableHeaderCell>Người bán</CTableHeaderCell>
                            <CTableHeaderCell>Người mua</CTableHeaderCell>
                            <CTableHeaderCell>Người giao hàng</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {notifications.map(notification => (
                            <CTableRow key={notification.id}>
                                <CTableDataCell>{notification.id}</CTableDataCell>
                                <CTableDataCell>{notification.orderCode}</CTableDataCell>
                                <CTableDataCell>{notification.seller}</CTableDataCell>
                                <CTableDataCell>{notification.buyer}</CTableDataCell>
                                <CTableDataCell>{notification.deliveryPerson}</CTableDataCell>
                                <CTableDataCell>{notification.time}</CTableDataCell>
                                <CTableDataCell>{notification.status}</CTableDataCell>
                                <CTableDataCell>
                                    {notification.status === 'Chưa đọc' && (
                                        <CButton color="primary" size="sm" onClick={() => markAsRead(notification.id)}>
                                            Đánh dấu đã đọc
                                        </CButton>
                                    )}
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
};

export default NotificationsList;
