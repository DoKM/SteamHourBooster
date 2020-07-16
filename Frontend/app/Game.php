<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\SAccount;

class Game extends Model
{

    function SteamAccount(){
        $this->belongsTo('App/SAccount');
    }
}
