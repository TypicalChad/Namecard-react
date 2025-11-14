<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run()
    {
        DB::table('comps')->insert([
            [
                'name' => 'CBM Pte Ltd',
                'aboutus' => '<p>We strive to provide <strong>prompt, reliable</strong>, <strong>and value-added integrated services</strong> to exceed clients’ expectations through <strong>innovative</strong> and <strong>sustainable</strong> solutions.</p>',
                'cbm_link' => 'https://www.cbm.com.sg/',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CBM Solutions',
                'aboutus' => '<p>With our one-stop integrated approach, discover environmentally-friendly and innovative solutions that satisfy your triple bottom line through sustainable operations and processes.</p>',
                'cbm_link' => 'https://www.cbmsolutions.com.sg/',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CBM Security',
                'aboutus' => '<p>Your security concerns are our foremost responsibility. At CBM Security, we provide <strong>customised solutions</strong> for all your <strong>security needs</strong>, allowing you to explore the full potential of your security requirements with peace of mind.</p>',
                'cbm_link' => 'https://www.cbm.com.sg/security',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CBM Parking',
                'aboutus' => '<p>We deliver professional and efficient car park management services, ensuring smooth operations, safety, and customer satisfaction through technology-driven solutions and trained personnel.</p>',
                'cbm_link' => 'https://www.cbmparking.com.sg/',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'EMPIRE CITY CONSULTANT',
                'aboutus' => '<p>We are ISO 9001 and 14001 certified and provide a full range of engineering consultancy services dedicated to quality, innovation, and environmental sustainability.</p>',
                'cbm_link' => 'https://www.ecc.com.sg/',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Systematic Laundry',
                'aboutus' => '<p>Founded in 1979, Systematic is a leading local laundry management and service provider in Singapore for residential, retail, and commercial clientele island-wide.</p><p>We continue to innovate and adopt the latest laundry technologies to maintain our reputation for efficiency, quality, and sustainability.</p>',
                'cbm_link' => 'https://systematiclaundry.com.sg/home',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ingensys',
                'aboutus' => '<p>Ingensys brings to the market a unique combination of solid technical capabilities, innovative solutions, and reliable in-house support to provide clients with a holistic service that caters to their specific needs.</p><p>As a trusted partner, we aim to deliver integrated engineering solutions that empower businesses to perform at their best.</p>',
                'cbm_link' => 'https://www.ingensys.com.sg/',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CBM Qatar LLC',
                'aboutus' => '<p>Established in Qatar since 2009, CBM Qatar prides itself as a leading Triple-ISO certified and Supreme Committee Approved Integrated Facilities Management Company providing both hard and soft services with excellence and reliability.</p>',
                'cbm_link' => 'https://www.cbmqatar.com/',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CBM Thailand',
                'aboutus' => '<p>CBM Facilities & Security Management (Thailand) Co., Ltd. is a subsidiary of Singapore property pioneer City Developments Limited (CDL), listed on the Singapore Stock Exchange. Incorporated in January 2011, we deliver quality facilities and security management services across Thailand.</p>',
                'cbm_link' => 'https://cbm-thai.com/index.php',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
