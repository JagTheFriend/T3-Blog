import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { ClerkProvider } from "@clerk/nextjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Toaster position="bottom-center" />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
