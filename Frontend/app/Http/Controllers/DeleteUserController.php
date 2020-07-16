<?php

namespace App\Http\Controllers;

use App\delete_acc;
use App\User;
use Illuminate\Http\Request;

class DeleteUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('user.deletePage');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return string
     */
    public function destroy(User $user)
    {
        $cantDeleteyet = false;

        foreach($user->SteamAccounts as $account) {

            if ($account->StatusCode === 6 || $account->Boost === 0) {
                //deletes the account from the database
                //and creates a db entry so the bot can delete a file from disk
                $delete_acc = new delete_acc();
                $delete_acc->AccountName = $account->AccountName;
                $delete_acc->save();
                $account->delete();

            } else if ($account->StatusCode === 5) {
                //another delete request had been send while the account was marked
                $cantDeleteyet = true;
            } else {
                //marks the account for deleting
                $account->StatusCode = 5;
                $account->save();
                $cantDeleteyet = true;
            }
        }
        if(!$cantDeleteyet){
            $user->delete();
            return redirect(route('home'));
        } else{
            return redirect(route('user.delete'));
        }

    }
}
