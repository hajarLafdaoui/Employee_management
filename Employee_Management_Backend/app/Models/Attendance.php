<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    //
    protected $fillable = [
        'user_id',  
        'attendance_date',    
        'status',   
    ];
    public function users()
    {
        return $this->hasMany(User::class);
    }
   
}
