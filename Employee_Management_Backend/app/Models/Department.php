<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    //relations
    public function employees()
    {
        return $this->hasMany(User::class);
    }
}
