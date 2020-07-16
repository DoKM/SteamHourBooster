
@extends('adminlte::page')

@section('title', 'AdminLTE')

@section('content_header')

@stop

@section('sidebarContent')
@endsection

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h1 class="text-center m-0 text-dark">Error: <b>@yield('ErrorCode')</b></h1>
                </div>
                <div class="card-body text-center">

                    <h1 class="m-0 text-dark">@yield('ErrorMessage')</h1>
                </div>

            </div>
            <div class="card">
                <div class="card-body alert-light text-dark text-center">
                    <h2>
                    @yield('ErrorDescription')
                    </h2>
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
                            @if(env('AUTH_REGISTER', false))
                            <a href="{{route('register')}}" class="btn btn-info btn-lg"><span class="glyphicon glyphicon-home"></span>
                                Register </a>
                            @endif
                        </div>
                    </div>
                </div>


    </div>
@stop


{{--@section ('content')--}}
{{--    <div id="center">--}}

{{--        <pre id="titlebar" class="titlebarWidth" ><div class="title Bordergoldblackground    borderradius padding10 margin15"><a href="{{route('home')}}"><img src="/image/QuestionMark.png" class="flip" width="30" height="30" alt="?"> 404 <img src="/image/QuestionMark.png" class="flip" width="30" height="30" alt="?"></a></div></pre>--}}

{{--            <div class="animated fadeIn">--}}
{{--                <pre align="middle" >--}}
{{--                  <div class="blackground bordergold margintest3"> The page that was requested couldn't be found </div></pre>--}}
{{--            <pre><div class="blackground bordergold margintest3"> [ <a href="{{route('home')}}">Click here to bo back to the homepage (only page)</a>  ] </div></pre>--}}
{{--            <pre align="bottom"> <div class="blackground bordergold margintest1"> [ <a href="https://steamcommunity.com/id/DoKM91AS">Steam Account</a> - <a href="https://www.youtube.com/channel/UCFVUC-lNa4stBVuuV3rCVeA">Youtube</a> - <a href="https://twitter.com/DoKM91AS">Twitter</a> - <a href="https://www.twitch.tv/dokm91as">Twitch</a> - <a href="https://aimware.net/forum/user-25607.html">Aimware.net</a> ] </div></pre>--}}


{{--            <pre><div id="marquee"><div class="js-marquee-wrapper"><div class="js-marquee"><a href="https://github.com/DoKM"><div class="blackground bordergold"> [ Crew-Crew - DoKM91AS ] </div></a></div></div></div></pre>--}}


{{--        </div>--}}
{{--    </div>--}}
{{--@endsection--}}
