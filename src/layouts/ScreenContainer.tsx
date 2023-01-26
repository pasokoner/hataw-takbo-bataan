import React from "react";

type Props<E extends React.ElementType> = {
  children?: React.ReactNode;
  as?: E;
};

type OwnProps<E extends React.ElementType> = Props<E> &
  Omit<React.ComponentProps<E>, keyof Props<E>>;

const ScreenContainer = <E extends React.ElementType = "div">({
  as,
  children,
  className,
}: OwnProps<E>) => {
  const Component = as || "div";

  return (
    //eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    <Component className={`${className} max-w-screen-2xl px-8 md:px-16`}>
      {children}
    </Component>
  );
};

export default ScreenContainer;
