import React from 'react';
import {
    CCard, CCardBody, CCardHeader, CCol, CRow, CImage,
    CFormInput, CFormSelect, CButton, CTable, CTableBody,
    CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
    CBadge
} from '@coreui/react';
import { useParams } from 'react-router-dom';
import { useGetBlogByIdQuery } from '../../service/blogService';
import { useGetCommentsByBlogQuery } from '../../service/commentService';


const BlogDetail = () => {
    const { id } = useParams();
    const { data: blog, isLoading, isError } = useGetBlogByIdQuery(id);
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isError: isCommentsError,
    } = useGetCommentsByBlogQuery({ blogId: id, offset: 0, limit: 20 });

    if (isLoading) return <div>🔄 Đang tải dữ liệu bài viết...</div>;
    if (isError || !blog) return <div>❌ Không thể tải bài viết.</div>;

    const {
        description,
        imageUrl,
        author,
        createdAt,
        reportCount,
        status,
        content,
    } = blog;

    return (
        <div>
            <div className="mb-3 fw-bold fs-5">Quản lý blog &gt; Nội dung blog</div>

            {/* Tổng quan bài viết */}
            <CCard className="mb-4">
                <CCardHeader className="fw-bold">Tổng quan bài viết</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={8}>
                            <div className>
                                <strong>Nội dung bài viết:</strong>
                                <div className="mt-2" style={{whiteSpace: 'pre-line'}}
                                     dangerouslySetInnerHTML={{__html: content}}/>
                            </div>
                            <div className="mb-2">
                                {description?.split('\n')?.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </div>
                        </CCol>
                        <CCol md={4}>
                            <CImage
                                src={imageUrl || 'https://via.placeholder.com/150'}
                                thumbnail
                                width={150}
                                height={100}
                            />
                            <div><strong>Tài khoản viết:</strong> {author?.username}</div>
                            <div><strong>Ngày đăng:</strong> {new Date(createdAt).toLocaleDateString('vi-VN')}</div>
                            <div><strong>Bị báo cáo:</strong> {reportCount || 0}</div>
                            <div>
                                <strong>Trạng thái:</strong>{' '}
                                <CBadge color={status === 'ACTIVE' ? 'warning' : 'success'}>
                                    {status === 'ACTIVE' ? 'Đang bị chặn' : 'Đang hoạt động'}
                                </CBadge>
                            </div>
                            <CButton color="dark" size="sm" className="mt-2">Bỏ chặn</CButton>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Quản lý bình luận (mock) */}
            <CCard>
                <CCardHeader className="fw-bold">Quản lý bình luận</CCardHeader>
                <CCardBody>
                    <CRow className="mb-3">
                        <CCol md={3}>
                            <CFormInput type="date" placeholder="Từ ngày" />
                        </CCol>
                        <CCol md={3}>
                            <CFormInput type="date" placeholder="Đến ngày" />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput placeholder="Tìm kiếm bình luận" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-2">
                        <CCol md={6}><strong>🗨️ Tổng số bình luận</strong> 10</CCol>
                    </CRow>

                    <CTable striped hover bordered responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Người bình luận</CTableHeaderCell>
                                <CTableHeaderCell>Nội dung</CTableHeaderCell>
                                <CTableHeaderCell>Thời gian</CTableHeaderCell>
                                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                                <CTableHeaderCell>Hành động</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {isCommentsLoading ? (
                                <CTableRow>
                                    <CTableDataCell colSpan={5}>🔄 Đang tải bình luận...</CTableDataCell>
                                </CTableRow>
                            ) : isCommentsError ? (
                                <CTableRow>
                                    <CTableDataCell colSpan={5}>❌ Không thể tải bình luận.</CTableDataCell>
                                </CTableRow>
                            ) : comments.length === 0 ? (
                                <CTableRow>
                                    <CTableDataCell colSpan={5}>⚠️ Chưa có bình luận nào.</CTableDataCell>
                                </CTableRow>
                            ) : (
                                comments.map((cmt) => (
                                    <CTableRow key={cmt.id}>
                                        <CTableDataCell>{cmt.writer.name}</CTableDataCell>
                                        <CTableDataCell>{cmt.content}</CTableDataCell>
                                        <CTableDataCell>{new Date(cmt.createdAt).toLocaleString('vi-VN')}</CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge color="success">Hiển thị</CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CButton size="sm" color="danger">Xóa</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default BlogDetail;
