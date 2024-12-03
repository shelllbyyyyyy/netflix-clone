"use client";

import React from "react";
import { useFetchUserQuery } from "../hook/useFetchUserQuery";

const FetchUser = () => {
  const { data: user, isPending } = useFetchUserQuery({});

  return (
    <div>
      {isPending && <h1>Loading...</h1>}
      <h1 className="text-white">{user?.data.data[0]?.id}</h1>
    </div>
  );
};

export default FetchUser;
