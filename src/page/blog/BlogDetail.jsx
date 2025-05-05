import React, { useState } from 'react';
import {
    CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CFormInput,
    CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
    CBadge, CModal, CModalBody, CModalFooter, CModalHeader,
} from '@coreui/react';
import { useParams } from 'react-router-dom';
import { useGetBlogByIdQuery, useUpdateBlogMutation } from '../../service/blogService';
import {
    useGetCommentsByBlogQuery,
    useDeleteCommentMutation,
} from '../../service/commentService';
import { BASE_URL } from '../../utils/constant';

const BlogDetail = () => {
    const { id } = useParams();
    const [showFullContent, setShowFullContent] = useState(false);
    const previewLength = 200;
    const [page, setPage] = useState(1);
    const limit = 10;

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [openReplies, setOpenReplies] = useState({});
    const [repliesData, setRepliesData] = useState({});
    const [repliesLoading, setRepliesLoading] = useState({});
    const replyLimit = 3;

    const { data: blog, isLoading, isError } = useGetBlogByIdQuery(id);
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        refetch: refetchComments,
    } = useGetCommentsByBlogQuery({
        blogId: id,
        offset: (page - 1) * limit,
        limit,
    });

    const [unblockBlog] = useUpdateBlogMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const handleToggleReplies = async (commentId) => {
        const currentlyOpen = openReplies[commentId];
        setOpenReplies((prev) => ({ ...prev, [commentId]: !currentlyOpen }));

        if (!currentlyOpen && !repliesData[commentId]) {
            try {
                setRepliesLoading((prev) => ({ ...prev, [commentId]: true }));
                const response = await fetch(`${BASE_URL}/api/comments/replies?parentId=${commentId}&offset=0&limit=${replyLimit}`);
                const data = await response.json();
                setRepliesData((prev) => ({
                    ...prev,
                    [commentId]: {
                        data,
                        offset: data.length,
                        hasMore: data.length === replyLimit,
                    },
                }));
            } catch (error) {
                console.error('Error loading replies:', error);
                setRepliesData((prev) => ({ ...prev, [commentId]: { data: [], offset: 0, hasMore: false } }));
            } finally {
                setRepliesLoading((prev) => ({ ...prev, [commentId]: false }));
            }
        }
    };

    const handleLoadMoreReplies = async (commentId) => {
        try {
            setRepliesLoading((prev) => ({ ...prev, [commentId]: true }));
            const prevReplies = repliesData[commentId]?.data || [];
            const offset = repliesData[commentId]?.offset || 0;

            const response = await fetch(`${BASE_URL}/api/comments/replies?parentId=${commentId}&offset=${offset}&limit=${replyLimit}`);
            const newReplies = await response.json();

            setRepliesData((prev) => ({
                ...prev,
                [commentId]: {
                    data: [...prevReplies, ...newReplies],
                    offset: offset + newReplies.length,
                    hasMore: newReplies.length === replyLimit,
                },
            }));
        } catch (error) {
            console.error('Error loading more replies:', error);
        } finally {
            setRepliesLoading((prev) => ({ ...prev, [commentId]: false }));
        }
    };

    const confirmDeleteComment = (commentId) => {
        setSelectedCommentId(commentId);
        setShowConfirmModal(true);
    };

    const handleUnblock = async () => {
        try {
            await unblockBlog(id).unwrap();
            alert('✅ Đã bỏ chặn blog!');
        } catch (error) {
            console.error('Unblock error:', error);
            alert('❌ Lỗi khi bỏ chặn blog.');
        }
    };

    const handleDeleteConfirmed = async () => {
        if (!selectedCommentId) return;
        try {
            await deleteComment(selectedCommentId);
            await refetchComments();
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000);
        } catch (error) {
            console.error('Delete comment error:', error);
            alert('❌ Lỗi khi xóa bình luận.');
        } finally {
            setShowConfirmModal(false);
            setSelectedCommentId(null);
        }
    };

    if (isLoading) return <div>🔄 Đang tải dữ liệu bài viết...</div>;
    if (isError || !blog) return <div>❌ Không thể tải bài viết.</div>;

    const { createdAt, reportCount = 0, status, content = '', writer } = blog;

    return (
        <div>
            <div className="mb-3 fw-bold fs-5">Quản lý blog &gt; Nội dung blog</div>

            <CCard className="mb-4">
                <CCardHeader className="fw-bold">Tổng quan bài viết</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={8}>
                            <strong>Nội dung bài viết:</strong>
                            {blog.content ? (
                                !showFullContent ? (
                                    <>
                                        <div className="text-truncate p-2 border rounded bg-light" style={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={content}>{content}</div>
                                        {content.length > previewLength && (
                                            <CButton size="sm" color="link" onClick={() => setShowFullContent(true)}>Xem thêm</CButton>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-2 p-2 border rounded" style={{ whiteSpace: 'pre-line', backgroundColor: '#f8f9fa' }} dangerouslySetInnerHTML={{ __html: content }} />
                                        <CButton size="sm" color="link" onClick={() => setShowFullContent(false)}>Ẩn bớt</CButton>
                                    </>
                                )
                            ) : <div className="text-muted">Không có nội dung.</div>}
                        </CCol>
                        <CCol md={4}>
                            <div><strong>Tài khoản viết:</strong> {writer?.username || 'Không xác định'}</div>
                            <div><strong>Ngày đăng:</strong> {new Date(createdAt).toLocaleDateString('vi-VN')}</div>
                            <div><strong>Bị báo cáo:</strong> {reportCount}</div>
                            <div>
                                <strong>Trạng thái:</strong>{' '}
                                <CBadge color={status === 'ACTIVE' ? 'warning' : 'success'}>
                                    {status === 'ACTIVE' ? 'Đang bị chặn' : 'Đang hoạt động'}
                                </CBadge>
                            </div>
                            {status === 'ACTIVE' && (
                                <CButton color="dark" size="sm" className="mt-2" onClick={handleUnblock}>
                                    Bỏ chặn
                                </CButton>
                            )}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <CCard>
                <CCardHeader className="fw-bold">Quản lý bình luận</CCardHeader>
                <CCardBody>
                    <CRow className="mb-3">
                        <CCol md={3}><CFormInput type="date" placeholder="Từ ngày" /></CCol>
                        <CCol md={3}><CFormInput type="date" placeholder="Đến ngày" /></CCol>
                        <CCol md={6}><CFormInput placeholder="Tìm kiếm bình luận" /></CCol>
                    </CRow>

                    <CRow className="mb-2">
                        <CCol md={6}><strong>🗨️ Tổng số bình luận:</strong> {comments.length}</CCol>
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
                                <CTableRow><CTableDataCell colSpan={5}>🔄 Đang tải bình luận...</CTableDataCell></CTableRow>
                            ) : isCommentsError ? (
                                <CTableRow><CTableDataCell colSpan={5}>❌ Không thể tải bình luận.</CTableDataCell></CTableRow>
                            ) : comments.length === 0 ? (
                                <CTableRow><CTableDataCell colSpan={5}>⚠️ Chưa có bình luận nào.</CTableDataCell></CTableRow>
                            ) : (
                                comments.map((cmt) => {
                                    const isOpen = openReplies[cmt.id];
                                    const isRepliesLoading = repliesLoading[cmt.id];
                                    const replyInfo = repliesData[cmt.id] || { data: [], hasMore: false };
                                    const replies = replyInfo.data;
                                    const hasMore = replyInfo.hasMore;

                                    return (
                                        <React.Fragment key={cmt.id}>
                                            <CTableRow>
                                                <CTableDataCell>
                                                    <CButton size="sm" color="link" onClick={() => handleToggleReplies(cmt.id)}>
                                                        {isOpen ? '⌄' : '›'}
                                                    </CButton>{' '}
                                                    {cmt.writer?.name || 'Ẩn danh'}
                                                </CTableDataCell>
                                                <CTableDataCell>{cmt.content}</CTableDataCell>
                                                <CTableDataCell>{new Date(cmt.createdAt).toLocaleString('vi-VN')}</CTableDataCell>
                                                <CTableDataCell><CBadge color="success">Hiển thị</CBadge></CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton size="sm" color="danger" onClick={() => confirmDeleteComment(cmt.id)}>
                                                        Xóa
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>

                                            {isOpen && (
                                                <>
                                                    {isRepliesLoading ? (
                                                        <CTableRow>
                                                            <CTableDataCell colSpan={5} className="bg-light">🔄 Đang tải phản hồi...</CTableDataCell>
                                                        </CTableRow>
                                                    ) : replies.length === 0 ? (
                                                        <CTableRow>
                                                            <CTableDataCell colSpan={5} className="bg-light text-muted">⚠️ Không có phản hồi nào</CTableDataCell>
                                                        </CTableRow>
                                                    ) : (
                                                        replies.map((reply) => (
                                                            <CTableRow key={reply.id} className="bg-light">
                                                                <CTableDataCell className="ps-5">↳ {reply.writer?.name || 'Ẩn danh'}</CTableDataCell>
                                                                <CTableDataCell>{reply.content}</CTableDataCell>
                                                                <CTableDataCell>{new Date(reply.createdAt).toLocaleString('vi-VN')}</CTableDataCell>
                                                                <CTableDataCell><CBadge color="info">Phản hồi</CBadge></CTableDataCell>
                                                                <CTableDataCell></CTableDataCell>
                                                            </CTableRow>
                                                        ))
                                                    )}

                                                    {hasMore && !isRepliesLoading && (
                                                        <CTableRow>
                                                            <CTableDataCell colSpan={5} className="text-center bg-light">
                                                                <CButton size="sm" color="link" onClick={() => handleLoadMoreReplies(cmt.id)}>
                                                                    Xem thêm phản hồi
                                                                </CButton>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </CTableBody>
                    </CTable>

                    <CRow className="mt-3">
                        <CCol className="d-flex justify-content-center">
                            <CButton disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="me-2">Trang trước</CButton>
                            <span className="align-self-center">Trang {page}</span>
                            <CButton disabled={comments.length < limit} onClick={() => setPage((prev) => prev + 1)} className="ms-2">Trang sau</CButton>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <CModalHeader>❗ Xác nhận xóa bình luận</CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn xóa bình luận này không?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDeleteConfirmed}>Xác nhận xóa</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <CModalHeader>✅ Đã xóa bình luận</CModalHeader>
                <CModalBody>Bình luận đã được xóa thành công.</CModalBody>
            </CModal>
        </div>
    );
};

export default BlogDetail;
