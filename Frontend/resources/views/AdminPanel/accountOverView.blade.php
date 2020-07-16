@extends('adminlte::page')

@section('title', 'User: '.$account->name)



@section('sidebarContent')
@endsection

@section('content_header')
    <h1 class="m-0 text-dark">Account: {{$account->name}}</h1>
@stop

@section('content')

    <div class="card card-info">
        <div class="card-header">
            User info
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-xs-6 col-m-2 col-xl-4  mt-3 mb-3">
                    <div class="card card-success h-100">
                        <div class="card-header">
                            Account info
                        </div>
                        <div class="card-body">

                            <h3><b>Accounts:</b> {{count($account->SteamAccounts)}}</h3>

                            <h3><b>User Since: </b>
                                {{(new DateTime($account->created_at))->format('d-m-Y')}}
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="col-xs-6 col-m-2 col-xl-4 mt-3 mb-3">
                    <div class="card card-primary h-100">
                        <div class="card-header">
                            Role control
                        </div>
                        <div class="card-body">
                            <div>
                                <b>Current role:</b> @if($account->role === 0)
                                    <i class="fas fa-pause"></i> Inactive
                                @elseif($account->role === 1)
                                    <i class="fas fa-start"></i> Boost Permission
                                @elseif($account->role === 4)
                                    <i class="far fa-star"></i> Admin
                                @elseif($account->role === 5)
                                    <i class="fas fa-crown"></i> Super Admin
                                @endif
                            </div>

                            @if((!$account->isAdmin() && \Auth::user()->isAdmin()) || (($account->isAdmin() && !$account->isSuperAdmin()) && \Auth::user()->isSuperAdmin()))
                                <form method="post" action="{{route('admin.update', $account->id)}}">
                                    @csrf
                                    @method('PUT')
                                    <div class="form-group">
                                        <label for="role">Role</label>
                                        <select name="role" class="selectpicker form-control w-100">
                                            <option {{$account->role === 0?'selected':''}} value="Inactive">Inactive
                                            </option>
                                            <option {{$account->role === 1?'selected':''}} value="Boost">
                                                Boost Permission
                                            </option>
                                            @if(\Auth::user()->isSuperAdmin())
                                                <option {{$account->role === 4?'selected':''}} value="Admin">
                                                    Admin
                                                </option>
                                            @endif

                                        </select>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="btn btn-success mb-2">Set Role</button>
                                    </div>
                                </form>
                            @endif
                        </div>
                    </div>
                </div>
                @if((!$account->isAdmin() && \Auth::user()->isAdmin()) || (($account->isAdmin() && !$account->isSuperAdmin()) && \Auth::user()->isSuperAdmin()))
                    <div class="col-xs-6 col-m-2 col-xl-4 mt-3 mb-3">
                        <div class="card card-danger h-100">
                            <div class="card-header text-bold">
                                Delete Account?
                            </div>
                            <div class="card-body">
                                <div>
                                    <p>
                                    <h3><span class="badge-warning badge">WARNING</span></h3>
                                    This is a one time process, and should only be used on accounts that arent boosting
                                    games.
                                    </p>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-danger" id="modalDeleteButton">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('modalDeleteButton').addEventListener('click', toggle_modal)

        function toggle_modal() {
            $('#DeleteBox').modal('toggle')
        }
    </script>
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="DeleteBox"
         aria-hidden="true">
        <div class="modal-dialog modal-m">
            <div class="modal-content">
                <div class="modal-header bg-red">
                    <h5 class="modal-title">Delete Account</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>

                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete the account?</p>
                    <form method="post" action="{{Route('admin.destroy', $account->id)}}">
                        @csrf
                        @method('delete')
                        <button type="submit" class="btn btn-outline-danger">Delete</button>
                    </form>
                </div>

            </div>
        </div>
    </div>
    @else
            </div>
        </div>
    </div>
    @endif

@stop
