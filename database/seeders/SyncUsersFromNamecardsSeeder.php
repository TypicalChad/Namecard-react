<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Namecard;
use App\Models\User;
use App\Models\Role;
use App\Models\Comp;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class SyncUsersFromNamecardsSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure a 'User' role exists
        $userRole = Role::updateOrCreate(
            ['name' => 'User'],
            ['display_name' => 'User']
        );

        $count = 0;

        Namecard::chunk(200, function ($namecards) use (&$count, $userRole) {
            foreach ($namecards as $nc) {
                // skip if no email
                if (empty($nc->email)) {
                    continue;
                }

                $email = strtolower(trim($nc->email));

                $user = User::where('email', $email)->first();

                // Assign company by explicit mapping if present: user provided list
                // mapping: namecard ids 1..9 -> company ids 1..9, and 10..18 repeat 1..9
                $company = null;
                $companyId = null;
                if (!empty($nc->id)) {
                    $mappedCompanyId = (($nc->id - 1) % 9) + 1; // maps 1->1, 10->1, etc.
                    $mappedCompany = Comp::find($mappedCompanyId);
                    if ($mappedCompany) {
                        $companyId = $mappedCompany->id;
                        $company = $mappedCompany;
                    }
                }

                // fallback: try to find company by name (case-insensitive)
                if (is_null($companyId) && !empty($nc->company)) {
                    $company = Comp::whereRaw('LOWER(name) = ?', [strtolower($nc->company)])->first();
                    if ($company) {
                        $companyId = $company->id;
                    }
                }

                // try to resolve department: prefer namecard.department, fall back to department_id
                $departmentId = null;
                if (!empty($nc->department)) {
                    // find or create department by name + company
                    $deptQuery = [
                        'department' => $nc->department,
                        'company_id' => $companyId,
                    ];
                    $department = \App\Models\Department::firstOrCreate($deptQuery);
                    $departmentId = $department->id;
                } elseif (!empty($nc->department_id)) {
                    $departmentId = $nc->department_id;
                }

                $data = [
                    'name' => $nc->name ?? trim(($nc->first_name ?? '') . ' ' . ($nc->last_name ?? '')),
                    'role_id' => $userRole->id,
                    'department_id' => $departmentId,
                    'company_id' => $companyId,
                ];

                if ($user) {
                    $user->update($data);
                } else {
                    // create with a random password
                    $password = Str::random(12);
                    $user = User::create(array_merge($data, [
                        'email' => $email,
                        'password' => Hash::make($password),
                    ]));
                }

                $count++;
            }
        });

        $this->command->info("Synced {$count} users from namecards.");
    }
}
