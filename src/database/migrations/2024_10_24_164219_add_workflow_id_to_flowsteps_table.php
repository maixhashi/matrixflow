<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('flowsteps', function (Blueprint $table) {
            $table->unsignedBigInteger('workflow_id')->nullable(); // adjust type and options as needed
        });
    }
    
    public function down()
    {
        Schema::table('flowsteps', function (Blueprint $table) {
            $table->dropColumn('workflow_id');
        });
    }
    
};
