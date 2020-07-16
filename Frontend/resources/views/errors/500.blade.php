@extends('vendor.adminlte.ErrorPage')

@section('ErrorMessage')
    Internal Server Error
@endsection

@section('ErrorCode')
    500
@endsection

@section('ErrorDescription')

    <p>A unexpected error occurred.</p>
    <p>You can retry or go to another page.</p>

@endsection
