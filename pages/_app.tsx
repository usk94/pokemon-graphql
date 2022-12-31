import "../styles/globals.css"
import "../styles/PaginationContainer.scss"
import type { AppProps } from "next/app"
import { Provider } from "urql"
import { client } from "../src/gql/urql"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  )
}
