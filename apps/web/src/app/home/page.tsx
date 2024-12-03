import React from "react";

import Container from "@/components/layout/container";
import Wrapper from "@/components/layout/wrapper";
import FetchUser from "@/components/features/user/component/fetch-user";

const Home = async () => {
  return (
    <Container>
      <Wrapper section="home">
        <FetchUser />
      </Wrapper>
    </Container>
  );
};

export default Home;
