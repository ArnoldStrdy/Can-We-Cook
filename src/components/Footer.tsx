import Logo from "@/assets/logoNameIcon.png";

const Footer = () => {
  return (
    <>
      <footer className="relative bg-[#A7ACD9]/40 pb-3 pt-3 lg:pb-12 lg:pt-4 w-full items-center justify-center flex flex-col">
        <img src={Logo} alt="logo" className="max-w-[200px]" />
        <p className="mb-1 text-base font-semibold">
          A restaurant review platform.
        </p>
        <p className="mb-7 text-base font-extrabold">
          For Monash by Monash students.
        </p>
        <p className="text-base font-semibold text-[#FF6F00]">
          &copy; 2025 Can we Cook? All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
