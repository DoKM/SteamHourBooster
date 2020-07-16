<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description"
        content="Steam HourBooster made by DoKM91AS" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="Codeply">
    <link rel="stylesheet" href="/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/css/animate.min.css" />
    <link rel="stylesheet" href="/css/ionicons.min.css" />
    <link rel="stylesheet" href="/css/styles.css" />
    
    
</head>

<body>
    <nav id="topNav" class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand page-scroll" href="#first"><i class="fab fa-steam"></i> <B>Steam</B> HourBooster</a>
            </div>
            <div class="navbar-collapse collapse" id="bs-navbar">
                <ul class="nav navbar-nav">
                    <li>
                        <a class="page-scroll" href="#one">Features</a>
                    </li> 
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a class="page-scroll" data-toggle="modal" title="A free Bootstrap video landing theme"
                            href="{{route('account.index')}}">Dashboard</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <header id="first">
        <div class="header-content">
            <div class="inner">
                <h1 class="cursive">Steam HourBooster</h1>
                <h4 class="">Simple, intuitive and powerfull.</h4>
                <hr>
            <a href="{{route('account.index')}}" class="btn btn-primary btn-xl page-scroll">Get Started</a>
            </div>
        </div>
        <video autoplay="" loop="" class="fillWidth fadeIn wow collapse in" data-wow-delay="0.5s"
            poster="https://s3-us-west-2.amazonaws.com/coverr/poster/Traffic-blurred2.jpg" id="video-background">
            <source src="https://s3-us-west-2.amazonaws.com/coverr/mp4/Traffic-blurred2.mp4" type="video/mp4">
            Your browser does not support the video tag. I suggest you upgrade your browser.
        </video>
    </header>
    <section class="container-fluid" id="one">
        <div class="row">
            <div class="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                <h2 class="text-center text-secundary">Features</h2>
                <hr>
                <div class="media wow fadeInRight">
                    <h3 class="text-secundary">Easy setup</h3>
                    <div class="media-body media-middle">
                        <p>The project is easy to setup with minimal knowledge.</p>
                        
                    </div>
                    <div class="media-right">
                        <i class="icon-lg ion-ios-bolt-outline"></i>
                    </div>
                </div>
                <hr>
                
                <div class="media wow fadeIn">
                    <h3 class="text-secundary">Public</h3>
                    
                    <div class="media-left">
                        <i
                                class="icon-lg ion-ios-cloud-download-outline text-primary"></i>
                    </div>

                    <div class="media-body media-middle">
                        <p>This project is free for you to use and modify.</p>

                        
                        <a href="https://github.com/DoKM/SteamHourBoosterFrontend">The Frontend</a> - 
                        
                        <a href="https://github.com/DoKM/SteamHourBoosterBackend">The Backend</a>
                        <br>
                        <small>Not meant for commercial purposes.</small>
                    </div>
                    
                </div>
                <hr>
                <div class="media wow fadeInRight">
                    <h3 class="text-secundary">Protected</h3>
                    <div class="media-body media-middle">
                        <p>Using RSA and AES encryption.</p>
                        <small>*note: I'm a student as of making this project and a lot of things could be better.</small>
                    </div>
                    <div class="media-right">
                        <i class="icon-lg fas fa-key"></i>
                    </div>
                </div>
                <hr>
                
                <div class="media wow fadeInRight">
                    <h3 class="text-secundary"></h3>
                    <div class="media-middle media-left">
                        <i class="icon-lg ion-ios-flask-outline"></i>
                    </div>
                    <div class="media-body media-middle">
                        <p><i class="fas fa-check"></i> Easy menus.</p>
                        <p><i class="fas fa-check"></i> Steam guard support.</p>
                        <p><i class="fas fa-check"></i> Proper deletion!</p>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    </section>


    <footer id="footer">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-6 col-sm-3 column" style="bottom: 0px">
                    
                </div>
                <div class="col-xs-6 col-sm-3 column">
                    
                </div>
                <div class="col-xs-12 col-sm-3 column">
                    
                </div>
                <div class="col-xs-12 col-sm-3 text-right pull-right">
                    <h4>Follow me</h4>
                    <ul class="list-inline">
                        <li><a href="https://github.com/DoKM" title="Github"><i
                                    class="icon-lg fab fa-github"></i></a>&nbsp;
                        </li>
                    </ul>
                </div>
            </div>
            <br />
            <span class="pull-right text-muted small">Steam HourBooster by <a href="https://github.com/DoKM">DoKM91AS</a></span>
                <br>
            <span class="pull-right text-muted small"><a href="http://www.bootstrapzero.com">Landing Zero by
                    BootstrapZero</a> ©2015 Company</span>
        </div>
    </footer>
    
    <!--scripts loaded here -->
    
    <script src="{{ asset('vendor/jquery/jquery.min.js') }}"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/jquery.easing.min.js"></script>
    <script src="/js/wow.js"></script>
    <script src="/js/scripts.js"></script>
    <script src="/js/titleChanger.js"></script>
    <link rel="stylesheet" href="{{ asset('vendor/fontawesome-free/css/all.min.css') }}">
</body>

</html>