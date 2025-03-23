// ShipperList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CFormSelect, CRow, CTable, CTableBody, CTableDataCell,
    CTableHead, CTableHeaderCell, CTableRow,
    CPagination, CPaginationItem, CButton
} from '@coreui/react';
import { useGetShippersByStatusQuery } from '../../service/shipperService';

const ShipperList = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('ACTIVE');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    const { data, error, isLoading } = useGetShippersByStatusQuery({
        status,
        page,
        size,
        search: debouncedSearch,
    });

    const shippers = data?.content || [];
    const totalPages = data?.totalPages || 1;

    const handleViewDetail = (shipper) => {
        console.log(shipper)
        const status = shipper.shipper_status || null;
        const id = shipper.userId || shipper.id;

        switch (status) {
            case 'PENDING':
                navigate(`/shipper-pending/${id}`);
                break;
            case 'ACTIVE':
                navigate(`/shipper-active/${id}`);
                break;
            case 'INACTIVE':
                navigate(`/shipper-inactive/${id}`);
                break;
            default:
                alert('⚠️ Trạng thái người giao hàng không hợp lệ!');
        }
    };

    if (isLoading) return <p>🔄 Đang tải danh sách shipper...</p>;
    if (error) return <p>❌ Lỗi khi lấy dữ liệu shipper!</p>;

    return (
        <>
            <CRow className="mb-3">
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="🔍 Tìm kiếm theo tên hoặc số điện thoại..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
                                    <option value="PENDING">Chờ duyệt</option>
                                    <option value="ACTIVE">Hoạt động</option>
                                    <option value="INACTIVE">Tạm dừng</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect value={size} onChange={(e) => setSize(Number(e.target.value))}>
                                    <option value="10">Hiển thị 10</option>
                                    <option value="20">Hiển thị 20</option>
                                    <option value="50">Hiển thị 50</option>
                                </CFormSelect>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CRow>

            <CRow>
                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Họ tên</CTableHeaderCell>
                            <CTableHeaderCell>SĐT</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {shippers.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={5} className="text-center text-muted">
                                    Không có shipper nào phù hợp
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            shippers.map((shipper, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{shipper.name}</CTableDataCell>
                                    <CTableDataCell>{shipper.phone}</CTableDataCell>
                                    <CTableDataCell>{shipper.email}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="info" onClick={() => handleViewDetail(shipper)}>
                                            Xem chi tiết
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>
            </CRow>

            <CRow className="mt-3 d-flex justify-content-center">
                <CPagination align="center">
                    <CPaginationItem disabled={page === 0} onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>
                        Trước
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <CPaginationItem
                            key={i}
                            active={i === page}
                            onClick={() => setPage(i)}
                        >
                            {i + 1}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={page + 1 === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default ShipperList;
