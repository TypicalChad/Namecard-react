import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [showPassword, setShowPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const passwordRules = {
        length: (p) => p.length >= 8,
        lowercase: (p) => /[a-z]/.test(p),
        uppercase: (p) => /[A-Z]/.test(p),
        number: (p) => /\d/.test(p),
        symbol: (p) => /[@$!%*#?&]/.test(p),
    };

    const getStrength = (password) => {
        let score = 0;
        Object.values(passwordRules).forEach((rule) => {
            if (rule(password)) score++;
        });
        return score;
    };

    const passwordsMatch =
        data.password_confirmation.length > 0 &&
        data.password === data.password_confirmation;

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <div className="relative">
                        <div className="relative mt-1">
                            <TextInput
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                type={showPassword ? "text" : "password"}
                                className="mt-1 block w-full pr-12"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className={`absolute inset-y-0 right-0 flex items-center px-9
                                    transition-all duration-200 ease-in-out
                                    ${
                                        data.password
                                            ? "opacity-100 pointer-events-auto"
                                            : "opacity-0 pointer-events-none"
                                    }
                                `}
                            >
                                <EyeClosed
                                    className={`w-5 h-5 absolute transition-all duration-200 ease-in-out
                                    ${
                                        showPassword
                                            ? "opacity-0 scale-75"
                                            : "opacity-100 scale-100"
                                    }
                                    `}
                                />

                                <Eye
                                    className={`w-5 h-5 absolute transition-all duration-200 ease-in-out
                                    ${
                                        showPassword
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-75"
                                    }
                                    `}
                                />
                            </button>
                        </div>
                        {data.password && (
                            <div className="mt-2">
                                <div className="h-2 w-full bg-gray-200 rounded">
                                    <div
                                        className={`h-2 rounded transition-all duration-300 ${
                                            getStrength(data.password) <= 2
                                                ? "bg-red-500 w-1/4"
                                                : getStrength(data.password) <=
                                                  4
                                                ? "bg-yellow-500 w-3/4"
                                                : "bg-green-500 w-full"
                                        }`}
                                    />
                                </div>

                                <p className="mt-1 text-xs text-gray-600">
                                    Strength:{" "}
                                    {getStrength(data.password) <= 2
                                        ? "Weak"
                                        : getStrength(data.password) <= 4
                                        ? "Medium"
                                        : "Strong"}
                                </p>
                            </div>
                        )}

                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                data.password
                                    ? "max-h-88 opacity-100 translate-y-0"
                                    : "max-h-0 opacity-0 -translate-y-2"
                            }`}
                        >
                            <ul className="mt-3 space-y-1 text-sm">
                                {Object.entries(passwordRules).map(
                                    ([key, rule]) => {
                                        const passed = rule(data.password);
                                        return (
                                            <li
                                                key={key}
                                                className={`flex items-center gap-2 ${
                                                    passed
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                <span>
                                                    {passed ? "✓" : "✕"}
                                                </span>
                                                {key === "length" &&
                                                    "At least 8 characters"}
                                                {key === "lowercase" &&
                                                    "One lowercase letter"}
                                                {key === "uppercase" &&
                                                    "One uppercase letter"}
                                                {key === "number" &&
                                                    "One number"}
                                                {key === "symbol" &&
                                                    "One special character"}
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            type="password"
                            className={`mt-1 block w-full pr-10 ${
                                data.password_confirmation &&
                                (passwordsMatch
                                    ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                                    : "border-red-500 focus:border-red-500 focus:ring-red-500")
                            }`}
                            autoComplete="new-password"
                        />

                        {data.password_confirmation && (
                            <span
                                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                                    passwordsMatch
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {passwordsMatch ? "✓" : "✕"}
                            </span>
                        )}
                    </div>

                    {data.password_confirmation && !passwordsMatch && (
                        <p className="mt-1 text-xs text-red-600">
                            Passwords do not match
                        </p>
                    )}

                    {data.password_confirmation && passwordsMatch && (
                        <p className="mt-1 text-xs text-green-600">
                            Passwords match
                        </p>
                    )}

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={
                            processing ||
                            !passwordsMatch ||
                            getStrength(data.password) < 5
                        }
                    >
                        <PrimaryButton disabled={processing}>
                            Save
                        </PrimaryButton>
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Password Updated
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
