// resources/js/components/PostForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Post } from '../types/index';

interface PostFormProps {
    post?: Post;
    onSuccess: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const PostForm: React.FC<PostFormProps> = ({ post, onSuccess }) => {
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('認証トークンが見つかりません。');
                alert('認証されていません。ログインしてください。');
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            if (post) {
                // 編集の場合
                formData.append('_method', 'PUT'); // LaravelがPUTとして認識
                await axios.post(`${API_URL}/api/posts/${post.id}`, formData, { headers });
            } else {
                // 新規作成の場合
                await axios.post(`${API_URL}/api/posts`, formData, { headers });
            }
            onSuccess();
        } catch (error) {
            console.error('記事の保存に失敗しました:', error);
            alert('記事の保存に失敗しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{post ? '記事を編集' : '記事を作成'}</h3>
            <input
                type="text"
                placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="本文"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
            <button type="submit">保存</button>
        </form>
    );
};

export default PostForm;