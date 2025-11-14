<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        Role::firstOrCreate(
            ['name' => 'Admin'],
            ['display_name' => 'Administrator']
        );

        Role::firstOrCreate(
            ['name' => 'User'],
            ['display_name' => 'Regular User']
        );
    }
}
