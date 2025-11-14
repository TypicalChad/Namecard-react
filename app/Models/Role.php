<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name', // Optional: keep if you use it elsewhere
    ];

    /**
     * Relationship: Role has many users
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
