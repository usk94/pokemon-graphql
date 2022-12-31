import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import { gql, useQuery } from "urql"
import { Query_Root } from "../src/@types/types"

const getPokemon = gql(`
  query getPokemon($id: Int!) {
    pokemon_v2_pokemon(where:{pokemon_species_id: {_eq: $id}}) {
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`)

const Component = ({ params }: { params: { id: number } }) => {
  const [result, reeexcute] = useQuery<Query_Root>({
    query: getPokemon,
    variables: { id: params.id },
  })
  const { data, fetching, error } = result
  if (fetching) return null
  console.log(
    "data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites!",
    data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites!
  )
  const frontUrl = JSON.parse(
    data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites!
  ).front_default
  const backUrl = JSON.parse(
    data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites!
  ).back_default
  return (
    <>
      <p>{data?.pokemon_v2_pokemon[0].name}</p>
      <Image src={frontUrl} height={100} width={100} alt="pokemon" />
      <Image src={backUrl} height={100} width={100} alt="pokemon" />
    </>
  )
}

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const params = context.params
  return { props: { params } }
}

export default Component
