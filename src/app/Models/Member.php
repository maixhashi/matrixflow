<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    // ホワイトリストで設定する属性
    protected $fillable = [
        'user_id',
        'workflow_id',
        'name',
        'order_on_matrix'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $table = 'members'; // 既存の members テーブル

    public function flowsteps()
    {
        // 中間テーブル flowstep_member を介して flowsteps を取得するリレーション
        return $this->belongsToMany(Flowstep::class, 'flowstep_member', 'member_id', 'flowstep_id');
    }

}
