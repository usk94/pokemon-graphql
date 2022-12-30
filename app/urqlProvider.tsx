"use client"

import "../styles/globals.css"
import { Provider } from "urql"
import { client } from "../src/gql/urql"

const UrqlProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider value={client}>{children}</Provider>
}

export default UrqlProvider
