<?php
namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'leave_type', 'start_date', 'end_date', 'reason', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
