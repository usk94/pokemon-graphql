import { gql, useQuery } from "urql"

import Image from "next/image"
import { Pokemon_V2_Pokemon, Query_Root } from "../@types/types"
import ReactPaginate from "react-paginate"
import { useState } from "react"
import { PokemonName } from "../../pages"

const getPokemons = gql(`
  query pokemon {
    pokemon_v2_pokemon(limit:30, where:{pokemon_species_id: {_gt: 500}}) {
      name
      id
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`)

const Items = ({
  currentItems,
  nameJson,
}: {
  currentItems: Pokemon_V2_Pokemon[]
  nameJson: PokemonName[]
}) => {
  return (
    <>
      {currentItems && (
        <div className="flex flex-row flex-wrap gap-10 px-28 py-10">
          {currentItems?.map((p) => {
            const url = JSON.parse(
              p.pokemon_v2_pokemonsprites[0].sprites
            ).front_default
            const name = nameJson.find(
              (j) => j.english.toLowerCase() === p.name
            )
            return (
              <div key={p.id} className="flex items-center justify-center">
                <p>{name?.japanese}</p>
                <Image src={url} height={100} width={100} alt="pokemon" />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

const PokemonPagination = ({
  itemsPerPage,
  nameJson,
}: {
  itemsPerPage: number
  nameJson: PokemonName[]
}) => {
  const [result, reeexcute] = useQuery<Query_Root>({
    query: getPokemons,
  })
  const { data, fetching, error } = result
  const [itemOffset, setItemOffset] = useState(0)
  const pokemons = data?.pokemon_v2_pokemon

  if (!pokemons) return null
  const endOffset = itemOffset + itemsPerPage
  console.log(`Loading items from ${itemOffset} to ${endOffset}`)
  const currentItems = pokemons.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(pokemons.length / itemsPerPage)

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newOffset = (selectedItem.selected * itemsPerPage) % pokemons.length
    console.log(
      `User requested page number ${selectedItem.selected}, which is offset ${newOffset}`
    )
    setItemOffset(newOffset)
  }

  if (fetching) return <p>ロード中...</p>
  if (error) return <p>こういうエラーが発生しました: {error.message}</p>
  return (
    <>
      <Items currentItems={currentItems} nameJson={nameJson} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
      />
    </>
  )
}

export default PokemonPagination
