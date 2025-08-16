<?php

use App\Http\Controllers\Api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// ブログ記事のCRUDルート
Route::apiResource('posts', PostController::class)->middleware('auth:sanctum');

// 認証不要の投稿一覧と詳細表示
Route::get('posts', [PostController::class, 'index']);
Route::get('posts/{post}', [PostController::class, 'show']);

// ユーザー登録用のAPIエンドポイントを追加
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest');

// ログイン用のAPIルートを追加
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');

// ログアウト用のAPIルートを追加
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');