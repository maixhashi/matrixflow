<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('flowstep_toolsystem', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flowstep_id')->constrained()->cascadeOnDelete();
            $table->foreignId('toolsystem_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('flowstep_toolsystem');
    }
};
