<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOrderOnMatrixToMembersTable extends Migration
{
    public function up()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->integer('order_on_matrix')->nullable()->after('name'); // 名前の後に追加
        });
    }

    public function down()
    {
        Schema::table('members', function (Blueprint $table) {
            if (Schema::hasColumn('members', 'order_on_matrix')) {
                $table->dropColumn('order_on_matrix');
            }
        });
    }

}
