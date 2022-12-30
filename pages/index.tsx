import { gql, useQuery } from "urql"

import Image from "next/image"
import { Query_Root } from "../src/@types/types"

const getPokemons = gql(`
  query pokemon {
    pokemon_v2_pokemon(limit:5, where:{pokemon_species_id: {_gt: 500}}) {
      name
      id
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`)

const Component = () => {
  const [result, reeexcute] = useQuery<Query_Root>({
    query: getPokemons,
  })
  const { data, fetching, error } = result
  const pokemons = data?.pokemon_v2_pokemon

  if (fetching) return <p>ロード中...</p>
  if (error) return <p>こういうエラーが発生しました: {error.message}</p>
  const ListItems = (
    <>
      {pokemons?.map((p) => {
        const url = JSON.parse(
          p.pokemon_v2_pokemonsprites[0].sprites
        ).front_default
        return (
          <li key={p.id}>
            <p>{p.name}</p>
            <Image src={url} height={100} width={100} alt="pokemon" />
          </li>
        )
      })}
    </>
  )
  return <ul>{ListItems}</ul>
}

export default Component
