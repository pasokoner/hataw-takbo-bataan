import ScreenContainer from "./ScreenContainer";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-700">
      <ScreenContainer className="flex flex-col items-center justify-center gap-2 bg-slate-700 py-10  text-slate-200 sm:flex-row sm:justify-between ">
        <p>© Copyright {new Date().getFullYear()}. All Rights Reserved</p>
      </ScreenContainer>
    </footer>
  );
};

export default Footer;
