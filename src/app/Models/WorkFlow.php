<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    use HasFactory;

    // 一括代入可能な属性を指定
    protected $fillable = ['name'];

    public function flowsteps()
    {
        return $this->belongsToMany(Flowstep::class);
    }
}
