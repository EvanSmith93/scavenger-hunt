import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  return (
    <GoogleLogin
      onSuccess={(response) => {
        const credentials = jwtDecode(response.credential);
        console.log(credentials);
      }}
      onFailure={(response) => {
        console.log(response);
      }}
    />
  );
}
