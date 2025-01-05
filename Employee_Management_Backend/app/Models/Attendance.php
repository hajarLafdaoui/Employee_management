<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'attendance_date',
        'status',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class); // Attendance belongs to a single user
    }
}
