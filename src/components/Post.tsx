import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api.ts";
import { useAuth } from "../context/AuthContext.tsx";

export default function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentContent, setCommentContent] = useState("");

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");

    const toggleCommentForm = () => {
        setShowCommentForm(prev => !prev);
        setCommentContent("");
    };

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;

        try {
            await api.post("/comments", {
                content: commentContent,
                post_id: post.id,
            });

            setCommentContent("");
            setShowCommentForm(false);

            const res = await api.get(`/comments/post/${post.id}`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to post comment");
        }
    };

    const handleDeletePost = async () => {
        const confirmed = confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await api.delete(`/posts/${post.id}`);
            alert("Post deleted.");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Failed to delete post.");
        }
    };

    useEffect(() => {
        api.get(`/posts/${id}`).then(res => setPost(res.data));
        api.get(`/comments/post/${id}`).then(res => setComments(res.data));
    }, [id]);

    useEffect(() => {
        if (post) {
            document.title = post.title;
        }
    }, [post]);

    if (!post) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="container mt-4">
                <div className="text-muted small">
                    Posted by{" "}
                    {post.user?.username ? (
                        <Link to={`/user/${post.user.id}/posts`} className="text-muted">{post.user.username}</Link>
                    ) : (
                        "deleted_user"
                    )}
                    /
                    <Link to={`/groups/${post.group.id}`} className="text-muted">{post.group.name}&nbsp;</Link> • {new Date(post.created_at).toLocaleString()}
                </div>

                <h2 className="mt-2 d-flex justify-content-between align-items-center">
                    <span>{post.title}</span>
                    {isLoggedIn && user?.id === post.user?.id && (
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/create?post_id=${post.id}`)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={handleDeletePost}>Delete</button>
                        </div>
                    )}
                </h2>

                <p>{post.body}</p>

                <h4 className="mt-5">Comments</h4>
                <div className="mb-4">
                    {!showCommentForm ? (
                        <button className="btn btn-outline-primary mt-2" onClick={toggleCommentForm}>Comment</button>
                    ) : (
                        <>
                            <textarea className="form-control mb-2" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Write your comment... "/>
                            <button className="btn btn-primary me-2" onClick={handleCommentSubmit}>Post</button>
                            <button className="btn btn-outline-secondary" onClick={toggleCommentForm}>Cancel</button>
                        </>
                    )}
                </div>

                {comments.length > 0 ? (
                    comments.map(comment => {
                            const isOwner = isLoggedIn && user?.id === comment.user?.id;
                            const isEditing = editingCommentId === comment.id;

                            const startEditing = () => {
                                setEditingCommentId(comment.id);
                                setEditContent(comment.content);
                            };

                            const cancelEditing = () => {
                                setEditingCommentId(null);
                                setEditContent("");
                            };

                            const handleUpdate = async () => {
                                try {
                                    await api.patch(`/comments/${comment.id}`, { content: editContent });
                                    const res = await api.get(`/comments/post/${post.id}`);
                                    setComments(res.data);
                                    cancelEditing();
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to update comment");
                                }
                            };

                            const handleDelete = async () => {
                                const confirmed = confirm("Delete this comment?");
                                if (!confirmed) return;

                                try {
                                    await api.delete(`/comments/${comment.id}`);
                                    setComments(prev => prev.filter(c => c.id !== comment.id));
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to delete comment");
                                }
                            };

                            return (
                                <div className="card mb-2" key={comment.id}>
                                    <div className="card-body">
                                        <div className="text-muted small d-flex justify-content-between">
                    <span>
                        {comment.user?.username || "deleted_user"} •{" "}
                        {new Date(comment.created_at).toLocaleString()}
                    </span>
                                            {isOwner && !isEditing && (
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={startEditing}>Edit</button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>Delete</button>
                                                </div>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <>
                        <textarea className="form-control mt-2 mb-2" value={editContent} onChange={(e) => setEditContent(e.target.value)}/>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary" onClick={handleUpdate}>Save</button>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={cancelEditing}>Cancel</button>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="card-text mt-2">{comment.content}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })

                ) : (
                    <p className="text-muted">No comments yet.</p>
                )}
            </div>
        </div>
    );
}
