import React, {useEffect, useState} from 'react';
import {
    CRow, CCol, CCard, CCardBody, CCardHeader, CTable, CTableBody,
    CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton,
    CImage, CFormInput, CFormSelect, CPagination, CPaginationItem,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
} from '@coreui/react';

import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from '../../service/categoryService';
import {categoryValidationSchema} from "../../utils/validation.js";

const CategoriesList = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);

    const {data, isLoading, error, refetch} = useGetAllCategoriesQuery({
        search: debouncedSearch || '',
        page,
        size
    });

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        imageFile: null,
        image: '',
    });

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim().toLowerCase());
            setPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    // Handle delete
    const handleDelete = async () => {
        try {
            await deleteCategory(categoryToDelete.id).unwrap();
            alert('🗑️ Xoá thành công');
            refetch();
        } catch {
            alert('❌ Xoá thất bại');
        } finally {
            setShowDeleteModal(false);
        }
    };

    // Handle create
    const handleSaveNewCategory = async () => {
        try {
            // Validate the newCategory data
            await categoryValidationSchema.validate(newCategory, { abortEarly: false });

            // If validation passes, save the category
            await createCategory({ data: newCategory, file: newCategory.imageFile }).unwrap();
            alert('✅ Thêm thành công');
            setShowAddModal(false);
            setNewCategory({ name: '', description: '', imageFile: null, image: '' });
        } catch (err) {
            // If validation fails, show errors
            if (err.inner) {
                const errorMessages = err.inner.map((error) => error.message);
                alert(`❌ Lỗi: ${errorMessages.join(', ')}`);
            } else {
                alert(`❌ Lỗi: ${err.message}`);
            }
        }
    };

    // Handle update
    const handleSaveEdit = async () => {
        if (!categoryToEdit.name.trim()) return alert('⚠️ Vui lòng nhập tên danh mục');
        try {
            await updateCategory({
                id: categoryToEdit.id,
                data: categoryToEdit,
                file: categoryToEdit.imageFile,
            }).unwrap();
            alert('✅ Cập nhật thành công');
            setShowEditModal(false);
            refetch();
        } catch {
            alert('❌ Cập nhật thất bại');
        }
    };

    const categories = data?.content || [];
    const totalPages = data?.totalPages || 1;

    if (isLoading) return <p>🔄 Đang tải danh sách danh mục...</p>;
    if (error) return <p>❌ Lỗi khi tải danh mục!</p>;

    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <h4>📋 Danh sách danh mục</h4>
                <CButton color="primary" onClick={() => setShowAddModal(true)}>➕ Thêm danh mục</CButton>
            </CCardHeader>

            <CCardBody>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <CFormInput
                            placeholder="🔍 Tìm kiếm theo tên danh mục..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </CCol>
                    <CCol md={3}>
                        <CFormSelect value={size} onChange={(e) => setSize(Number(e.target.value))}>
                            <option value="5">Hiển thị 5</option>
                            <option value="10">Hiển thị 10</option>
                            <option value="20">Hiển thị 20</option>
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
                        {categories.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={5} className="text-center text-muted">
                                    Không tìm thấy danh mục phù hợp.
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            categories.map((cat) => (
                                <CTableRow key={cat.id}>
                                    <CTableDataCell>{cat.name}</CTableDataCell>
                                    <CTableDataCell>{cat.createdAt}</CTableDataCell>
                                    <CTableDataCell>{cat.description}</CTableDataCell>
                                    <CTableDataCell><CImage src={cat.image} width={100}/></CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="warning" onClick={() => {
                                            setCategoryToEdit({...cat});
                                            setShowEditModal(true);
                                        }}>✏</CButton>{' '}
                                        <CButton size="sm" color="danger" onClick={() => {
                                            setCategoryToDelete(cat);
                                            setShowDeleteModal(true);
                                        }}>🗑</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>

                {totalPages > 1 && (
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
                )}
            </CCardBody>

            {/* Delete Modal */}
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} centered>
                <CModalHeader closeButton><CModalTitle>Xác nhận xoá</CModalTitle></CModalHeader>
                <CModalBody>Bạn có chắc muốn xoá <strong>{categoryToDelete?.name}</strong>?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDelete}>Xoá</CButton>
                </CModalFooter>
            </CModal>

            {/* Edit Modal */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} centered>
                <CModalHeader closeButton>
                    <CModalTitle>📝 Sửa danh mục</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {/* Tên danh mục */}
                    <CFormInput
                        className="mb-3"
                        placeholder="Tên danh mục"
                        value={categoryToEdit?.name || ''}
                        onChange={(e) =>
                            setCategoryToEdit((prev) => ({...prev, name: e.target.value}))
                        }
                    />

                    {/* Mô tả */}
                    <CFormInput
                        className="mb-3"
                        placeholder="Mô tả"
                        value={categoryToEdit?.description || ''}
                        onChange={(e) =>
                            setCategoryToEdit((prev) => ({...prev, description: e.target.value}))
                        }
                    />

                    {/* Nhập URL ảnh */}
                    <CFormInput
                        className="mb-2"
                        placeholder="URL ảnh từ trang web (nếu có)"
                        value={categoryToEdit?.image || ''}
                        onChange={(e) =>
                            setCategoryToEdit((prev) => ({
                                ...prev,
                                image: e.target.value,
                                imageFile: null, // reset file nếu dùng URL
                            }))
                        }
                    />

                    {/* Upload ảnh từ máy */}
                    <div className="mb-3">
                        <label className="form-label">Hoặc chọn ảnh từ máy</label>
                        <CFormInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const previewURL = URL.createObjectURL(file);
                                    setCategoryToEdit((prev) => ({
                                        ...prev,
                                        imageFile: file,
                                        image: previewURL,
                                    }));
                                }
                            }}
                        />
                    </div>

                    {/* Preview ảnh */}
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


            {/* Add Modal */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} centered>
                <CModalHeader closeButton>
                    <CModalTitle>➕ Thêm danh mục</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {/* Tên danh mục */}
                    <CFormInput
                        className="mb-3"
                        placeholder="Tên danh mục"
                        value={newCategory.name}
                        onChange={(e) =>
                            setNewCategory((prev) => ({...prev, name: e.target.value}))
                        }
                    />

                    {/* Mô tả */}
                    <CFormInput
                        className="mb-3"
                        placeholder="Mô tả"
                        value={newCategory.description}
                        onChange={(e) =>
                            setNewCategory((prev) => ({...prev, description: e.target.value}))
                        }
                    />

                    {/* Nhập URL ảnh */}
                    <CFormInput
                        className="mb-2"
                        placeholder="URL ảnh từ trang web (nếu có)"
                        value={newCategory.image}
                        onChange={(e) =>
                            setNewCategory((prev) => ({
                                ...prev,
                                image: e.target.value,
                                imageFile: null, // reset file nếu dùng URL
                            }))
                        }
                    />

                    {/* Upload ảnh từ máy */}
                    <div className="mb-3">
                        <label className="form-label">Hoặc chọn ảnh từ máy</label>
                        <CFormInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const previewURL = URL.createObjectURL(file);
                                    setNewCategory((prev) => ({
                                        ...prev,
                                        imageFile: file,
                                        image: previewURL,
                                    }));
                                }
                            }}
                        />
                    </div>

                    {/* Preview ảnh */}
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
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleSaveNewCategory}>
                        Lưu
                    </CButton>
                </CModalFooter>
            </CModal>

        </CCard>
    );
};

export default CategoriesList;
