<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Ensure the 'admin' role exists
        $adminRole = Role::updateOrCreate(
            ['name' => 'Admin'],
            ['display_name' => 'Administrator']
        );

        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'], // unique key
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'), // secure password
                'role_id' => $adminRole->id,
            ]
        );

        // Create a sample regular user
        $userRole = Role::updateOrCreate(
            ['name' => 'User'],
            ['display_name' => 'User']
        );

        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'role_id' => $userRole->id,
            ]
        );
    }
}
