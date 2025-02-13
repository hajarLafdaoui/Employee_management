<?php

namespace App\Models;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;


  
class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo', 'description'];
    protected $appends = ['full_logo_path'];

    public function getFullLogoPathAttribute() {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
