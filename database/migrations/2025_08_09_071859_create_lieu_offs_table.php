<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lieu_offs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employee
            $table->foreignId('granted_by')->constrained('users')->onDelete('cascade'); // Manager or Admin
            $table->date('work_date'); // The off day they actually worked
            $table->date('expiry_date'); // 2 months from work_date
            $table->enum('status', ['available', 'used', 'expired', 'pending_approval'])->default('available');
            $table->text('remarks')->nullable();
            $table->date('used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lieu_offs');
    }
};
