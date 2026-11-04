<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Therapist extends Authenticatable
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id', 'email', 'name', 'password', 'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
