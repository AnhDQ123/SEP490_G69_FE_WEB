import React, { useEffect, useState } from 'react';
import {
    CForm,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormSelect, CTableFoot,
} from '@coreui/react';
import { useGetProductsByShopQuery } from "../../service/productService";
import { useParams, useNavigate } from "react-router-dom";

const ProductList = () => {
    const { id } = useParams(); // Lấy shopId từ URL
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    // Get product list by shop id
    const { data, error, isLoading } = useGetProductsByShopQuery({ id, page: 1, size: 20 });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (data) {
            setProducts(data.content);
        }
    }, [data]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching products</p>;

    return (
        <>
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
                                    placeholder="Nhập tên sản phẩm"
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
            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Tên sản phẩm</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Danh mục sản phẩm</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hãng sản xuất</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {products
                            .filter(product => product.name.toLowerCase().includes(search.toLowerCase())) // Tìm kiếm theo tên sản phẩm
                            .map((product, index) => (
                                <CTableRow
                                    key={index}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${product.id}`)} // Chuyển hướng khi click vào sản phẩm
                                >
                                    <CTableHeaderCell scope="row">{product.name}</CTableHeaderCell>
                                    <CTableDataCell>{product.category}</CTableDataCell>
                                    <CTableDataCell>{product.manufacturer}</CTableDataCell>
                                    <CTableDataCell>
                                        <button type="button" className="btn btn-info mb-3"> Xem chi tiết</button>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                    </CTableBody>
                    <CTableFoot>
                        {/* Pagination could be added here */}
                    </CTableFoot>
                </CTable>
            </CRow>
        </>
    );
};

export default ProductList;
