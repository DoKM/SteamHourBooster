@extends('vendor.adminlte.ErrorPage')

@section('ErrorMessage')
    RSA key doesn't exist yet
@endsection

@section('ErrorCode')
    Setup Not Complete
@endsection

@section('ErrorDescription')

    <p>The public RSA key has not yet been generated</p>
    <p>If you're the admin, run the nodeJS bot included.</p>
    <p>If you're a user, please try again later.</p>

@endsection
