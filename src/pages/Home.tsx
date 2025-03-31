import {useEffect, useState} from "react";
import PostCard from "../components/PostCard.tsx";
import api from "../api/api.ts";

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

export default function Home() {
    const [posts, setPosts] = useState<PostData[]>([]);

    useEffect(() => {
        api.get('/posts').then((res) => setPosts(res.data));

        document.title = 'Home';
    }, [])
    return (
        <>
            <div className="container mt-4">
                { posts.map(post => (
                    <PostCard id={post.id} key={post.id} title={post.title} body={post.body} user={post.user ? post.user.username : 'deleted_user'} group={post.group.name} created_at={post.created_at} />
                ))}
            </div>
        </>
    )
}