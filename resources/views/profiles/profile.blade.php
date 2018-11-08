@extends('base')

@section('content')
    <div class="container">
        <div class="row no-gutters justify-content-end bg-warning">
            <div class="col-auto align-self-center mx-auto text-secondary font-weight-bold text-capitalize">{{ $user_info->first_name ." ". $user_info->last_name }}</div>
            <a href="{{ route('logout') }}" class="btn btn-danger btn-lg rounded-0">Выйти</a>
        </div>

        <div class="row justify-content-center no-gutters bg-secondary text-white">
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">ID</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->user_id or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">E-mail</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->email or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">Дата регистрации</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->created_at->format('d.m.Y') }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">Имя</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->first_name or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">Фамилия</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->last_name or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">Пол</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->gender or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">Дата рождения</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->date_birth or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">О себе</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->about_user or 'неизвестно' }}</div>
            </div>
            <div class="row justify-content-around col-12 bg-dark py-2">
                <div class="col-sm-12 col-md-4 col-lg-2 bg-info text-uppercase">Страна</div>
                <div class="col-sm-12 col-md-6 col-lg-8 bg-secondary">{{ $user_info->user_country or 'неизвестно' }}</div>
            </div>
        </div>
    </div>
@stop