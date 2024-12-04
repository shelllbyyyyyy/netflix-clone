import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navigationbar = () => {
  return (
    <header className="hidden lg:block lg:static h-16 py-0">
      <div className="relative max-w-[1800px] flex justify-between  h-16 mx-auto items-center py-12 px-80">
        <aside>
          <Link href="/" className="cursor-pointer">
            <Image
              src={"/assets/logo-text.png"}
              alt="logo"
              width={1000}
              height={1000}
              style={{ width: "200px", height: "80px" }}
              priority
            />
          </Link>
        </aside>
      </div>
    </header>
  );
};

export default Navigationbar;
