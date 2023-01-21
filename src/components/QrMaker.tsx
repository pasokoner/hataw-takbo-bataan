import QRimage from "react-qr-image";

type Props = {
  value: string;
  size: number;
};

const QrMaker = ({ value, size }: Props) => {
  return (
    <>
      {/* <QRCode
        size={256}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
          backgroundColor: "#000000",
          color: "#FFF",
        }}
        value={value}
        viewBox={`0 0 256 256`}
      /> */}

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
