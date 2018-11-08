<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Entities\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;

class LoginController extends Controller
{
    public function show()
    {
        return view('forms.login');
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if (Auth::attempt($request->only(['email', 'password']))) {
            return redirect(route('showProfile'));
        }

        Input::flashExcept('password');

        return view('forms.login')->with('fail', trans('messages.auth.errorLogin'));
    }
}
