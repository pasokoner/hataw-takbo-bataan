import React from "react";
import Title from "../../components/Title";
import { signIn, getSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import ScreenContainer from "../../layouts/ScreenContainer";

const Login = () => {
  return (
    <ScreenContainer className="mx-auto px-8 pt-6 md:px-16">
      <Title value="AUTHENTICATE ADMIN" />
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <button
          onClick={() => {
            /* eslint-disable @typescript-eslint/no-floating-promises */
            signIn("google");
          }}
          className="rounded-lg border-2 py-4 px-8"
        >
          LOGIN
        </button>
      </div>
    </ScreenContainer>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    /* eslint-disable @typescript-eslint/no-floating-promises */
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
