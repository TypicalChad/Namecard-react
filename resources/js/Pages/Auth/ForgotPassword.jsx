import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 py-12"
            style={{ backgroundColor: "#eae8dd" }}
        >
            <Head title="Forgot Password" />

            <div className="w-full max-w-md mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                        Reset Password
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm text-green-800">{status}</p>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full"
                            isFocused={true}
                            placeholder="Enter your email"
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <PrimaryButton
                        onClick={submit}
                        className="w-full justify-center py-3"
                        disabled={processing}
                    >
                        {processing ? "Sending..." : "Send Reset Link"}
                    </PrimaryButton>
                </div>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <a
                        href={route("login")}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}
