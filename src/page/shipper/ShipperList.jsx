import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CFormSelect,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
    CButton
} from '@coreui/react';
import { useGetShippersByStatusQuery } from '../../service/shipperService';

const ShipperList = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState('PENDING'); // Mặc định lọc shipper đang chờ
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    // Call API
    const { data, error, isLoading } = useGetShippersByStatusQuery({
        status,
        page,
        size,
        search: debouncedSearch,
    });

    const shippers = data?.content || [];
    const totalPages = data?.totalPages || 1;

    // Điều hướng sang detail tương ứng theo trạng thái shipper
    const handleViewDetail = (shipper) => {
        const { shipperStatus, userId } = shipper;

        switch (shipperStatus) {
            case 'ACTIVE':
                navigate(`/shipper-active/${userId}`);
                break;
            case 'PENDING':
                navigate(`/shipper-pending/${userId}`);
                break;
            case 'INACTIVE':
                navigate(`/shipper-inactive/${userId}`);
                break;
            default:
                alert('⚠️ Trạng thái người giao hàng không hợp lệ!');
        }
    };

    if (isLoading) return <p>🔄 Đang tải danh sách shipper...</p>;
    if (error) return <p>❌ Lỗi khi lấy dữ liệu shipper!</p>;

    return (
        <>
            {/* Tìm kiếm và bộ lọc */}
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

            {/* Bảng dữ liệu */}
            <CRow>
                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Họ tên</CTableHeaderCell>
                            <CTableHeaderCell>SĐT</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
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
                                    <CTableDataCell>{shipper.shipperStatus}</CTableDataCell>
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

            {/* Phân trang */}
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
