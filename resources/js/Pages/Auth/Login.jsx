import { useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Background Image */}
            <div className="hidden lg:block lg:w-3/5 relative">
                <img
                    src="/images/img.jpeg"
                    alt="Background"
                    className="w-full h-full object-cover brightness-125"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-12 left-12 text-white z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="/images/logo-removebg-preview-white.png"
                            alt="CBM Logo"
                            className="w-16 h-16 object-contain"
                        />
                        <h1 className="text-3xl font-bold uppercase tracking-wider relative top-0.5">
                            Digital Name Card
                        </h1>
                    </div>
                    <p className="text-lg opacity-90">CBM Pte Ltd</p>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div
                className="w-full lg:w-2/5 flex items-center justify-center px-6 py-12"
                style={{ backgroundColor: "#fffdf2" }}
            >
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <img
                            src="/images/logo-removebg-preview-white.png"
                            alt="CBII Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <h1 className="text-xl font-bold uppercase tracking-wider text-gray-800">
                            Digital Name Card
                        </h1>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <InputLabel htmlFor="email" value="E-mail" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full px-4 py-3"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full px-4 py-3"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            type="submit"
                            className="w-full py-3 text-base mt-6"
                            disabled={processing}
                        >
                            {processing ? "Logging in..." : "LOGIN"}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
