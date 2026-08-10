<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'SP Admin',
            'email' => 'admin@standforpeople.com',
            'password' => Hash::make('Admin@12345'),
            'role' => 'admin',
        ]);
    }
}