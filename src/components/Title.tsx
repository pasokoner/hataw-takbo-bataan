type Props = {
  value: string;
};

const Title = ({ value }: Props) => {
  return (
    <h2
      className="
      mb-4 w-full rounded-md bg-primary py-4 text-center text-3xl font-semibold text-white sm:text-4xl"
    >
      {value}
    </h2>
  );
};

export default Title;
