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
import { useSearchAndPaginationQuery } from "../../service/userService.js";

const ShipperList = () => {
    const [shippers, setShippers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const navigate = useNavigate();

    // API lấy danh sách shipper
    const { data, error, isLoading } = useSearchAndPaginationQuery({ search, page, size });

    console.log("Trước khi gọi", data);
    useEffect(() => {
        if (data) {
            const filteredShippers = data.content.filter(user => user.role === 'shipper');
            setShippers(filteredShippers);
        }
    }, [data]);
    console.log("Sau khi ", shippers);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching shippers</p>;

    const handleViewDetail = (shipper) => {
        switch (shipper.status) {
            case "ACTIVE":
                navigate(`/shipper-active/${shipper.id}`);
                break;
            case "PENDING":
                navigate(`/shipper-pending/${shipper.id}`);
                break;
            case "INACTIVE":
                navigate(`/shipper-inactive/${shipper.id}`);
                break;
            case "REJECTED":
                navigate(`/shipper-reject/${shipper.id}`);
                break;
            default:
                alert("Trạng thái người dùng không hợp lệ!");
        }
    };

    return (
        <>
            {/* Ô tìm kiếm và bộ lọc */}
            <CRow className="mb-3">
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
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

            {/* Danh sách shipper */}
            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tài khoản</CTableHeaderCell>
                            <CTableHeaderCell>Tên Shipper</CTableHeaderCell>
                            <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                            <CTableHeaderCell>Ngày đăng ký</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {shippers.map((shipper, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{shipper.username}</CTableDataCell>
                                <CTableDataCell>{shipper.name}</CTableDataCell>
                                <CTableDataCell>{shipper.phone}</CTableDataCell>
                                <CTableDataCell>{shipper.registrationDate}</CTableDataCell>
                                <CTableDataCell>{shipper.status}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" onClick={() => handleViewDetail(shipper)}>
                                        Xem chi tiết
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Phân trang */}
            <CRow className="mt-3 d-flex justify-content-center">
                <CPagination align="center">
                    <CPaginationItem disabled={page === 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                        Trước
                    </CPaginationItem>
                    {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((pageNumber) => (
                        <CPaginationItem key={pageNumber} active={pageNumber === page} onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={page === data?.totalPages} onClick={() => setPage(prev => prev + 1)}>
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default ShipperList;