<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckList extends Model
{
    use HasFactory;

    protected $table = 'checklists';

    protected $fillable = ['workflow_id', 'flownumber_for_checklist', 'name'];

    public function checkItems()
    {
        return $this->belongsToMany(CheckItem::class, 'checklist_checkitem');
    }
}
