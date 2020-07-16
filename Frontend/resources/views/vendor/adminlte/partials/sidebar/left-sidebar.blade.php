<aside class="main-sidebar {{config('adminlte.classes_sidebar', 'sidebar-dark-primary elevation-4')}}">

    {{-- Sidebar brand logo --}}
    @if(config('adminlte.logo_img_xl'))
        @include('adminlte::partials.common.brand-logo-xl')
    @else
        @include('adminlte::partials.common.brand-logo-xs')
    @endif

    {{-- Sidebar menu --}}
    <div class="sidebar">
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column {{config('adminlte.classes_sidebar_nav', '')}}"
                data-widget="treeview" role="menu"
                @if(config('adminlte.sidebar_nav_animation_speed') != 300)
                    data-animation-speed="{{ config('adminlte.sidebar_nav_animation_speed') }}"
                @endif
                @if(!config('adminlte.sidebar_nav_accordion'))
                    data-accordion="false"
                @endif>
                @yield('sidebarContentDiv')
                {{-- Configured sidebar links --}}
                @if(!isset($disableSideBar))
                @each('adminlte::partials.menuitems.menu-item', $adminlte->menu(), 'item')
                @endif
                @yield("sidebarContent")
                @can('boostPermission')
                    <li class="nav-item ">
                        <a class="nav-link" href="{{route('account.create')}}">
                            <i class="fas fa-fw fa-lock "></i>
                            <p>
                                New Account
                            </p>
                        </a>
                    </li>
                @endcan

                @can('isAdmin')
                    <li class="nav-header">Admin navigation</li>
                    <li class="nav-item ">
                        <a class="nav-link" href="{{route('admin.index')}}">
                            <i class="fas fa-fw fa-lock "></i>
                            <p>
                                Admin Panel

                            </p>
                        </a>
                    </li>
                @endcannot

            </ul>
        </nav>
    </div>

</aside>
