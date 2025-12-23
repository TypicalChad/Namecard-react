<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Validator;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse

    {

        $validator = Validator::make($request->all(), [

            'current_password' => ['required', 'current_password'],

            'password' => ['required', Password::defaults(), 'confirmed'],

        ]);



        if ($validator->fails()) {

            return back()

                ->withErrors($validator)

                ->setStatusCode(303);
        }



        $validated = $validator->validated();



        $request->user()->update([

            'password' => Hash::make($request->password),

        ]);



        return back()->setStatusCode(303);
    }
}
