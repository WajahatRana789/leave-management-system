<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LieuOff extends Model
{
    protected $fillable = ['user_id', 'granted_by', 'work_date', 'expiry_date', 'status', 'remarks', 'used_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function grantedByUser()
    {
        return $this->belongsTo(User::class, 'granted_by');
    }
}
