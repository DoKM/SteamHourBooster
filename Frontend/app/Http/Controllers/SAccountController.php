<?php

namespace App\Http\Controllers;

use App\SAccount;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Steam;
use App\Game;
use App\delete_acc;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use App\steam_2fa_key;


class SAccountController extends Controller
{

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {


    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $SteamAccounts = SAccount::where('AccountOwner', '=', \Auth::user()->id)->where('encrypted', '=', true)->paginate(15);
        return view('BoosterControl.dashboard', compact('SteamAccounts'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {

        return view('BoosterControl.NewAccount');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $request)
    {

        if (!Storage::exists('/crypto/RSA/Key.pem')) {
            return view('errors.RSAnotHere');
        }


        Validator::make($request->all(), [
            'LoginName' => 'required|regex:/^\S*$/u|min: 3|max:99|unique:App\SAccount,AccountName',
            'Password' => 'required|regex:/^\S*$/u|min: 8|max:99',

        ], [
            'required' => 'The :attribute field is required.',
            'regex' => 'The :attribute may not contain spaces.',
            'min' => 'The :attribute field must be :min characters or longer.',
            'max' => 'The :attribute field must be :max characters or shorter.',
            'LoginName.unique' => 'The account name that was entered already exists on our DB, contact and admin to resolve this problem.'

        ])->validate();

//        $key = file_get_contents(readlink ('storage/crypto/RSA/')+'Key.pem');

        $key = Storage::get('/crypto/RSA/Key.pem');
        $encrypted = null;
        openssl_public_encrypt($request->Password, $encrypted, $key);

        $account = new SAccount();
        $account->AccountName = strtolower($request->LoginName);
        $account->PWord = (string)base64_encode($encrypted);
        $account->Boost = false;
        $account->Encrypted = false;
        $account->AccountOwner = \Auth::user()->id;

        $account->save();

        $string = 'Succesfully added account: ' . $account->AccountName . '!';
        return redirect(route('account.index'))->with('string', $string);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\SAccount $account
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show(SAccount $account)
    {


        $this->ownsAccount($account);
        $account->PWord = null;
        $account->LoginKey = null;

        if (isset($account->SteamID) && $account->SteamID !== 0) {
            $ID = Steam::convertID($account->SteamID, 'ID32');
            $playerInfo = Steam::player($ID);
            $account->OwnedGames = $playerInfo->GetOwnedGames(true, true);
            $account->steamLink = Steam::convertID($account->SteamID, 'ID64');
        } else {
            $account->OwnedGames = [];
        }

        return view('BoosterControl.ControlAccount', compact('account'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\SAccount $account
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function edit(SAccount $account)
    {
        $this->ownsAccount($account);
        $account->PWord = null;
        return view('BoosterControl.EditAccount', compact('account'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\SAccount $account
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SAccount $account)
    {
        $this->ownsAccount($account);
        if (!Storage::exists('/crypto/RSA/Key.pem')) {
            return view('errors.RSAnotHere');
        }

        Validator::make($request->all(), [
            'Password' => 'required|regex:/^\S*$/u|min: 8|max:99',

        ], [
            'required' => 'The :attribute field is required.',
            'regex' => 'The :attribute may not contain spaces.',
            'min' => 'The :attribute field must be :min characters or longer.',
            'max' => 'The :attribute field must be :max characters or shorter.',

        ])->validate();


        $key = Storage::get('/crypto/RSA/Key.pem');
        $encrypted = null;
        openssl_public_encrypt($request->Password, $encrypted, $key);


        $account->PWord = (string)base64_encode($encrypted);
        $account->Boost = false;
        $account->StatusCode = 0;
        $account->Encrypted = false;
        $account->save();


        $string = 'Succesfully updated account: ' . $account->AccountName . '!';
        return redirect(route('account.index'))->with('string', $string);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\SAccount $Account
     * @return \Illuminate\Http\Response
     */
    public function destroy(SAccount $account)
    {
        $this->ownsAccount($account);
        if ($account->StatusCode === 6 || $account->Boost === 0) {
            //deletes the account from the database
            //and creates a db entry so the bot can delete a file from disk
            $delete_acc = new delete_acc();
            $delete_acc->AccountName = $account->AccountName;
            $delete_acc->save();
            $account->delete();

            return 'deleted';
        } else if ($account->StatusCode === 5) {
            //another delete request had been send while the account was marked
            return 'wait';
        } else {
            //marks the account for deleting
            $account->StatusCode = 5;
            $account->save();
            return 'marked';
        }

    }

    /**
     * Changes the boost option on the specified account
     * @param \Illuminate\Http\Request $request
     * @param \App\SAccount $account
     * @return \Illuminate\Http\Response
     */
    public function toggleBoost(Request $request, SAccount $account)
    {
        $this->ownsAccount($account);

        $request->validate([
            'Boost' => 'Boolean|required',
        ]);


        $account->Boost = (($request->Boost === true) ? 0 : 1);
        $account->StatusCode = 0;
        $account->save();

        return (string)$account->Boost;
    }

    /**
     * Changes the boost option on the specified account
     * @param \Illuminate\Http\Request $request
     * @param \App\SAccount $account
     * @return \Illuminate\Http\Response
     */
    public function steamGuard(Request $request, SAccount $account)
    {
        //implement this shit
        $this->ownsAccount($account);

        $request->validate([
            'code' => 'alpha_num|required|min:5|max:5',
        ]);

        $account->SteamGuardCode = $request->code;
        $account->StatusCode = 2;
        $account->save();

//        return 'success';
    }

    private function ownsAccount(SAccount $account)
    {
        if (Gate::denies('ownsAccount', $account)) {
            abort(403);
        }
    }

    public function SharedSecret(Request $request, SAccount $account){
        if (Gate::denies('ownsAccount', $account)) {
            abort(403);
        }

        if (!Storage::exists('/crypto/RSA/Key.pem')) {
            return view('errors.RSAnotHere');
        }

        $request->validate([
            'code' => 'string|required',
        ]);
        $SharedSecret = new steam_2fa_key();
        $SharedSecret->Account_Name = $account->AccountName;
        $SharedSecret->Account_ID = $account->id;

        $key = Storage::get('/crypto/RSA/Key.pem');

        $encrypted = null;
        openssl_public_encrypt($request->code, $encrypted, $key);

        $SharedSecret->Shared_Secret = (string)base64_encode($encrypted);;
        $SharedSecret->save();
        return 'success';
        return redirect(route('account.show', $account->id));


    }
}
