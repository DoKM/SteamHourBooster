<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSteam2FAKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('steam_2fa_keys', function (Blueprint $table) {
            $table->id();
            $table->string('Shared_Secret', 350);
            $table->string('Account_Name');
            $table->unsignedBigInteger('Account_ID');

            $table->timestamps();

            $table->foreign('Account_ID')->references('id')->on('s_accounts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('steam_2fa_key');
    }
}
