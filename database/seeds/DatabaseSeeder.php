<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'email' => 'test@gmail.com',
            'password' => bcrypt('qwerty'),
        ]);

        DB::table('profiles')->insert([
            'user_id' => 1,
            'first_name' => 'Владислав',
            'last_name' => 'Владиславович',
            'country_code' => 'UKR',
            'about_user' => 'Это информация обо мне и я разработал этот сайт.',
        ]);
        // $this->call(UsersTableSeeder::class);
    }
}
