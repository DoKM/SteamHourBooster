@extends('adminlte::page')

@section('title', 'Dashboard')



@section('sidebarContent')
@endsection

@section('content_header')
    <h1 class="m-0 text-dark">Admin dashboard</h1>
@stop

@section('content')
    <div class="card">
        <div class="card-header">
            Test
        </div>
        <div class="card-body">
            <table class="w-75">
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        User Name
                    </th>
                    <th>
                        Email
                    </th>
                    <th>
                        Role
                    </th>
                    <th>
                        Edit
                    </th>
                </tr>
                @foreach($users as $user)
                    <tr>
                        <td>
                            {{$user->id}}
                        </td>
                        <td>
                            {{$user->name}}
                        </td>
                        <td>
                            {{$user->email}}
                        </td>
                        <td>
                            @if($user->role === 0)
                                <i class="fas fa-pause"></i> Inactive
                            @elseif($user->role === 1)
                                <i class="fas fa-start"></i> Boost Permission
                            @elseif($user->role === 2)

                            @elseif($user->role === 3)

                            @elseif($user->role === 4)
                                <i class="far fa-star"></i> Admin
                            @elseif($user->role === 5)
                                <i class="fas fa-crown"></i> Super Admin
                            @endif
                        </td>
                        <td>
                            <a href="{{route('admin.show', $user->id)}}"><button type="button" class="btn btn-info">Show</button></a>
                        </td>
                    </tr>
                @endforeach
            </table>
            <div>
                {{$users->render()}}
            </div>
        </div>
    </div>
@stop
