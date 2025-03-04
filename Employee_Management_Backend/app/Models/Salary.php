<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'start_date', 'end_date', 'base_salary', 'attendances', 'leaves',
        'attendance_bonus', 'leave_deduction', 'total_salary', 'tva_rate', 'tva_amount', 'paid_on',
    ];
    

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
