@extends('adminlte::page')

@section('title', 'Control Panel')

@section('content_header')
    <h1 class="m-0 text-dark">Account Control</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <div class="m-1 mt-1 pl-2 mr-4 row">
                                <p class=""><b>Account</b>: {{$account->AccountName}}</p>


                            </div>
                            <div class="">
                                <div class="row">
                                    <button class="btn btn-primary m-1 mt-1 pr-2 mr-4" id="boostToggle">Toggle Status: <span
                                            id="Status"
                                            class="badge badge-{{$account->Boost===1?'success':'warning'}}">{{$account->Boost===1?'Active':'Inactive'}}</span>
                                    </button>
                                    <input type="hidden" id="BoostStatus" value="{{$account->Boost===1?'true':'false'}}">
                                </div>
                                <div class="row">
                                    @if (isset($account->steamLink))
                                        <a href="http://steamcommunity.com/profiles/{{$account->steamLink}}">
                                            <button type="button" class="btn btn-info m-0 ml-1 pr-2 mr-4">Steam Profile
                                            </button>
                                        </a>
                                    @else
                                        <button type="button" disabled class="btn btn-info m-0 ml-1 pr-2 mr-4">Steam Profile
                                        </button>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col pl-0">
                            <div class="m-1 mt-1 pr-2 mr-4 row">
                                <button type="button" @if($account->StatusCode !== 1)class="btn btn-info"
                                        disabled
                                        @else
                                        class="btn btn-warning"
                                        @endif
                                        id="steamGuardButton">
                                Steam Guard
                                </button>
                            </div>
                            <div class="m-1 mt-1 pr-2 mr-4 row">
                                <a href="{{route('account.edit', $account->id)}}">
                                    <button type="button" class="btn btn-info">Change Password
                                    </button>
                                </a>
                            </div>


                        </div>
                        <div class="col pl-0">
                            <div class="m-1 mt-1 pr-2 mr-4 row">
                                    <button type="button" id="SteamTOTPButton" class="btn btn-info">Send Steam Shared Secret Key
                                    </button>
                                </a>
                            </div>
                            <div class="m-1 mt-1 pr-2 mr-4 row">
                                <button type="button" id="DeleteAccount" class="btn btn-danger">
                                    Delete Account: <span id="Status"
                                                          class="badge badge-{{$account->StatusCode===5?'warning':($account->StatusCode===6?'dark':'secondary')}}">{{$account->StatusCode===5?'Marked':($account->StatusCode===6?'Delete':'Unmarked')}}</span>
                                </button>
                            </div>
                        </div>


                        <div class="modal fade" id="wait" tabindex="-1" role="dialog"
                             aria-labelledby="waitLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="waitLabel">Error</h5>
                                        <button type="button" class="close" data-dismiss="modal"
                                                aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        The account can't be closed yet.<br>
                                        Please wait a bit and try again.
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-info" data-dismiss="modal">Ok
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal fade" id="SteamTOTP" tabindex="-1" role="dialog"
                             aria-labelledby="waitLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="waitLabel">Steam Shared_Secret</h5>
                                        <button type="button" class="close" data-dismiss="modal"
                                                aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        Please Insert the Steam Shared_Secret<br>
                                        <label for="steamTOTPKey">Steam Shared_Secret</label>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control" aria-label="Shared_Secret" aria-describedby="basic-addon2" id="steamTOTPKey"
                                                   required minlength="25" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxx=" maxlength="50">
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-info" id="sendSteamTOTPButton" type="button">Send</button>
                                            </div>
                                        </div>

                                        <small class="text-muted">
                                            <span id="Shared_SecretSign">Note: Must end on a '<b>=</b>'</span><br>
                                            <span id="Shared_SecretLength">Note 2: Length should be 28 Characters</span>
                                        </small><br><br>
                                        <div>
                                            To get your Shared_Secret key, read this:
                                            <a href="https://github.com/SteamTimeIdler/stidler/wiki/Getting-your-'shared_secret'-code-for-use-with-Auto-Restarter-on-Mobile-Authentication"><b>Guide</b></a>
                                        </div>

                                    </div>
                                    <div class="modal-footer">

                                        <button type="button" class="btn btn-info" data-dismiss="modal">Ok
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal fade" id="SteamGuardCode" tabindex="-1" role="dialog"
                             aria-labelledby="waitLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="waitLabel">SteamGuard</h5>
                                        <button type="button" class="close" data-dismiss="modal"
                                                aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div>
                                            Please enter the Steam guard code.<br>
                                            The account will disable itself if it took too long.<br>

                                        </div>
                                        <div>
                                            <div class="input-group mb-3">
                                                <input type="text" class="form-control" id="steamGuardCodeInput"
                                                       required minlength="5" maxlength="5" placeholder="Code"
                                                       aria-label="Code" aria-describedby="basic-addon2">
                                                <div class="input-group-append">
                                                    <button class="btn btn-success" id="sendGuardCodeButton"
                                                            type="button">send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="steamGuardCallback">

                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger" data-dismiss="modal">Exit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div class="card w-100 ml-3 mr-3">
            <div class="card-body">
                <div class="row">

                    <div class="col">
                        <div id="Gamelist" style="width:100%">
                            <table id="TableGameList" class="table">
                                <tr>
                                    <th class="AppID">
                                        AppID
                                    </th>
                                    <th>
                                        App Name
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div class="row text-center pt-4 justify-content-end">
                            <div class="col">
                                <button class="btn btn-success" id="submitGames">Submit New Games</button>
                            </div>
                        </div>
                    </div>


                    <div class="col">
                            <span>
                                <!-- Include Twitter Bootstrap and jQuery: -->
                            <script src="https://unpkg.com/@popperjs/core@2"></script>
                            <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
                            <link rel="stylesheet"
                                  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
                                  integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
                                  crossorigin="anonymous">
                            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
                                    integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
                                    crossorigin="anonymous"></script>
                            <link rel="stylesheet" href="/css/style.css">


                                <!-- Include the plugin's CSS and JS: -->

                            <script type="text/javascript" src="/js/bootstrap-multiselect.js"></script>
                            <link rel="stylesheet" href="/css/bootstrap-multiselect.css" type="text/css"/>
                            </span>

                        @if(isset($account->OwnedGames) && count($account->OwnedGames) > 0)
                            <div class="row col justify-content-center">
                                <label for="GameList" class="text-center">Game List</label>
                            </div>


                            <div class="row col justify-content-center">
                                <select name="GameList" id="multiSelect" multiple="multiple">

                                    @foreach($account->OwnedGames as $game)
                                        <option value="{{$game->appId}}">{{$game->name}}</option>
                                    @endforeach

                                </select>
                            </div>
                        @else

                            <div class="field form-group">
                                <label class="label" for="AppID">AppID</label>
                                <input class="form-control" type="number" name="AppID" id="AppID"
                                       placeholder="Appid" required>

                            </div>
                            <div class="field form-group">
                                <label class="label" for="GameName">GameName</label>
                                <input class="form-control" type="text" name="GameName" id="GameName"
                                       placeholder="Game Name">

                            </div>
                            <div class="row text-center pt-4">
                                <div class="col">
                                    <button class="btn btn-danger" id="clearInput">Cancel</button>
                                </div>
                                <div class="col">
                                    <button class="btn btn-success" id="addNewGame">Submit</button>
                                </div>
                            </div>
                            <script src="/js/GameListManual.js" type="text/javascript"></script>
                        @endif


                        <script>
                            const guardURL = '{{route('account.steamGuard', $account->id)}}'
                            const toggleURL = '{{route('account.toggle', $account->id)}}'
                            const gamesURL = '{{route('account.games', $account->id)}}'
                            const deleteUrl = '{{route('account.destroy', $account->id)}}'
                            const home = '{{route('account.index')}}'
                            const steamShared_SecretUrl = '{{route('account.shared_secret', $account->id)}}'
                        </script>
                        <script src="/js/control-panel.js" type="text/javascript">

                        </script>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
@stop
