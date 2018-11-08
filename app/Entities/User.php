<?php

namespace App\Entities;

use http\Env\Request;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'created_at',
        'updated_at'
    ];
}
