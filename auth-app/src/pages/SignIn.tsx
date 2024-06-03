import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import signInSchema from "../schema/signInSchema";
import AxiosInstance from "../helper/AxiosInstance";
import { RoutesHelper } from "../helper/Routes";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await AxiosInstance.post("/auth/signin", data);
      Cookies.set("token", response.data.access_token);
      navigate(RoutesHelper.app.path);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm py-2 font-medium text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-700"
            aria-label="Signup"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
