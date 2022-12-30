import { createClient } from "urql"

export const client = createClient({
  url: "https://beta.pokeapi.co/graphql/v1beta",
})
