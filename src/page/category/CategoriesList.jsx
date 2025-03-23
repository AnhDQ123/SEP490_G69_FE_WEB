import React, { useEffect, useState } from 'react';
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
    CImage,
    CFormInput,
    CFormSelect,
    CPagination,
    CPaginationItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { useGetAllCategoriesQuery } from '../../service/categoryService';

const CategoryList = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);

    const { data = [], isLoading, error } = useGetAllCategoriesQuery();
    const [filteredData, setFilteredData] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        image: '',
        imageFile: null,
    });


    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.toLowerCase());
            setPage(0);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const filtered = data.filter((cat) =>
            cat.name.toLowerCase().includes(debouncedSearch)
        );
        setFilteredData(filtered);
    }, [data, debouncedSearch]);

    const totalPages = Math.ceil(filteredData.length / size);
    const paginated = filteredData.slice(page * size, page * size + size);

    const handleDelete = (id) => {
        alert(`✅ Đã xoá danh mục ID: ${id} (Demo)`);
        setShowDeleteModal(false);
    };

    const handleAdd = () => {
        setShowAddModal(true);
    };


    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleEdit = (category) => {
        setCategoryToEdit({ ...category }); // clone để tránh ảnh hưởng state gốc
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        alert(`✅ Đã cập nhật danh mục: ${categoryToEdit.name} (Demo)`);
        setShowEditModal(false);
    };

    const handleSaveNewCategory = () => {
        if (!newCategory.name.trim()) {
            alert('⚠️ Vui lòng nhập tên danh mục!');
            return;
        }

        const newCat = {
            ...newCategory,
            id: Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
            image: newCategory.image || 'https://via.placeholder.com/100x60.png?text=No+Image',
        };

        setFilteredData((prev) => [newCat, ...prev]);
        setShowAddModal(false);
        setNewCategory({ name: '', description: '', image: '', imageFile: null });
    };


    if (isLoading) return <p>🔄 Đang tải danh sách danh mục...</p>;
    if (error) return <p>❌ Lỗi khi tải dữ liệu danh mục!</p>;

    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <h4>📋 Danh sách danh mục</h4>
                <CButton color="primary" onClick={handleAdd}>➕ Thêm danh mục</CButton>
            </CCardHeader>

            <CCardBody>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <CFormInput
                            type="text"
                            placeholder="🔍 Tìm kiếm theo tên danh mục..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </CCol>
                    <CCol md={3}>
                        <CFormSelect value={size} onChange={(e) => setSize(Number(e.target.value))}>
                            <option value="5">Hiển thị 5</option>
                            <option value="10">Hiển thị 10</option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tên danh mục</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Mô tả</CTableHeaderCell>
                            <CTableHeaderCell>Ảnh</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {paginated.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={5} className="text-center text-muted">
                                    Không tìm thấy danh mục phù hợp.
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            paginated.map((cat) => (
                                <CTableRow key={cat.id}>
                                    <CTableDataCell>{cat.name}</CTableDataCell>
                                    <CTableDataCell>{cat.createdAt}</CTableDataCell>
                                    <CTableDataCell>{cat.description}</CTableDataCell>
                                    <CTableDataCell>
                                        <CImage src={cat.image} width={100} />
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="warning" onClick={() => handleEdit(cat)}>
                                            ✏
                                        </CButton>{' '}
                                        <CButton size="sm" color="danger" onClick={() => confirmDelete(cat)}>
                                            🗑
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>

                {/* Pagination */}
                {totalPages > 1 && (
                    <CRow className="mt-4 d-flex justify-content-center">
                        <CPagination align="center">
                            <CPaginationItem disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
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
                            <CPaginationItem disabled={page + 1 === totalPages} onClick={() => setPage((p) => p + 1)}>
                                Sau
                            </CPaginationItem>
                        </CPagination>
                    </CRow>
                )}
            </CCardBody>

            {/* Modal xoá danh mục */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} centered>
                <CModalHeader closeButton>
                    <CModalTitle>Xác nhận xoá</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Bạn có chắc chắn muốn xoá danh mục{' '}
                    <strong>{categoryToDelete?.name}</strong> không?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={() => handleDelete(categoryToDelete?.id)}>Xoá</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal update category */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} centered>
                <CModalHeader closeButton>
                    <CModalTitle>📝 Sửa danh mục</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        className="mb-3"
                        label="Tên danh mục"
                        value={categoryToEdit?.name || ''}
                        onChange={(e) =>
                            setCategoryToEdit((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Tên danh mục"
                    />
                    <CFormInput
                        className="mb-3"
                        label="Mô tả"
                        value={categoryToEdit?.description || ''}
                        onChange={(e) =>
                            setCategoryToEdit((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Mô tả"
                    />

                    {/* Upload ảnh từ máy */}
                    <div className="mb-3">
                        <label className="form-label">Ảnh danh mục</label>
                        <CFormInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setCategoryToEdit((prev) => ({
                                        ...prev,
                                        imageFile: file,
                                        image: imageUrl, // dùng preview ảnh
                                    }));
                                }
                            }}
                        />
                    </div>

                    {/* Preview ảnh đã chọn */}
                    {categoryToEdit?.image && (
                        <div className="text-center">
                            <CImage
                                src={categoryToEdit.image}
                                width={150}
                                className="border rounded shadow-sm mt-2"
                            />
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="success" onClick={handleSaveEdit}>
                        Lưu
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal thêm danh mục */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} centered>
                <CModalHeader closeButton>
                    <CModalTitle>➕ Thêm danh mục</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        className="mb-3"
                        label="Tên danh mục"
                        placeholder="Tên danh mục"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                    <CFormInput
                        className="mb-3"
                        label="Mô tả"
                        placeholder="Mô tả"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    />

                    <div className="mb-3">
                        <label className="form-label">Ảnh danh mục</label>
                        <CFormInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setNewCategory((prev) => ({
                                        ...prev,
                                        imageFile: file,
                                        image: imageUrl,
                                    }));
                                }
                            }}
                        />
                    </div>

                    {newCategory.image && (
                        <div className="text-center">
                            <CImage
                                src={newCategory.image}
                                width={150}
                                className="border rounded shadow-sm mt-2"
                            />
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleSaveNewCategory}>Lưu</CButton>
                </CModalFooter>
            </CModal>


        </CCard>
    );
};

export default CategoryList;
