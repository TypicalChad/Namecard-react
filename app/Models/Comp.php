<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comp extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comps';

    protected $fillable = [
        'name',
        'aboutus',
        'website',
        'address',
        'create_user',
        'update_user',
        'linkedin_company',
        'services',
        'cbm_link',
        'coy_logo',
        'coy_banner',
        'coy_subsidiaries',
        'coy_banner_link',
        'product_image',
        'product_link',
        'product_title',
        'coy_subsidiaries_link',
        'longitude',
        'altitude',
        'map_link',
        'background',
        'misc',
        'default_image',
    ];

    public function departments()
    {
        return $this->hasMany(Department::class, 'company_id');
    }
}
