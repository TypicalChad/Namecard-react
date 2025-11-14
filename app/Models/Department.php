<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';

    protected $fillable = [
        'department',
        'company_id',
        'create_user',
        'update_user',
    ];

    protected $casts = [
        'company_id' => 'integer',
    ];

    public function company()
    {
        return $this->belongsTo(Comp::class, 'company_id');
    }

    // ✅ Add this accessor so frontend can use `department.name`
    public function getNameAttribute()
    {
        return $this->department;
    }
}
