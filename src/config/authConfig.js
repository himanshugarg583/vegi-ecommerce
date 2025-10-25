import { Lock, Mail, User } from "lucide-react";

export const registerFormControls = [
  {
    name: "username",
    label: "Name",
    placeholder: "Enter your name",
    type: "text",
    icon: User, // ✅ store component, not JSX
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    icon: Mail,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    icon: Lock,
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    icon: Mail,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    icon: Lock,
  },
];
