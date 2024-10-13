<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlowstepMember extends Model
{
    use HasFactory;

    protected $table = 'flowstep_member'; // テーブル名を指定

    // マスアサインメントを許可するフィールド
    protected $fillable = [
        'member_id',    // ここに member_id を追加
        'flowstep_id',  // 必要なフィールドも追加
        // 他のフィールドも必要に応じて追加
    ];
}
