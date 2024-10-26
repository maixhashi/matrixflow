<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserIdToWorkflowsTable extends Migration
{
    public function up()
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(); // user_idカラムを追加
        });
    }

    public function down()
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->dropColumn('user_id'); // ロールバック時にuser_idカラムを削除
        });
    }
}
