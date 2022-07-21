import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import PageHeader from "../components/PageHeader";
import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PageHeader title="Bulk-uttrekk" />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
