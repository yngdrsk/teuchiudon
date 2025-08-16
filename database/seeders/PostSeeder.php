<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // まずユーザーが存在することを確認
        if (User::count() === 0) {
            User::factory(5)->create();
        }

        // 既存のユーザーを取得
        $users = User::all();

        // 各ユーザーに3つずつ記事を作成
        $users->each(function ($user) {
            Post::factory(3)->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
