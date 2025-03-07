<?php

namespace App\Models;

use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Job extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'salary', 'department_id'];


    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
