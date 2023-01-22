import React from "react";
import Title from "../../components/Title";
import { signIn, getSession, signOut } from "next-auth/react";
import type { GetServerSideProps } from "next";

const Login = () => {
  return (
    <div className="pt-6">
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
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session && session.user?.role !== "ADMIN") {
    /* eslint-disable @typescript-eslint/no-floating-promises */
    signOut();
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  if (session && session.user?.role === "ADMIN") {
    return {
      redirect: {
        destination: "/event",
        permanent: true,
      },
    };
  }

  return {
    props: { session },
  };
};
