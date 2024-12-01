import React from "react";

import Container from "@/components/layout/container";
import Wrapper from "@/components/layout/wrapper";
import Register from "@/components/features/auth/component/register";

const RegisterPage = () => {
  return (
    <Container className="pt-0 h-screen">
      <Wrapper
        section="register"
        className="flex h-screen w-full justify-center items-center"
      >
        <Register />
      </Wrapper>
    </Container>
  );
};

export default RegisterPage;
