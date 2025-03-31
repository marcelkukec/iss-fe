import * as React from "react";
import {Link} from "react-router-dom";

interface PostCardProps {
    id: number;
    title: string;
    body: string;
    user: string | null;
    group: string;
    created_at: string;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, body, user, group }) => {
    return (
        <Link to={`/posts/${id}`} className="text-decoration-none text-reset">
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <small className="text-muted">{user || 'deleted_user'}/{group}</small>
                    <h5 className="card-title mt-2">{title}</h5>
                    <p className="card-text">{body}</p>
                    <div className="d-flex">
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard;