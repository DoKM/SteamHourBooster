<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\SAccount;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function SteamAccounts()
    {
        return $this->hasMany('App\SAccount', 'AccountOwner', 'id')->where('Encrypted','=',  true)->select(['id', 'AccountName', 'Boost', 'StatusCode']);
    }

    public function isSuperAdmin(){
        return ($this->role === 5);
    }

    public function isAdmin(){
        return ($this->role >= 4);
    }

    public function isPermittedToBoost(){

        return ($this->role >= 1);
    }
}
