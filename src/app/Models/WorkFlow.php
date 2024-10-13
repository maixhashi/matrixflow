<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    public function flowsteps()
    {
        return $this->belongsToMany(Flowstep::class);
    }
}
