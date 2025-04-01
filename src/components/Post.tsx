import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/api.ts";

export default function Post() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const toggleCommentForm = () => {
        setShowCommentForm(prev => !prev);
        setCommentContent('');
    };

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;

        try {
            await api.post('/comments', {
                content: commentContent,
                post_id: post.id
            });

            setCommentContent('');
            setShowCommentForm(false);

            const res = await api.get(`/comments/post/${post.id}`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to post comment');
        }
    };

    useEffect(() => {
        api.get(`/posts/${id}`).then(res => setPost(res.data));
        api.get(`/comments/post/${id}`).then(res => setComments(res.data));


    }, [id]);

    useEffect(() => {
        if(post){
            document.title = post.title;
        }
    }, [post]);

    if (!post) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="text-muted small">
                Posted by{" "}
                {post.user?.username ? (
                    <Link to={`/user/${post.user.id}/posts`} className="text-muted">
                        {post.user.username}
                    </Link>
                ) : (
                    "deleted_user"
                )}
                /
                <Link to={`/groups/${post.group.id}`} className="text-muted">
                    {post.group.name}&nbsp;
                </Link>
                • {new Date(post.created_at).toLocaleString()}
            </div>

            <h2 className="mt-2">{post.title}</h2>
            <p>{post.body}</p>

            <h4 className="mt-5">Comments</h4>
            {comments.length > 0 ? (
                comments.map(comment => (
                    <div className="card mb-2" key={comment.id}>
                        <div className="card-body">
                            <div className="text-muted small">
                                {comment.user?.username || "deleted_user"} •{" "}
                                {new Date(comment.created_at).toLocaleString()}
                            </div>
                            <p className="card-text mt-2">{comment.content}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted">No comments yet.</p>
            )}

            <div className="mt-4">
                {!showCommentForm ? (
                    <button className="btn btn-outline-primary" onClick={toggleCommentForm}>Comment</button>
                ) : (
                    <>
                    <textarea className="form-control mb-2" rows={3} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Write your comment..."/>
                        <button className="btn btn-primary me-2" onClick={handleCommentSubmit}>Post</button>
                        <button className="btn btn-outline-secondary" onClick={toggleCommentForm}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );

}