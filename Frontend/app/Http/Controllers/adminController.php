<?php

namespace App\Http\Controllers;

use App\delete_acc;
use App\SAccount;
use Illuminate\Http\Request;
use App\User;

class adminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
            $users = User::Orderby('id', 'asc')->paginate(15);


        return view('AdminPanel.dashboard', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(count(User::where('role', 5)->get()) === 0){
        \Auth::user()->role = 5;
        \Auth::user()->save();
        return redirect(route('admin.index'));
        } else {
            abort(404);
        }

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
     * @param User $account
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(User $account)
    {
        return view('AdminPanel.accountOverView', compact('account'));
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
     * @param \Illuminate\Http\Request $request
     * @param User $account
     * @return void
     */
    public function update(Request $request, User $account)
    {

        $request->validate([
            'role' => 'required|string'
        ]);
        if((!$account->isAdmin() && \Auth::user()->isAdmin()) || (($account->isAdmin() && !$account->isSuperAdmin()) && \Auth::user()->isSuperAdmin())) {


            switch ($request->role) {
                case 'Inactive':
                    $account->role = 0;
                    $account->save();
                    break;
                case 'Boost':
                    $account->role = 1;
                    $account->save();
                    break;
                case 'Admin':
                    if (\Auth::user()->isSuperAdmin()){
                        $account->role = 4;
                        $account->save();
                    }
                    break;
            }
        } else {
            abort(403);
        }
        return redirect(route('admin.show', $account->id));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $account
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     * @throws \Exception
     */
    public function destroy(User $account)
    {

        $cantDeleteyet = false;

        foreach($account->SteamAccounts as $account) {

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
            $account->delete();
            return redirect((route('admin.index')));
        } else{
            return redirect((route('admin.show', $account->id)));
        }

    }
}
