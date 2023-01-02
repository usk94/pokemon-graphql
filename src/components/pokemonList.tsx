import Image from "next/image"
import { Pokemon_V2_Pokemon } from "../@types/types"
import ReactPaginate from "react-paginate"
import { useState } from "react"
import { PokemonName } from "../../pages"
import Link from "next/link"

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
        <div className="flex flex-row justify-center flex-wrap gap-10 px-28 py-10">
          {currentItems?.map((p) => {
            const url = JSON.parse(
              p.pokemon_v2_pokemonsprites[0].sprites
            ).front_default
            const name = nameJson.find(
              (j) => j.english.toLowerCase() === p.name
            )
            return (
              <Link
                href={`/${p.id}`}
                key={p.id}
                className="flex items-center justify-center"
              >
                <p>{name?.japanese}</p>
                <Image src={url} height={100} width={100} alt="pokemon" />
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

const PokemonList = ({
  itemsPerPage,
  nameJson,
  pokemons,
}: {
  itemsPerPage: number
  nameJson: PokemonName[]
  pokemons: Pokemon_V2_Pokemon[]
}) => {
  const [itemOffset, setItemOffset] = useState(0)

  if (!pokemons) return null
  const endOffset = itemOffset + itemsPerPage
  const currentItems = pokemons.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(pokemons.length / itemsPerPage)

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newOffset = (selectedItem.selected * itemsPerPage) % pokemons.length
    setItemOffset(newOffset)
  }

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
        className="mt-20"
      />
    </>
  )
}

export default PokemonList
