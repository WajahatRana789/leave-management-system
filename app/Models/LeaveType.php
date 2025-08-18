<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = ['name', 'default_days'];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }
}
