<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('flowsteps', function (Blueprint $table) {
            $table->text('description')->nullable()->after('flow_number');
        });
    }
    
    public function down()
    {
        Schema::table('flowsteps', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
    
};
