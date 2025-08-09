<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LieuOff extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function grantedByUser()
    {
        return $this->belongsTo(User::class, 'granted_by');
    }
}
