<?php

namespace App\Models;

use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Job extends Model
{
    use HasFactory;
    protected $fillable = ['department_id', 'name', 'description', 'salary'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
