<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Comp;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        Department::truncate();

        // Define company-specific departments and acronyms
        $departmentsData = [
            'CBM PTE LTD' => [
                ['department' => 'ADMIN', 'acronym' => 'ADM'],
                ['department' => 'HUMAN RESOURCE', 'acronym' => 'HR'],
                ['department' => 'QUALITY MANAGEMENT SYSTEM', 'acronym' => 'QMS'],
                ['department' => 'TRAINING', 'acronym' => 'TRG'],
                ['department' => 'BUSINESS DEVELOPMENT', 'acronym' => 'BD'],
                ['department' => 'DIGITAL SOLUTIONS & SERVICES', 'acronym' => 'DSS'],
                ['department' => 'FINANCE', 'acronym' => 'FIN'],
                ['department' => 'MANAGEMENT', 'acronym' => 'MGMT'],
                ['department' => 'INTERNATIONAL', 'acronym' => 'INTL'],
                ['department' => 'ENGINEERING', 'acronym' => 'ENGR'],
                ['department' => 'ENVIRONMENTAL', 'acronym' => 'ENV'],
                ['department' => 'INTEGRATED FACILITIES SERVICES', 'acronym' => 'IFS'],
                ['department' => 'PROJECTS', 'acronym' => 'PROJ'],
            ],
            'CBM Solutions' => [
                ['department' => 'SOLUTIONS', 'acronym' => 'CBMS'],
            ],
            'CBM Security' => [
                ['department' => 'SECURITY', 'acronym' => 'SEC'],
            ],
            'CBM Parking' => [
                ['department' => 'PARKING', 'acronym' => 'CBMP'],
                ['department' => 'CONTROL CENTRE', 'acronym' => 'CC'],
            ],
            'EMPIRE CITY CONSULTANT' => [
                ['department' => 'ECC', 'acronym' => 'ECC'],
            ],
            'Systematic Laundry' => [
                ['department' => 'SLHS', 'acronym' => 'SLHS'],
            ],
            'Ingensys' => [
                ['department' => 'INGENSYS', 'acronym' => 'ING'],
            ],
            'CBM Qatar LLC' => [
                ['department' => 'CBM Qatar', 'acronym' => 'CBMQ'],
            ],
            'CBM Thailand' => [
                ['department' => 'CBM Thailand', 'acronym' => 'CBMT'],
            ],
        ];

        // Insert departments for each company
        foreach ($departmentsData as $companyName => $departments) {
            $company = Comp::where('name', $companyName)->first();
            if (!$company) continue;

            foreach ($departments as $dept) {
                Department::create([
                    'department' => $dept['department'],
                    'acronym' => $dept['acronym'],
                    'company_id' => $company->id,
                ]);
            }
        }
    }
}
