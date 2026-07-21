import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import api from "./utils/axios";
import { addUser } from "./utils/userSlice";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const extractErrorMessage = (err) => {
  const data = err.response?.data;
  if (typeof data === "string") {
    return data.replace(/^authentication Error:\s*/i, "");
  }
  return "Something went wrong. Please try again.";
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const errors = { email: "", password: "" };

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    setError("");
    if (!validate()) return;

    try {
      const res = await api.post("/login", { email, password });
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card card-border bg-base-50 w-96 justify-center items-center">
        <div className="card-body">
          <h2 className="card-title justify-center">login</h2>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              className={`input ${fieldErrors.email ? "input-error" : ""}`}
              placeholder="Type here"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {fieldErrors.email && (
              <p className="text-error text-sm mt-1">{fieldErrors.email}</p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className={`input ${fieldErrors.password ? "input-error" : ""}`}
              placeholder="Type here"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {fieldErrors.password && (
              <p className="text-error text-sm mt-1">{fieldErrors.password}</p>
            )}
          </fieldset>
          {error && <p className="text-error text-sm mt-2">{error}</p>}
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
