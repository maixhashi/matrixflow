<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Toolsystem extends Model
{
    use HasFactory;

    protected $table = 'toolsystems';

    protected $fillable = ['name'];

    public function flowsteps()
    {
        return $this->belongsToMany(Flowstep::class, 'flowstep_toolsystem');
    }
}
