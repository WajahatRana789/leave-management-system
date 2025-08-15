<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    protected $fillable = [
        'title',
        'short_code',
        'description',
        'parent_id',
        'sort_order',
        'is_active'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Designation::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Designation::class, 'parent_id');
    }
}
