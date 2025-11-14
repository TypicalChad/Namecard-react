<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'department_id',
        'company_id',
    ];

    /**
     * Hidden attributes for serialization
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attribute casts
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function company()
    {
        return $this->belongsTo(Comp::class, 'company_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    // -------------------------
    // Helpers
    // -------------------------

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $roleName): bool
    {
        return strtolower($this->role->name ?? '') === strtolower($roleName);
    }

    /**
     * Get the user's dashboard route based on their role
     */
    public function dashboard(): string
    {
        $role = strtolower($this->role->name ?? '');

        return match ($role) {
            'admin'     => route('dashboard'),
            'hr'        => route('dashboard'),
            'div admin' => route('dashboard'),
            default     => route('login'),
        };
    }

    /**
     * Get the permissions for a specific module
     * Example: $user->permissions('Users') => ['create' => true, 'edit' => false, ...]
     */
    public function permissions(string $module): array
    {
        return $this->role->permissions[$module] ?? [];
    }
}
