@extends('adminlte::page')

@section('title', 'Dashboard')



@section('sidebarContent')
@endsection

@section('content_header')
    <h1 class="m-0 text-dark">Dashboard</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            @if (session('string'))
                <div class="card">
                    <div class="card-body alert-info">
                        {{ session('string') }}
                    </div>
                </div>
            @endif


            <div class="card">
                <div class="card-body">
                    @can('boostPermission')
                        <table class="table" style="width: 100%">
                            <tr class="">
                                <th>Name</th>
                                <th class="text-center">Games</th>
                                <th class="text-center">Boost Status</th>
                                <th class="text-center">Status</th>

                                <th class="text-center"><a href="{{route('account.create')}}">
                                        <button type="button" class="btn btn-info">New</button>
                                    </a></th>
                            </tr>
                            @foreach($SteamAccounts as $SteamAccount)
                                <tr class="@if($SteamAccount->StatusCode === 0 && $SteamAccount->Boost === 1)
                                        table-primary
@elseif ($SteamAccount->StatusCode === 1 && $SteamAccount->Boost === 1)
                                        table-info
@elseif ($SteamAccount->StatusCode === 3 && $SteamAccount->Boost === 1)
                                        table-secondary
@elseif (($SteamAccount->StatusCode === 4 && $SteamAccount->Boost === 0) || $SteamAccount->StatusCode === 5 || $SteamAccount->StatusCode === 6)
                                        table-danger
@endif">

                                    <td>{{$SteamAccount->AccountName}}</td>
                                    <td class="text-center">
                                        @if(count($SteamAccount->games) === 0)
                                            <span class="badge badge-secondary">{{count($SteamAccount->games)}}</span>
                                        @else
                                            <span class="badge badge-primary">{{count($SteamAccount->games)}}</span>
                                        @endif
                                    </td>
                                    <td class="text-center">@if($SteamAccount->Boost === 1)
                                            <span class="badge badge-success">Active</span>
                                        @else
                                            <span class="badge badge-secondary">Inactive</span>
                                        @endif
                                    </td>
                                    <td class="text-center">@if($SteamAccount->StatusCode === 0 && $SteamAccount->Boost === 1)
                                            <span class="badge badge-success">Running</span>
                                        @elseif ($SteamAccount->StatusCode === 0 && $SteamAccount->Boost === 0)
                                            <span class="badge badge-danger">Not Running</span>
                                        @elseif ($SteamAccount->StatusCode === 1 && $SteamAccount->Boost === 1)
                                            <span class="badge badge-info">Guard Code Required</span>
                                        @elseif ($SteamAccount->StatusCode === 3)
                                            <span class="badge badge-danger">Timeout</span>
                                        @elseif ($SteamAccount->StatusCode === 4)
                                            <span class="badge badge-danger">Invalid Password</span>
                                        @elseif($SteamAccount->StatusCode === 5)
                                            <span class="badge badge-warning">Marked for delete</span>
                                        @elseif($SteamAccount->StatusCode === 6)
                                            <span class="badge badge-danger">Deletable</span>
                                        @endif</td>

                                    <td class="text-center"><a href="{{route('account.show', $SteamAccount->id)}}">
                                            <button type="button" class="btn btn-secondary">Control</button>
                                        </a></td>
                                </tr>
                            @endforeach
                        </table>
                        <div class="">
                            {{$SteamAccounts->render()}}
                        </div>
                    @endcan
                    @cannot('boostPermission')
                            <div class="text-center">
                                You do not have the permission to use the booster yet.
                            </div>
                    @endcannot
                </div>
            </div>
        </div>
    </div>
@stop
