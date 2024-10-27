<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCheckitemsTable extends Migration
{
    public function up()
    {
        Schema::create('checkitems', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('checklist_id'); // checklist_idカラム
            $table->string('check_content');
            $table->unsignedBigInteger('member_id')->nullable(); // member_idカラム
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('checkitems');
    }
}
