<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Game;
use App\User;

class SAccount extends Model
{


    function owner(){

        return $this->belongsTo('App/User');
    }

    function games(){
        return $this->hasMany('App\Game', 'account');
    }
}
