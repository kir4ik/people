@extends('base')

@section('content')
    <div class="container">
        {{--if Fail Auth--}}
        @isset($fail)
            <div class="alert alert-danger">
                {{ $fail or '' }}
            </div>
        @endisset
        {{--Block with fortm of auth--}}
        <div class="row justify-content-center no-gutters">
            <form action="" method="post" class="col-10 col-sm-8 col-md-6 col-lg-4 needs-validation" id="auth"
                  novalidate>
                {{ csrf_field() }}

                {{--Блок с содержимым формы--}}
                <div class="row no-gutters px-5 py-2">
                    {{--Title--}}
                    <h1 class="col-12 h3 font-weight-bold text-uppercase text-center mb-3">Форма Входа</h1>

                    {{--Input Email--}}
                    <div class="col-12 row no-gutters">
                        <label for="inputEmail" class="label text-muted required">Email address</label>
                        <input type="email" id="inputEmail" class="form-control"
                               name="email"
                               value="{{ old('email') }}">
                        {{--If incoorect email--}}
                        @if($errors->has('email'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('email') }}
                            </div>
                        @endif
                    </div>
                    {{--Input Password--}}
                    <div class="col-12 row no-gutters">
                        <label for="inputPassword" class="label text-muted required">Пароль</label>
                        <input type="password" id="inputPassword" class="form-control"
                               name="password"
                               value="{{ old('password') }}">
                        {{--If incorrect password--}}
                        @if($errors->has('password'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('password') }}
                            </div>
                        @endif
                    </div>
                    {{--Submit--}}
                    <div class="col-12 row no-gutters align-items-center justify-content-center mt-3">
                        <button type="submit" class="btn btn-success btn-block btn-rounded">Войти</button>
                    </div>
                </div>
                {{--Link to Register--}}
                <div class="col-12 row no-gutters justify-content-center align-items-center">
                    <a href="{{ route("showReg") }}" class="btn btn-primary btn-sm btn-rounded">Зарегистрироваться</a>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('script')
    <script src="/js/login-valid.js"></script>
@endsection