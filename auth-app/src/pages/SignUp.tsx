import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AxiosInstance from "../helper/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { RoutesHelper } from "../helper/Routes";
import signUpSchema from "../schema/signUpSchema";
import Cookies from "js-cookie";

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await AxiosInstance.post("/auth/signup", data);
      Cookies.set("token", response.data.access_token);

      navigate(RoutesHelper.app.path)
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              {...register("name")}
              id="name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
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
            Sign Up
          </button>
        </form>
        <p className="text-sm py-2 font-medium text-gray-700">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-500 hover:text-blue-700"
            aria-label="Signin"
          >
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
