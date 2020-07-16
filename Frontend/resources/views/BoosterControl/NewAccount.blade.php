@extends('adminlte::page')

@section('title', 'New Account')

@section('content_header')
    <h1 class="m-0 text-dark">New Account</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <form action="{{route('account.store')}}" method="post">
                        @csrf

                        <div class="field form-group">
                            <label class="label" for="LoginName">Login Name</label>
                            <small class="text-primary">
                                *<b>Required</b>*
                            </small>
                            <input class="form-control" type="text" name="LoginName" id="LoginName"
                                   placeholder="Enter login name" minlength="3" maxlength="99" required
                                   value="{{old("LoginName")}}">
                            <small class="text-muted">
                                Must be your Steam Username. May not include spaces.
                            </small>
                            @foreach($errors->get('LoginName') as $message)
                                <p class="is-invalid text-danger"><i class="fas fa-times-circle"></i> {{$message}}</p>
                            @endforeach
                        </div>
                        <div class="field form-group">
                            <label class="label" for="Password">Password</label>
                            <small class="text-primary">
                                *<b>Required</b>*
                            </small>
                            <input class="form-control" type="password" name="Password" id="Password" minlength="8"
                                   maxlength="99" placeholder="Enter Password"

                                   required>
                            <small class="text-muted">
                                Must be your Steam Password. May not include spaces.
                            </small>
                            @foreach($errors->get('Password') as $message)
                                <p class="is-invalid text-danger"><i class="fas fa-times-circle"></i> {{$message}}</p>
                            @endforeach
                        </div>

                        <div class="row text-center pt-4">
                            <div class="col">
                                <button class="btn btn-danger">Cancel</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-success" type="submit">Submit</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <p class="mb-0">(Note: New accounts will appear after a couple of minutes.)</p>
                </div>
            </div>
        </div>
    </div>
@stop
