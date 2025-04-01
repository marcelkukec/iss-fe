import {useEffect, useState} from "react";
import PostCard from "../components/PostCard.tsx";
import api from "../api/api.ts";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

interface PostData {
    id: number;
    title: string;
    body: string;
    user: {
        username: string;
    };
    group: {
        name: string;
    }
    created_at: string;
}

interface GroupData {
    id: number;
    name: string;
}

export default function Home() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<GroupData[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/explore');
            return;
        }

        api.get('/posts/my-feed').then((res) => setPosts(res.data));
        api.get('/groups').then(res => {
            const sorted = res.data.sort((a: GroupData, b: GroupData) =>
                a.name.localeCompare(b.name)
            );
            setGroups(sorted);
        });
        document.title = 'Home';
    }, [isLoggedIn, navigate]);

    return (
        <div className="d-flex justify-content-center">
            <div className="container mt-4" style={{ maxWidth: "1200px" }}>
                <div className="row">
                    {/* Left column: posts */}
                    <div className="col-md-8">
                        <Link to="/create" className="btn btn-primary mb-4">
                            Create Post
                        </Link>
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                body={post.body}
                                user={post.user?.username || 'deleted_user'}
                                group={post.group.name}
                                created_at={post.created_at}
                            />
                        ))}
                    </div>

                    {/* Right column: groups */}
                    <div className="col-md-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Groups</h5>
                            <Link to="/groups/create" className="btn btn-sm btn-success">
                                + Create Group
                            </Link>
                        </div>
                        <ul className="list-group">
                            {groups.map(group => (
                                <li key={group.id} className="list-group-item">
                                    <Link to={`/groups/${group.id}`} className="text-decoration-none">{group.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}