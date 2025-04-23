import React, { useState } from 'react';
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
    const [showFullContent, setShowFullContent] = useState(false);
    const previewLength = 200;
    const { data: blog, isLoading, isError } = useGetBlogByIdQuery(id);
    const {
        data: comments = [], // Đảm bảo rằng comments luôn là mảng mặc định
        isLoading: isCommentsLoading,
        isError: isCommentsError,
    } = useGetCommentsByBlogQuery({ blogId: id, offset: 0, limit: 20 });

    // Kiểm tra nếu dữ liệu bài viết không có hoặc lỗi
    if (isLoading) return <div>🔄 Đang tải dữ liệu bài viết...</div>;
    if (isError || !blog) return <div>❌ Không thể tải bài viết.</div>;

    const {
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
                            <div>
                                <strong>Nội dung bài viết:</strong>

                                {!showFullContent ? (
                                    <>
                                        <div
                                            className="text-truncate p-2 border rounded bg-light"
                                            style={{
                                                maxWidth: '100%',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                            title={content} // hiện toàn bộ khi hover
                                        >
                                            {content}
                                        </div>
                                        {content.length > previewLength && (
                                            <div>
                                                <CButton
                                                    size="sm"
                                                    color="link"
                                                    onClick={() => setShowFullContent(true)}
                                                >
                                                    Xem thêm
                                                </CButton>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="mt-2 p-2 border rounded"
                                            style={{whiteSpace: 'pre-line', backgroundColor: '#f8f9fa'}}
                                            dangerouslySetInnerHTML={{__html: content}}
                                        />
                                        <div>
                                            <CButton
                                                size="sm"
                                                color="link"
                                                onClick={() => setShowFullContent(false)}
                                            >
                                                Ẩn bớt
                                            </CButton>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CCol>
                        <CCol md={4}>
                            <div><strong>Tài khoản viết:</strong> {id.username}</div>
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

            {/* Quản lý bình luận */}
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
                        <CCol md={6}><strong>🗨️ Tổng số bình luận</strong> {comments.length}</CCol>
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
