import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "./utils/axios";
import { addUser } from "./utils/userSlice";

const GENDER_OPTIONS = ["male", "female", "other"];
const URL_REGEX = /^https?:\/\/.+/i;

const extractErrorMessage = (err) => {
  const data = err.response?.data;
  if (typeof data === "string") {
    return data.replace(/^ERROR\s*:\s*/i, "");
  }
  return "Something went wrong. Please try again.";
};

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age ?? "",
    gender: user?.gender || "",
    about: user?.about || "",
    photoUrl: user?.photoUrl || "",
    skills: user?.skills?.join(", ") || "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccess("");
  };

  const validate = () => {
    const errors = {};

    if (formData.firstName.trim().length < 3) {
      errors.firstName = "First name must be at least 3 characters";
    }
    if (formData.lastName.trim() && formData.lastName.trim().length < 3) {
      errors.lastName = "Last name must be at least 3 characters";
    }
    if (
      formData.age !== "" &&
      (!Number.isInteger(Number(formData.age)) || Number(formData.age) < 18)
    ) {
      errors.age = "Age must be a whole number of at least 18";
    }
    if (formData.about.trim() && formData.about.trim().length < 10) {
      errors.about = "About must be at least 10 characters";
    }
    if (formData.photoUrl.trim() && !URL_REGEX.test(formData.photoUrl.trim())) {
      errors.photoUrl = "Please enter a valid URL";
    }
    const skillsList = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillsList.length > 10) {
      errors.skills = "You can list at most 10 skills";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!validate()) return;

    const payload = { firstName: formData.firstName.trim() };
    if (formData.lastName.trim()) payload.lastName = formData.lastName.trim();
    if (formData.age !== "") payload.age = Number(formData.age);
    if (formData.gender) payload.gender = formData.gender;
    if (formData.photoUrl.trim()) payload.photoUrl = formData.photoUrl.trim();
    if (formData.about.trim()) payload.about = formData.about.trim();
    payload.skills = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await api.patch("/profile/edit", payload);
      dispatch(addUser(res.data));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card card-border bg-base-50 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Edit Profile</h2>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">First Name</legend>
            <input
              className={`input w-full ${fieldErrors.firstName ? "input-error" : ""}`}
              value={formData.firstName}
              onChange={handleChange("firstName")}
            />
            {fieldErrors.firstName && (
              <p className="text-error text-sm mt-1">{fieldErrors.firstName}</p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last Name</legend>
            <input
              className={`input w-full ${fieldErrors.lastName ? "input-error" : ""}`}
              value={formData.lastName}
              onChange={handleChange("lastName")}
            />
            {fieldErrors.lastName && (
              <p className="text-error text-sm mt-1">{fieldErrors.lastName}</p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Age</legend>
            <input
              type="number"
              className={`input w-full ${fieldErrors.age ? "input-error" : ""}`}
              value={formData.age}
              onChange={handleChange("age")}
            />
            {fieldErrors.age && (
              <p className="text-error text-sm mt-1">{fieldErrors.age}</p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <select
              className="select w-full"
              value={formData.gender}
              onChange={handleChange("gender")}
            >
              <option value="">Prefer not to say</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Photo URL</legend>
            <input
              className={`input w-full ${fieldErrors.photoUrl ? "input-error" : ""}`}
              value={formData.photoUrl}
              onChange={handleChange("photoUrl")}
            />
            {fieldErrors.photoUrl && (
              <p className="text-error text-sm mt-1">{fieldErrors.photoUrl}</p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Skills (comma separated)</legend>
            <input
              className={`input w-full ${fieldErrors.skills ? "input-error" : ""}`}
              value={formData.skills}
              onChange={handleChange("skills")}
            />
            {fieldErrors.skills && (
              <p className="text-error text-sm mt-1">{fieldErrors.skills}</p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">About</legend>
            <textarea
              className={`textarea w-full ${fieldErrors.about ? "textarea-error" : ""}`}
              value={formData.about}
              onChange={handleChange("about")}
            />
            {fieldErrors.about && (
              <p className="text-error text-sm mt-1">{fieldErrors.about}</p>
            )}
          </fieldset>

          {error && <p className="text-error text-sm mt-2">{error}</p>}
          {success && <p className="text-success text-sm mt-2">{success}</p>}

          <div className="card-actions justify-center mt-2">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
