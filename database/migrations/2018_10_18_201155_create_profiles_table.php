<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->primary();
            $table->foreign('user_id')->references('id')->on('users');

            $table->string('first_name');
            $table->string('last_name');
            $table->char('gender', 20)->nullable();
            $table->date('date_birth')->nullable();
            $table->text('about_user')->nullable();

            $table->char('country_code', 3)->charset('latin1')->collate('latin1_swedish_ci')->nullable();
            $table->foreign('country_code')->references('Code')->on('country');

            $table->timestamp('updated_at')
                ->default(\DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}
