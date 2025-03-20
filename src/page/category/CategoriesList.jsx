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
    CButton,
    CFormInput
} from '@coreui/react';

const CategoryList = () => {
    const [categories, setCategories] = useState({
        "Danh mục thức ăn nhanh": ["Cơm", "Mỳ, bún & phở", "Bánh mì", "Pizza", "Đồ chay"],
        "Danh mục thực phẩm tươi sống": ["Thịt bò", "Thịt lợn", "Thịt gà", "Cá", "Rau củ", "Trái cây"]
    });
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedValue, setEditedValue] = useState("");

    const handleDelete = (categoryType, categoryName) => {
        setCategories(prevCategories => ({
            ...prevCategories,
            [categoryType]: prevCategories[categoryType].filter(item => item !== categoryName)
        }));
    };

    const handleEdit = (categoryType, categoryName) => {
        setEditingCategory({ type: categoryType, name: categoryName });
        setEditedValue(categoryName);
    };

    const handleSaveEdit = () => {
        if (editingCategory && editedValue.trim()) {
            setCategories(prevCategories => ({
                ...prevCategories,
                [editingCategory.type]: prevCategories[editingCategory.type].map(item =>
                    item === editingCategory.name ? editedValue : item
                )
            }));
            setEditingCategory(null);
            setEditedValue("");
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories(prevCategories => ({
                ...prevCategories,
                "Danh mục thức ăn nhanh": [...prevCategories["Danh mục thức ăn nhanh"], newCategory]
            }));
            setNewCategory("");
        }
    };

    return (
        <CCard>
            <CCardHeader>
                <h3>Cài đặt Danh mục</h3>
            </CCardHeader>
            <CCardBody>
                <CFormInput
                    type="text"
                    placeholder="Tìm kiếm danh mục"
                    className="mb-3"
                />
                <CRow>
                    {Object.keys(categories).map((categoryType, index) => (
                        <CCol md={6} key={index}>
                            <h5 className="mb-3">{categoryType}</h5>
                            <CTable striped hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Tên Danh mục</CTableHeaderCell>
                                        <CTableHeaderCell>Hành động</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {categories[categoryType].map((category, idx) => (
                                        <CTableRow key={idx}>
                                            <CTableDataCell>
                                                {editingCategory && editingCategory.name === category ? (
                                                    <CFormInput
                                                        value={editedValue}
                                                        onChange={(e) => setEditedValue(e.target.value)}
                                                    />
                                                ) : (
                                                    category
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {editingCategory && editingCategory.name === category ? (
                                                    <CButton color="success" size="sm" onClick={handleSaveEdit}>
                                                        💾
                                                    </CButton>
                                                ) : (
                                                    <>
                                                        <CButton color="warning" size="sm" onClick={() => handleEdit(categoryType, category)}>
                                                            ✏
                                                        </CButton>{' '}
                                                        <CButton color="danger" size="sm" onClick={() => handleDelete(categoryType, category)}>
                                                            🗑
                                                        </CButton>
                                                    </>
                                                )}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCol>
                    ))}
                </CRow>
                <CButton color="primary" className="mt-3" onClick={handleAddCategory}>
                    Thêm danh mục mới
                </CButton>
            </CCardBody>
        </CCard>
    );
};

export default CategoryList;
