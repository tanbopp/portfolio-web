<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        'username',
        'password',
        'auth_code',
    ];

    protected $hidden = [
        'password',
        'auth_code',
    ];
}
