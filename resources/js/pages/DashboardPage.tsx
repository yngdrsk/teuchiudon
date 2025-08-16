// resources/js/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Post } from '../types';
import AuthForm from '../components/AuthForm';
import PostForm from '../components/PostForm';

const API_URL = import.meta.env.VITE_API_URL;

const DashboardPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 認証状態
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // コンポーネントがマウントされたときと、認証状態が変わったときに実行
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Laravelのセッション認証をチェック
                const response = await axios.get(`${API_URL}/api/user`);
                if (response.data) {
                    setIsLoggedIn(true);
                    fetchPosts(); // 認証済みなら記事を取得
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkAuthStatus();
    }, []);

    const fetchPosts = async () => {
        try {
            // トークンをヘッダーに含める
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(`${API_URL}/api/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(response.data);
        } catch (error) {
            console.error('記事の取得に失敗しました:', error);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        fetchPosts(); // ログイン成功後に記事を再取得
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/api/logout`);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('ログアウトに失敗しました:', error);
        }
    };

    const handleDelete = async (postId: number) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            await axios.delete(`${API_URL}/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts();
        } catch (error) {
            console.error('記事の削除に失敗しました:', error);
        }
    };

    if (!isLoggedIn) {
        return (
            <div>
                <h1>ログインしてください</h1>
                <AuthForm isLogin={true} onSuccess={handleLoginSuccess} />
                <p>または</p>
                <AuthForm isLogin={false} onSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return (
        <div>
            <h1>管理画面</h1>
            <button onClick={handleLogout}>ログアウト</button>

            <PostForm post={editingPost || undefined} onSuccess={() => {
                fetchPosts();
                setEditingPost(null);
            }} />

            <h2>あなたの記事</h2>
            {posts.map((post) => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <button onClick={() => setEditingPost(post)}>編集</button>
                    <button onClick={() => handleDelete(post.id)}>削除</button>
                </div>
            ))}
        </div>
    );
};

export default DashboardPage;