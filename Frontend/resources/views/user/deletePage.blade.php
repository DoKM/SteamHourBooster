@extends('adminlte::page')

@section('title', 'AdminLTE')

@section('content_header')

@stop

@section('sidebarContent')
@endsection

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card card-warning">
                <div class="card-header">
                    <h1 class="text-center m-0"><b>WARNING</b></h1>
                </div>
                <div class="card-body text-center">

                    <h1 class="m-0 text-dark">You're about to delete your account</h1>
                    <h2 class="text-center">Account name: {{\Auth::user()->name}}</h2>
                </div>

            </div>
            <div class="card">
                <div class="card-body alert-light text-dark text-center">
                    <h2>
                        This progress may require multiple clicks of the delete button.
<br>
                        If the account is not delete instantly it is because it is still active being run on the bot.
                        <br>
                        Please allow some time for the bot to remove the account max: 5 minutes.


                    </h2>

                    <h3>
                        This progress will delete all user info from the bot, and cannot be undone.
                    </h3>

                    <button class="btn btn-danger" id="deleteButton">Delete</button>
                </div>
            </div>




        </div>
    </div>
    <div class="container">


        <div class="error-actions text-center">
            <div class="row">
                <div class="col">
                    <a href="{{route('home')}}" class="btn btn-success btn-lg"><span class="glyphicon glyphicon-home"></span>
                        Home </a>
                </div>
                <div class="col">
                    <a href="{{route('account.index')}}" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>
                        Dashboard </a>
                </div>
                <div class="col">
                    <a href="{{route('register')}}" class="btn btn-info btn-lg"><span class="glyphicon glyphicon-home"></span>
                        Register </a>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('deleteButton').addEventListener('click', toggle_modal)

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
                    <form method="post" action="{{Route('admin.destroy', \Auth::user()->id)}}">
                        @csrf
                        @method('delete')
                        <button type="submit" class="btn btn-outline-danger">Delete</button>
                    </form>
                </div>

            </div>
        </div>
    </div>
@stop