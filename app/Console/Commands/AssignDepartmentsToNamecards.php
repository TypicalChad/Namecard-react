<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Namecard;
use App\Models\Department;
use App\Models\Comp;

class AssignDepartmentsToNamecards extends Command
{
    protected $signature = 'namecards:assign-departments';
    protected $description = 'Assign department_id to namecards based on department or company';

    public function handle()
    {
        $namecards = Namecard::whereNull('department_id')->get();

        foreach ($namecards as $card) {
            $assignedDeptId = null;

            if (!empty($card->department)) {
                $department = Department::where('department', $card->department)->first();
                if ($department) $assignedDeptId = $department->id;
            }

            if (!$assignedDeptId && !empty($card->company)) {
                $company = Comp::where('name', $card->company)->first();
                if ($company) {
                    $department = Department::where('company_id', $company->id)->first();
                    if ($department) $assignedDeptId = $department->id;
                }
            }

            if (!$assignedDeptId) {
                $department = Department::first();
                if ($department) $assignedDeptId = $department->id;
            }

            if ($assignedDeptId) {
                $card->department_id = $assignedDeptId;
                $card->save();
            }
        }

        $this->info("Department assignment completed.");
    }
}
