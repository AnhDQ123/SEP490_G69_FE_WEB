import React, { useEffect, useState } from "react";
import {
    CFormInput,
    CFormSelect,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
    CPagination,
    CPaginationItem,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

// Dữ liệu mock cứng
const mockReports = Array.from({ length: 35 }, (_, index) => ({
    id: index + 1,
    reporter: { username: `user${index + 1}` },
    type: index % 2 === 0 ? "Spam" : "Báo cáo nội dung",
    status: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"][index % 3],
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
}));

const ReportList = () => {
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    // Lọc dữ liệu
    const filteredReports = mockReports.filter((report) => {
        const matchSearch = report.reporter.username.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter ? report.status === statusFilter : true;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredReports.length / size);
    const paginatedReports = filteredReports.slice((page - 1) * size, page * size);

    useEffect(() => {
        if (page > totalPages) setPage(1); // reset nếu page vượt giới hạn sau lọc
    }, [totalPages, page]);

    const handleViewDetail = (report) => {
        navigate(`/report-detail/${report.id}`);
    };

    return (
        <>
            {/* Bộ lọc tìm kiếm */}
            <CRow>
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <CFormInput
                                    placeholder="Tìm kiếm theo người báo cáo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setSearch(searchTerm);
                                            setPage(1);
                                        }
                                    }}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect value={size} onChange={(e) => setSize(Number(e.target.value))}>
                                    <option value="10">Hiển thị 10</option>
                                    <option value="20">Hiển thị 20</option>
                                    <option value="50">Hiển thị 50</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect value={statusFilter} onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}>
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="PENDING">Chờ duyệt</option>
                                    <option value="IN_PROGRESS">Đang xử lý</option>
                                    <option value="COMPLETED">Hoàn thành</option>
                                    <option value="CANCELLED">Từ chối</option>

                                </CFormSelect>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Danh sách báo cáo */}
            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>ID</CTableHeaderCell>
                            <CTableHeaderCell>Người báo cáo</CTableHeaderCell>
                            <CTableHeaderCell>Loại báo cáo</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {paginatedReports.map((report) => (
                            <CTableRow key={report.id}>
                                <CTableDataCell>{report.id}</CTableDataCell>
                                <CTableDataCell>{report.reporter.username}</CTableDataCell>
                                <CTableDataCell>{report.type}</CTableDataCell>
                                <CTableDataCell>{report.status}</CTableDataCell>
                                <CTableDataCell>{new Date(report.createdAt).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" onClick={() => handleViewDetail(report)}>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <CPaginationItem key={pageNumber} active={pageNumber === page} onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default ReportList;
