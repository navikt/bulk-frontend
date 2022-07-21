import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import PageHeader from "../components/PageHeader";
import { useAuthPayload } from "../lib/hooks";
import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const { name } = useAuthPayload();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PageHeader title="Bulk-uttrekk" userName={name} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
