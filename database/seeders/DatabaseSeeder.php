<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Seeder;
use App\Models\Namecard;
use App\Models\Comp;
use App\Models\Department;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Disable FK constraints for safe truncation
        Schema::disableForeignKeyConstraints();

        // Truncate in reverse dependency order (children first)
        Namecard::truncate();
        Department::truncate();  // If departments reference companies
        Comp::truncate();        // Parent last

        // Re-enable FK constraints
        Schema::enableForeignKeyConstraints();

        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            CompanySeeder::class,
            DepartmentSeeder::class,
            NamecardSeeder::class,

        ]);
    }
}
