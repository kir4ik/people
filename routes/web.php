<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::namespace('User')->group(function() {
    Route::middleware('guest')->group(function() {
        Route::get('login', 'LoginController@show')->name('showLogin');
        Route::post('login', 'LoginController@login');

        Route::get('register', 'RegisterController@show')->name('showReg');
        Route::post('register', 'RegisterController@create');
    });

    Route::middleware('auth')->group(function() {
        Route::get('/', 'UserController@show')->name('showProfile');
        Route::get('/logout', 'UserController@destroy')->name('logout');
    });
});


/*AJAX request*/
Route::namespace('Ajax')->prefix('ajax')->group(function() {
   Route::middleware('guest')->group(function() {
       Route::get('login', function() {
           return abort(404);
       });
       Route::post('login', 'LoginController@login');

       Route::get('register', function() {
           return abort(404);
       });
       Route::post('register', 'RegisterController@create');
   });
});

