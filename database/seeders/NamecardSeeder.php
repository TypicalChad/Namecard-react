<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Namecard;
use App\Models\Comp;
use App\Models\Department;
use Faker\Factory as FakerFactory;
use Illuminate\Support\Str;

class NamecardSeeder extends Seeder
{
    /**
     * Generate vCard 3.0 format text.
     */
    private function generateVCard($first, $last, $full, $email, $mobile, $companyName, $position)
    {
        return "BEGIN:VCARD\n" .
            "VERSION:3.0\n" .
            "N:$last;$first;;;\n" .
            "FN:$full\n" .
            "ORG:$companyName\n" .
            "TITLE:$position\n" .
            "TEL;TYPE=CELL,VOICE:$mobile\n" .
            "EMAIL:$email\n" .
            "END:VCARD";
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = FakerFactory::create();

        // Get all companies
        $companies = Comp::all();

        // ------------------------------------------
        // CASE 1: If no companies exist, seed generic namecards
        // ------------------------------------------
        if ($companies->isEmpty()) {
            for ($i = 0; $i < 10; $i++) {
                $first   = $faker->firstName();
                $last    = $faker->lastName();
                $full    = "$first $last";
                $email   = $faker->unique()->safeEmail();
                $mobile  = '+65' . $faker->numerify('9#######');
                $position = $faker->jobTitle();

                Namecard::create([
                    'first_name'     => $first,
                    'last_name'      => $last,
                    'name'           => $full,
                    'position'       => $position,
                    'company_id'     => null,
                    'department_id'  => null,
                    'email'          => $email,
                    'mobile_number'  => $mobile,
                    'office_number'  => '+65' . $faker->numerify('6#######'),
                    'create_user'    => 'admin',
                    'update_user'    => 'admin',
                    'uid'            => (string) Str::uuid(),
                    'linkedin_personal' => $faker->url(),
                    'image'          => null,
                    'vcard'          => $this->generateVCard($first, $last, $full, $email, $mobile, 'N/A', $position),
                    'certification'  => $faker->word(),
                    'misc'           => $faker->sentence(),
                    'name_right'     => $faker->boolean() ? $full : null,
                ]);
            }
            return;
        }

        // ------------------------------------------
        // CASE 2: Seed namecards for each real company
        // ------------------------------------------
        foreach ($companies as $company) {
            $departments = Department::where('company_id', $company->id)
                ->pluck('id')
                ->toArray();

            $count = rand(1, 3); // number of namecards per company

            for ($i = 0; $i < $count; $i++) {
                $first   = $faker->firstName();
                $last    = $faker->lastName();
                $full    = "$first $last";
                $email   = $faker->unique()->safeEmail();
                $mobile  = '+65' . $faker->numerify('9#######');
                $position = $faker->jobTitle();

                Namecard::create([
                    'first_name'     => $first,
                    'last_name'      => $last,
                    'name'           => $full,
                    'position'       => $position,
                    'company_id'     => $company->id,
                    'department_id'  => $departments ? $faker->randomElement($departments) : null,
                    'email'          => $email,
                    'mobile_number'  => $mobile,
                    'office_number'  => '+65' . $faker->numerify('6#######'),
                    'create_user'    => 'admin',
                    'update_user'    => 'admin',
                    'uid'            => (string) Str::uuid(),
                    'linkedin_personal' => $faker->url(),
                    'image'          => null,
                    'vcard'          => $this->generateVCard(
                        $first,
                        $last,
                        $full,
                        $email,
                        $mobile,
                        $company->name,
                        $position
                    ),
                    'certification'  => $faker->word(),
                    'misc'           => $faker->sentence(),
                    'name_right'     => $faker->boolean() ? $full : null,
                ]);
            }
        }
    }
}
