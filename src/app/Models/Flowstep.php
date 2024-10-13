<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flowstep extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'flow_number'];

    public function workflows()
    {
        return $this->belongsToMany(Workflow::class);
    }

    public function members()
    {
        return $this->belongsToMany(Member::class);
    }
}
