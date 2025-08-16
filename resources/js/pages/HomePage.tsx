// udonblog-frontend/src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Post } from '../types/index';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/posts`)
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
        <div>
            <h1>ブログ記事一覧</h1>
            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
};

export default HomePage;