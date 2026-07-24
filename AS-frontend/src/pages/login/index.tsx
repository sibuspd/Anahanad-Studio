import SignInForm from "@/components/auth/sign-in-form";
import AuthLayout from "@/components/auth/auth-layout";

const Login = () => {
    return (
        <AuthLayout>
            <SignInForm />
        </AuthLayout>
    );
};

export default Login;