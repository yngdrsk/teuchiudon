<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // UserSeederを呼び出し
        $this->call([
            UserSeeder::class,
        ]);
        // PostSeederを呼び出し
        $this->call([
            PostSeeder::class,
        ]);
    }
}
