<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Namecard extends Model
{
    use HasFactory;

    protected $table = 'namecards';

    protected $fillable = [
        'office_number',
        'mobile_number',
        'email',
        'name',
        'position',
        'company_id',
        'department_id',
        'image',
        'create_user',
        'update_user',
        'linkedin_personal',
        'first_name',
        'last_name',
        'vcard',
        'certification',
        'uid',
        'misc',
        'name_right',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->uid)) {
                $model->uid = Str::uuid()->toString();
            }
        });
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function company()
    {
        return $this->belongsTo(Comp::class, 'company_id');
    }
}
