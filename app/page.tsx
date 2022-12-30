"use client"

import { gql, useQuery } from "urql"

import Image from "next/image"
import { Query_Root } from "../src/@types/types"

const getPokemons = gql(`
  query pokemon {
    pokemon_v2_pokemon(limit:5, where:{pokemon_species_id: {_gt: 500}}) {
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`)

type PageProps = {
  params?: {
    id: string
  }
  searchParams?: {
    search?: string
  }
}

const Page = ({ pageParams }: { pageParams: PageProps }) => {
  const [result, reeexcute] = useQuery<Query_Root>({
    query: getPokemons,
  })
  const { data, fetching, error } = result
  const pokemons = data?.pokemon_v2_pokemon

  if (fetching) return <p>ロード中...</p>
  if (error) return <p>こういうエラーが発生しました: {error.message}</p>
  return (
    <>
      {pokemons?.map((p) => {
        const urlIndex = JSON.parse(p.pokemon_v2_pokemonsprites[0].sprites)
        const url = urlIndex.front_default
        return (
          <>
            <p>{p.name}</p>
            <Image src={url} height={100} width={100} alt="pokemon" />
          </>
        )
      })}
    </>
  )
}

export default Page
