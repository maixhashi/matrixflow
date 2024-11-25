<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flowstep extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'flow_number',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function workflows()
    {
        return $this->belongsToMany(Workflow::class);
    }

    protected $table = 'flowsteps'; // 既存の flowsteps テーブル

    public function members()
    {
        // 中間テーブル flowstep_member を介して members を取得するリレーション
        return $this->belongsToMany(Member::class, 'flowstep_member', 'flowstep_id', 'member_id');
    }

    public function toolsystems()
    {
        return $this->belongsToMany(Toolsystem::class, 'flowstep_toolsystem');
    }
}
