import React, { useState } from "react";
import Input from "../components/inputField.tsx"; 
import Button from "../components/button";

const CreateAccount: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email.";
    if (formData.username.trim().length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      console.log("Account created:", formData);
      //TODO: Add API Call for user registration
      setLoading(false);
      alert("Account successfully created!");
    }, 1000);
  };

  return (
    <main className="create-account-container">
      <h1>Create Account</h1>
      <p className="create-account-subtitle">
        Please fill in the details below to create your account.
      </p>

      <form onSubmit={handleSubmit} className="create-account-form">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
        />

        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Choose a username"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Create Account
        </Button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => (window.location.href = "/login")}
        >
          Back to Login
        </Button>
      </div>
    </main>
  );
};

export default CreateAccount;
