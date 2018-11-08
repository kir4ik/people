<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Entities\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $user_info = User::join('profiles', function($join) {
            $join->on('profiles.user_id', '=', 'users.id')
                ->where(['users.id' => Auth::user()->id]);
        })->select(
            'users.email', 'users.created_at',
            'profiles.*'
        )->first();

        if($user_info->date_birth !== null) {
            $date_birth = date('d.m.Y', strtotime($user_info->date_birth));
            unset($user_info->date_birth);
            $user_info->date_birth = $date_birth;
        }

        if($user_info->country_code !== null) {
            $country = \DB::table('country')->select('Name')->where([
                'Code' => $user_info->country_code
            ])->first();

            $user_info->user_country = $country->Name;
        }


        return view('profiles.profile')->with(compact('user_info'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy()
    {
//        \Session::flush();

        Auth::logout();

        return back();
    }
}
