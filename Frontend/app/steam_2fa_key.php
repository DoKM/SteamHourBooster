<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class steam_2fa_key extends Model
{
    function steamAccount(){

        return $this->belongsTo('App/SAccount');
    }
}
