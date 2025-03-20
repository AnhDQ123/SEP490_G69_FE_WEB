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
        { id: 1, title: 'Đơn hàng mới', message: 'Bạn có một đơn hàng mới từ Nguyễn Văn A.', date: '2024-03-01', status: 'Chưa đọc' },
        { id: 2, title: 'Thanh toán thành công', message: 'Thanh toán cho đơn hàng ORD002 đã hoàn tất.', date: '2024-03-02', status: 'Đã đọc' },
        { id: 3, title: 'Vận chuyển đơn hàng', message: 'Đơn hàng ORD003 đang được giao.', date: '2024-03-03', status: 'Chưa đọc' }
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
                <h3>Danh sách Thông báo</h3>
            </CCardHeader>
            <CCardBody>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>#</CTableHeaderCell>
                            <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                            <CTableHeaderCell>Nội dung</CTableHeaderCell>
                            <CTableHeaderCell>Ngày</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {notifications.map(notification => (
                            <CTableRow key={notification.id}>
                                <CTableDataCell>{notification.id}</CTableDataCell>
                                <CTableDataCell>{notification.title}</CTableDataCell>
                                <CTableDataCell>{notification.message}</CTableDataCell>
                                <CTableDataCell>{notification.date}</CTableDataCell>
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
