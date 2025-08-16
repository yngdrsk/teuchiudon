// resources/js/components/AuthForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
    isLogin: boolean;
    onSuccess: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSuccess }) => {
    const [name, setName] = useState(''); // 追加
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState(''); // 追加
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'register';
        try {
            await axios.get(`${API_URL}/sanctum/csrf-cookie`);

            // ログインと登録で送信するデータを分ける
            const requestData = isLogin
                ? { email, password }
                : { name, email, password, password_confirmation: passwordConfirmation };

            await axios.post(`${API_URL}/api/${endpoint}`, requestData);

            // ユーザー登録・ログイン成功後にユーザー情報を取得
            const userResponse = await axios.get(`${API_URL}/api/user`);
            console.log('User registered/logged in successfully:', userResponse.data);

            onSuccess();
            navigate('/dashboard');
        } catch (error) {
            console.error('Authentication failed:', error.response?.data);
            alert('認証に失敗しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isLogin ? 'ログイン' : 'ユーザー登録'}</h2>
            {!isLogin && ( // ユーザー登録時のみ表示
                <input
                    type="text"
                    placeholder="名前"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            )}
            <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {!isLogin && ( // ユーザー登録時のみ表示
                <input
                    type="password"
                    placeholder="パスワード（確認）"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
            )}
            <button type="submit">{isLogin ? 'ログイン' : '登録'}</button>
        </form>
    );
};

export default AuthForm;