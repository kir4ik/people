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
            <form action="" method="post" class="col-12 needs-validation" id="register"
                  novalidate>
                {{ csrf_field() }}

                {{--Блок с содержимым формы--}}
                <div class="row no-gutters justify-content-around align-items-start px-5 py-2">
                    {{--Title--}}
                    <h1 class="col-sm-12 h3 font-weight-bold text-uppercase text-center mb-3">Форма Регистрации</h1>

                    {{--Input First name--}}
                    <div class="col-sm-12 col-md-6 col-lg-4 row no-gutters mb-3 px-md-2">
                        <label for="inputFirstName" class="label font-weight-bold required">Ваше имя</label>
                        <input type="text" id="inputFirstName" class="form-control"
                               name="first_name" placeholder="Имя"
                               value="{{ old('first_name') }}">
                        {{--If incoorect First name--}}
                        @if($errors->has('first_name'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('first_name') }}
                            </div>
                        @endif
                    </div>
                    {{--Input Last name--}}
                    <div class="col-sm-12 col-md-6 col-lg-4 row no-gutters mb-3 px-md-2">
                        <label for="inputLastName" class="label font-weight-bold required">Ваша фамилия</label>
                        <input type="text" id="inputLastName" class="form-control"
                               name="last_name" placeholder="Фамилия"
                               value="{{ old('last_name') }}">
                        {{--If incoorect Last name--}}
                        @if($errors->has('last_name'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('last_name') }}
                            </div>
                        @endif
                    </div>
                    {{--Inputs Gender--}}
                    <div class="col-sm-12 col-md-6 col-lg-4 order-lg-1 row no-gutters mb-3 px-md-2">
                        <h6 class="col-sm-12 text-left font-weight-bold mb-3 required">Выберите свой пол</h6>
                        <div class="form-check form-check-inline">
                            <input type="radio" id="male" class="form-check-input"
                                   name="gender"
                                   value="Мужской">
                            <label for="male" class="form-check-label">Мужской</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" id="female" class="form-check-input"
                                   name="gender"
                                   value="Женсккий">
                            <label for="female" class="form-check-label">Женский</label>
                        </div>
                        {{--If incoorect Gender--}}
                        @if($errors->has('gender'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('gender') }}
                            </div>
                        @endif
                    </div>
                    {{--Input Date birth--}}
                    <div class="col-sm-12 col-md-6 col-lg-4 row no-gutters mb-3 px-md-2">
                        <label for="inputDateBirth" class="label font-weight-bold required">Ваша дата рождения</label>
                        <input type="date" id="inputDateBirth" class="form-control"
                               name="date_birth"
                               value="{{ old('date_birth') }}">
                        {{--If incoorect Last name--}}
                        @if($errors->has('date_birth'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('date_birth') }}
                            </div>
                        @endif
                    </div>
                    {{--Input email--}}
                    <div class="col-sm-12 col-md-6 col-lg-5 row no-gutters mb-3 px-md-2">
                        <label for="inputEmail" class="label font-weight-bold required">Ваш email</label>
                        <input type="email" id="inputEmail" class="form-control"
                               name="email" placeholder="email"
                               value="{{ old('email') }}">
                        {{--If incoorect email--}}
                        @if($errors->has('email'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('email') }}
                            </div>
                        @endif
                    </div>
                    {{--Inputs Country--}}
                    <div class="col-sm-12 col-md-6 col-lg-4 order-lg-2 row no-gutters mb-3 px-md-2">
                        <label for="inputCountryCode" class="label font-weight-bold required">Ваша страна</label>
                        <select id="inputCountryCode" class="custom-select"
                                name="country_code"
                                value="{{ old('country_code') }}">
                            <option value="">--Выбать--</option>
                            @foreach(DB::table('country')->select('Code', 'Name')->orderBy('Name')->get() as $country)
                                <option value="{{ $country->Code }}">{{ $country->Name }}</option>
                            @endforeach
                        </select>
                        {{--If incoorect country--}}
                        @if($errors->has('country_code'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('country_code') }}
                            </div>
                        @endif
                    </div>
                    {{--Input password--}}
                    <div class="col-sm-12 col-md-6 col-lg-5 mr-lg-auto order-lg-1 row no-gutters mb-3 px-md-2">
                        <label for="inputPassword" class="label font-weight-bold required">Ваш пароль</label>
                        <input type="password" id="inputPassword" class="form-control"
                               name="password">
                        {{--If incoorect password--}}
                        @if($errors->has('password'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('password') }}
                            </div>
                        @endif
                    </div>
                    {{--Input password confirmation--}}
                    <div class="col-sm-12 col-md-6 col-lg-5 mr-lg-auto order-lg-2 row no-gutters mb-3 px-md-2">
                        <label for="inputPasswordConfirmation" class="label font-weight-bold required">Подтвердите Ваш
                            пароль</label>
                        <input type="password" id="inputPasswordConfirmation" class="form-control"
                               name="password_confirmation">
                        {{--If incoorect password confirmation--}}
                        @if($errors->has('password_confirmation'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('password_confirmation') }}
                            </div>
                        @endif
                    </div>
                    {{--Input About User--}}
                    <div class="col-sm-12 order-lg-2 row no-gutters mb-3">
                        <label for="inputAboutUser" class="label font-weight-bold">Немного о себе</label>
                        <textarea id="inputAboutUser" class="form-control" rows="4" style="resize: none"
                                  name="about_user" placeholder="О себе ..."
                                  value="{{ old('about_user') }}"></textarea>
                        {{--If incoorect About User--}}
                        @if($errors->has('about_user'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('about_user') }}
                            </div>
                        @endif
                    </div>

                    <hr class="mb-4">

                    {{--Input Accept--}}
                    <div class="col-sm-12 row no-gutters mb-3 px-4 order-last">
                        <input type="checkbox" id="inputAccept" class="form-check-input"
                               name="accept" checked>
                        <label for="inputAccept" class="form-check-label text-muted required-left">Я даю согласие на обработку
                            персональных данных</label>
                        {{--If incoorect password--}}
                        @if($errors->has('accept'))
                            <div class="invalid-feedback d-block">
                                {{ $errors->first('accept') }}
                            </div>
                        @endif
                    </div>
                    {{--Submit--}}
                    <div class="col-sm-12 row no-gutters align-items-left justify-content-center my-3 order-last">
                        <button type="submit" class="col-md-4 btn btn-success btn-block btn-rounded">Зарегистрироваться</button>
                    </div>

                    <div class="col-sm-12 row now-gutters justify-content-center align-items-center order-last">
                        <a href="{{ route('showLogin') }}" class="col-md-4 btn btn-primary btn-sm btn-rounded">Войти</a>
                    </div>
                </div>
            </form>
        </div>
    </div>

@stop

@section('script')
    <script src="/js/register-valid.js"></script>
@endsection