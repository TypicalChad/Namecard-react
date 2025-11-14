<?php

namespace App\Policies;

use App\Models\User;
use App\Models\NameCard;

class NameCardPolicy
{
    /**
     * Users can view all namecards
     */
    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, NameCard $namecard)
    {
        return true;
    }

    /**
     * Only allow update if same department OR admin
     */
    public function update(User $user, NameCard $namecard)
    {
        // Admin bypass
        if (strtolower($user->role->name) === 'admin') {
            return true;
        }

        // User can edit only their department's namecards
        return $user->department_id !== null
            && $user->department_id === $namecard->department_id;
    }

    /**
     * Same rule for delete
     */
    public function delete(User $user, NameCard $namecard)
    {
        if (strtolower($user->role->name) === 'admin') {
            return true;
        }

        return $user->department_id !== null
            && $user->department_id === $namecard->department_id;
    }

    /**
     * Create is allowed for admins only
     */
    public function create(User $user)
    {
        return strtolower($user->role->name) === 'admin';
    }
}
