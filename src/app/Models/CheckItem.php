<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckItem extends Model
{
    use HasFactory;

    protected $fillable = ['checklist_id', 'check_content', 'member_id'];

    public function checkLists()
    {
        return $this->belongsToMany(Checklist::class, 'checklist_checkitem');
    }
}
