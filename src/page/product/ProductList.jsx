import React, { useEffect, useState } from 'react'
import {
    CForm,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableFoot, CFormSelect,
} from '@coreui/react'
import {useGetProductQuery} from "../../service/productService.js";
import {useNavigate} from "react-router-dom";
const ProductList = () => {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('');
    const navigate = useNavigate()
    const {data, error, isLoading} = useGetProductQuery();
    console.log(data)
    useEffect(() => {
        if (data) {
            setProducts(data.content);
        }
    }, [data]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching users</p>;

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
                            <CTableHeaderCell scope="col">Tên cửa hàng</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Loại sản phẩm</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hãng sản xuất</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {products.map((product, index) => (
                            <CTableRow
                                key={index}
                                style={{cursor: 'pointer'}}
                                onClick={() => navigate(`/product/${product.id}`)} // Chuyển hướng khi click vào user
                            >
                                <CTableHeaderCell scope="row">{product.name}</CTableHeaderCell>
                                <CTableDataCell>{product.supplier}</CTableDataCell>
                                <CTableDataCell>{product.category}</CTableDataCell>
                                <CTableDataCell>{product.manufacturer}</CTableDataCell>
                                <CTableDataCell>
                                    <button type="button" className="btn btn-info mb-3"> Xem chi tiết</button>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                    <CTableFoot>
                        {/*<CTableRow>*/}
                        {/*    <CTableHeaderCell scope="col" colSpan={5} className='text-center'>*/}
                        {/*        1 2 3 4 5 6 7 8 9 10...*/}
                        {/*    </CTableHeaderCell>*/}
                        {/*</CTableRow>*/}
                    </CTableFoot>
                </CTable>
            </CRow>
        </>
    )
}

export default ProductList
