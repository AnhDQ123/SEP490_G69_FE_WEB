import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CForm,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
    CFormInput,
    CFormSelect,
    CPagination,
    CPaginationItem
} from '@coreui/react';
import { useGetAllReportsQuery } from '../../service/reportService';

const ReportList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);  // Mặc định là 10 báo cáo mỗi trang
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    // Gọi API lấy danh sách báo cáo theo tìm kiếm và trạng thái
    const { data, error, isLoading } = useGetAllReportsQuery({
        search,
        status: statusFilter,
        page: page - 1,  // API yêu cầu bắt đầu từ trang 0
        size
    });

    useEffect(() => {
        if (data) {
            console.log("Report Data:", data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy danh sách báo cáo.</p>;

    // Xử lý điều hướng chi tiết báo cáo
    const handleViewDetail = (report) => {
        navigate(`/report-detail/${report.id}`);
    };

    return (
        <>
            {/* Bộ lọc tìm kiếm */}
            <CRow className="mb-3">
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <CFormInput
                                    type="text"
                                    placeholder="Tìm kiếm theo tên báo cáo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setSearch(searchTerm);
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
                                <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="PENDING">Chưa xử lý</option>
                                    <option value="IN_PROGRESS">Đã xử lý</option>
                                    <option value="COMPLETED">Hoàn thành</option>
                                    <option value="CANCELLED">Bị từ chối</option>
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
                            <CTableHeaderCell>Loại báo cáo</CTableHeaderCell>
                            <CTableHeaderCell>Người tạo</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Ngày</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.content?.map((report) => (
                            <CTableRow key={report.id}>
                                <CTableDataCell>{report.reportType}</CTableDataCell>
                                <CTableDataCell>{report.creator?.userId}</CTableDataCell>
                                <CTableDataCell>{report.status}</CTableDataCell>
                                <CTableDataCell>{report.createdAt}</CTableDataCell>
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
                    <CPaginationItem
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Trước
                    </CPaginationItem>
                    {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((pageNumber) => (
                        <CPaginationItem
                            key={pageNumber}
                            active={pageNumber === page}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem
                        disabled={page === data?.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default ReportList;
