@extends('vendor.adminlte.ErrorPage')

@section('ErrorMessage')
    Forbidden
@endsection

@section('ErrorCode')
    403
@endsection

@section('ErrorDescription')

    <p>You do not have the required permissions to visit this page.</p>
    <p>You can retry or go to another page.</p>

@endsection
