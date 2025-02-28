<?php
namespace App\Models;

use App\Models\Job;
use App\Models\Attendance;
use App\Models\Department;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department_id',
        'username',         
        'phone',           
        'profile_picture', 
        'country',        // Added country field
        'is_active' , 
        'nationality',
        'is_deleted' 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // relations

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'user_id', 'id');
    }

    public function leaves()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function salaries()
    {
        return $this->hasMany(Salary::class);
    }

    /**
     * Get the identifier that will be stored in the JWT token.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Get the custom claims for the JWT token.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
