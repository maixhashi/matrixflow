<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('flowsteps', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('id')->nullable(); // user_idカラムを追加
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // 外部キー制約
        });
    }

    public function down()
    {
        Schema::table('flowsteps', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }

};
