<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $fillable = ['name', 'shift_incharge_id'];

    public function shift_incharge()
    {
        return $this->belongsTo(User::class, 'shift_incharge_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
