import React from "react";

import Container from "@/components/layout/container";
import Wrapper from "@/components/layout/wrapper";
import Login from "@/components/features/auth/component/login";

const LoginPage = () => {
  return (
    <Container className="pt-0 h-screen">
      <Wrapper
        section="login"
        className="flex h-screen w-full justify-center items-center"
      >
        <Login />
      </Wrapper>
    </Container>
  );
};

export default LoginPage;
