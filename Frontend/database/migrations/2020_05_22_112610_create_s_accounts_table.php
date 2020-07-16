<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('s_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('AccountName')->unique();;
            $table->string('PWord', 350);
            $table->boolean('Boost');
            $table->boolean('Encrypted');
            $table->string('SteamGuardCode')->nullable(true);
            $table->integer('StatusCode')->default(0);
            //0 is ok
            //1 waiting for code
            //2 code send
            //3 timeout
            //4 invalid Password
            //5 prep for delete
            //6 delete possible

            $table->string('SteamID')->nullable(true);
            $table->unsignedBigInteger('AccountOwner');
            $table->foreign('AccountOwner')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('s_accounts');
    }
}
