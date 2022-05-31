import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import {QueryClientProvider, Hydrate, QueryClient} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {MantineProvider} from '@mantine/core';
import {ModalsProvider} from "@mantine/modals";
import {NotificationsProvider} from '@mantine/notifications'
import Script from 'next/script';
import Head from "next/head";
import { store } from "../features/store";
import Layout from '../components/global/Layout';
import "../styles/globals.css";

export const qt = new QueryClient({
    defaultOptions:{
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            cacheTime: Infinity
        }
    }
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
      <>
          <Head>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                    crossOrigin="anonymous"
              />
              <link rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                    integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
              />
          </Head>
          <MantineProvider>
              <ModalsProvider>
                  <NotificationsProvider position='top-right' autoClose={2000} limit={1} zIndex={2088}>
                      <Provider store={store}>
                          <QueryClientProvider client={qt}>
                              <Layout>
                                  <Hydrate state={pageProps.dehydratedState}>
                                     <Component {...pageProps} />
                                  </Hydrate>
                              </Layout>
                              <ReactQueryDevtools initialIsOpen={true}/>
                          </QueryClientProvider>
                      </Provider>
                  </NotificationsProvider>
              </ModalsProvider>
          </MantineProvider>
          <Script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossOrigin='anonymous'/>
          <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossOrigin="anonymous"/>
      </>
  )
}
export default MyApp
