import QRimage from "react-qr-image";

type Props = {
  value: string;
  size?: number;
};

const QrMaker = ({ value, size }: Props) => {
  return (
    <>
      <QRimage
        text={value}
        transparent={true}
        background="white"
        color="black"
        margin={0}
        size={size}
      >
        {" "}
      </QRimage>
    </>
  );
};

export default QrMaker;
