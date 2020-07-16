<?php

namespace App\Http\Controllers;

use App\Game;
use App\SAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;


class GamesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param SAccount $account
     * @return void
     */
    public function store(Request $request, SAccount $account)
    {
//        dd($account);
        if (Gate::denies('ownsAccount', $account)) {
            abort(403);
        }

        $request->validate([
            'games' => 'array',
            'games.*.AppID' => 'required|numeric',
            'games.*.GameName' => 'string|nullable'

        ]);

//        dd($request);
        $this->destroy($account);
//        dd($request);
        if(isset($request->games) && (count($request->games) > 0)) {
        foreach ($request->games as $gameReq){
//        dd(is_object($gameReq));
//            dd($gameReq);
//            dd($gameReq["AppID"]);
            $game = new Game();
            $game->AppID = $gameReq["AppID"];

            $game->GameName = $gameReq["GameName"];
            $game->account = $account->id;
            $game->save();
        }}

        return 'success';


    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Game  $games
     * @return \Illuminate\Http\Response
     */
    public function show(Game $games)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Game  $games
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function edit(Game $games)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Game  $games
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Game $games)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Game  $games
     * @return \Illuminate\Http\Response
     */
    public function destroy(SAccount $account)
    {
        if($account->AccountOwner !== \Auth::user()->id){
            abort(403);
        }
        $deleteGames = $account->games;


        if((count($deleteGames) > 0)) {

            foreach ($deleteGames as $deleteGame) {
                $deleteGame->delete();

            }
        }

    }
}
