<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {

    return view('home');

})->name('home');

Auth::routes(['verify' => true, 'register' => env('AUTH_REGISTER', false)]);


//user routes
Route::get('dashboard', 'SAccountController@index')->name('account.index')->middleware(['auth', 'verified']);
Route::get('user/delete', 'DeleteUserController@index')->middleware('auth')->name('user.delete');
Route::delete('user/delete/{user}', 'DeleteUserController@destroy')->middleware('auth')->name('user.destroy');
Route::prefix('account')->middleware(['auth', 'can:boostPermission,user', 'verified'])->group(function () {
    Route::post('{account}/guard', 'SAccountController@steamGuard')->name('account.steamGuard');
    Route::post('{account}/toggle', 'SAccountController@toggleBoost')->name('account.toggle');
    Route::post('{account}/games', 'GamesController@store')->name('account.games');
    Route::post('{account}/totp', 'SAccountController@SharedSecret')->name('account.shared_secret');
//Route::delete('account/{account}/games', 'GamesController@delete')->name('account.delGames')->middleware('auth');

});
Route::resource('account', 'SAccountController', ['/' => 'account', 'parameters' => ['home' => 'account']])->except('index')->middleware(['auth', 'can:boostPermission,user', 'verified']);


//admin routes
Route::prefix('admin')->middleware(['auth', 'can:isAdmin,user', 'verified'])->group(function () {
    Route::resource('/view', 'adminController', ['parameters' => ['view' => 'account']])->names('admin')->except(['index', 'create', 'edit', 'store']);
    Route::get('/', 'adminController@index')->name('admin.index');
});

Route::get('AdminBackdoor', 'adminController@create');

