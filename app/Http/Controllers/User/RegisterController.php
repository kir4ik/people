<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Entities\User;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return view('forms.register');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, [
            'accept' => 'accepted',
            'first_name' => 'required|string|alpha|max:30',
            'last_name' => 'required|string|alpha|max:30',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|alpha_dash|min:6|confirmed',
            'gender' => 'required',
            'date_birth' => 'required|date',
            'about_user' => 'nullable|string|max:500',
            'country_code' => 'required|exists:country,Code',
        ]);

        $user = User::create([
            'email' => $request['email'],
            'password' => bcrypt($request['password'])
        ]);

        DB::table('profiles')->insert([
            'user_id' => $user->id,
            'first_name' => $request['first_name'],
            'last_name' => $request['last_name'],
            'gender' =>  $request['gender'],
            'date_birth' =>  $request['date_birth'],
            'about_user' =>  $request['about_user'],
            'country_code' =>  $request['country_code'],
        ]);


        if( \Auth::attempt(['email' => $request['email'], 'password' => $request['password']]) ) {
            return redirect()->intended(route('showProfile'));
        }

        return redirect(route('showLogin'))->with('fail', trans('messages.auth.errorLogin'));
    }
}
