<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\User;
use App\SAccount;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
        Gate::define('ownsAccount', function(User $user, $account){

            return ($user->id === $account->AccountOwner && $user->isPermittedToBoost());
        });

        Gate::define('boostPermission', function ($user){
            return $user->isPermittedToBoost();
        });

        Gate::define('isAdmin', function($user){
            return $user->isAdmin();
        });

        Gate::define('isSuperAdmin', function($user){
            return $user->isSuperAdmin();
        });
    }
}
