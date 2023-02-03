import Footer from "./Footer";
import NavBar from "./NavBar";

type Props = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: Props) => {
  return (  
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default PageContainer;
