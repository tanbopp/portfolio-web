<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::updateOrCreate(
            ['username' => env('ADMIN_USERNAME', 'tanbopp')],
            [
                'password'   => Hash::make(env('ADMIN_PASSWORD')),
                'auth_code'  => Hash::make(env('ADMIN_AUTH_CODE')),
            ]
        );
    }
}
