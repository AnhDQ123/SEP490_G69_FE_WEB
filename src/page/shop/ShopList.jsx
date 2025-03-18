import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CForm,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableFoot,
    CButton,
    CFormInput,
    CPagination,
    CPaginationItem,
    CFormSelect
} from "@coreui/react";
import { useSearchAndPaginateShopsQuery } from "../../service/shopService";

const ShopList = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const navigate = useNavigate();

    // Gọi API lấy danh sách cửa hàng theo search và status
    const { data, error, isLoading } = useSearchAndPaginateShopsQuery({ status, search, page:page - 1, size });

    useEffect(() => {
        if (data) {
            console.log("Shop Data:", data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy danh sách cửa hàng.</p>;

    // Xử lý điều hướng dựa vào trạng thái cửa hàng
    const handleViewDetail = (shop) => {
        switch (shop.isActive) {
            case "ACTIVE":
                navigate(`/shop-active/${shop.id}`);
                break;
            case "PENDING":
                navigate(`/shop-pending/${shop.id}`);
                break;
            case "INACTIVE":
                navigate(`/shop-inactive/${shop.id}`);
                break;
            case "REJECTED":
                navigate(`/shop-reject/${shop.id}`);
                break;
            default:
                alert("Trạng thái cửa hàng không hợp lệ!");
        }
    };

    return (
        <>
            {/* Bộ lọc tìm kiếm */}
            <CRow>
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <h3>Tìm kiếm</h3>
                            </CTableDataCell>
                            <CTableDataCell>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên hoặc thông tin cần tìm kiếm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect>
                                    <option value="0">Sắp xếp theo</option>
                                    <option value="1">Thời gian</option>
                                    <option value="2">Trạng thái</option>
                                </CFormSelect>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Danh sách cửa hàng */}
            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tên cửa hàng</CTableHeaderCell>
                            <CTableHeaderCell>Chủ cửa hàng</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.content?.map((shop) => (
                            <CTableRow key={shop.id}>
                                <CTableDataCell>{shop.name}</CTableDataCell>
                                <CTableDataCell>{shop.owner?.username}</CTableDataCell>
                                <CTableDataCell>{shop.isActive}</CTableDataCell>
                                <CTableDataCell>{shop.phone}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" onClick={() => handleViewDetail(shop)}>
                                        Xem chi tiết
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                    {/*<CTableFoot>*/}
                    {/*    <CTableRow>*/}
                    {/*        <CTableHeaderCell>*/}
                    {/*            <span>Tổng số: {data?.totalElements || 0} cửa hàng</span>*/}
                    {/*        </CTableHeaderCell>*/}
                    {/*    </CTableRow>*/}
                    {/*</CTableFoot>*/}
                </CTable>
            </CRow>

            {/* Phân trang */}
            <CRow className="mt-3 d-flex justify-content-center">
                <CPagination align="center">
                    <CPaginationItem disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
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

                    <CPaginationItem disabled={page === data?.totalPages} onClick={() => setPage((prev) => prev + 1)}>
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default ShopList;
