import loginImg from "../../assets/login.jpg"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginValidation} from "../../utils/validation.js";
import {useLoginMutation} from "../../service/authService.js";
import {useEffect, useState} from "react";
import useLocalStorage from "../../hook/useLocalStorage.jsx";
import {useNavigate} from "react-router-dom";

function Login() {
    const {register, handleSubmit, formState:{
        errors,
        isValid
    }} = useForm({
        resolver: yupResolver(loginValidation),
    });

    const [login, {data, isSuccess, isError, error: loginError }] = useLoginMutation();
    const [messLogin, setMessLogin] = useState("")
    const [_, setToken] = useLocalStorage("token");
    const navigate = useNavigate();
    useEffect(() => {
        setToken({jwt: data});
        if(isSuccess){
            navigate("/");
        }else {
            setMessLogin(loginError?.data?.message);
        }
    },[isSuccess, isError])

    const handleOnSubmit = async (data) => {
        console.log(data);
        if(isValid){
            await login(data);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">

            <div style={{maxWidth: "41rem"}} className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col md:max-w-xl md:flex-row w-full md:max-w-[1024px] [&amp;>img]:hidden md:[&amp;>img]:w-96 md:[&amp;>img]:p-0 md:[&amp;>*]:w-full md:[&amp;>*]:p-16 lg:[&amp;>img]:block"
                data-testid="flowbite-card">
                <img alt="" className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                src={loginImg}/>
                <div className="flex h-full w-full flex-col justify-center gap-4 p-6">
                    <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">Sign in to platform</h1>
                    <form onSubmit={handleSubmit(handleOnSubmit)}>

                        <div className="mb-4 flex flex-col gap-y-3"><label
                            className="text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="email">Your
                            username</label>
                            <div className="flex">
                                <div className="relative w-full">
                                    <input {...register("username")}
                                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                    id="username"  placeholder="Username" type="text"/>
                                </div>
                            </div>
                            <span className="text-red-500">{errors?.username?.message}</span>
                        </div>
                        <div className="mb-6 flex flex-col gap-y-3"><label
                            className="text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="password">Your
                            password</label>
                            <div className="flex">
                                <div className="relative w-full">
                                    <input {...register("password")}
                                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                    id="password"  placeholder="••••••••" type="password"/>
                                </div>
                            </div>
                            <span className="text-red-500">{errors?.password?.message}</span>
                        </div>
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-x-3">
                                <span className="text-red-500">{messLogin}</span>
                            </div>
                            <a href="#" className="w-1/3 text-right text-sm text-primary-600 dark:text-primary-300">
                                Forgot Password?</a>
                        </div>
                        <div className="mb-6">
                            <button
                                className="text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 p-0 font-medium rounded-lg w-full lg:w-auto"
                                type="submit"><span className="flex items-center rounded-md text-sm px-3 py-2">Login to your account</span>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Not registered?&nbsp;
                            <a href="#" className="text-primary-600 dark:text-primary-300">
                                Create account
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;