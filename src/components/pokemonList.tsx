import Image from "next/image"
import { Pokemon_V2_Pokemon } from "../@types/types"
import ReactPaginate from "react-paginate"
import { useState } from "react"
import { PokemonName, PokemonType } from "../../pages"
import Link from "next/link"

const bgColorCode = (pokemonType: string) => {
  if (pokemonType === "grass") {
    return "#78C850"
  } else if (pokemonType === "dark") {
    return "#705848"
  } else if (pokemonType === "rock") {
    return "#B8A038"
  } else if (pokemonType === "psychic") {
    return "#F85888"
  } else if (pokemonType === "fighting") {
    return "#C03028"
  } else if (pokemonType === "ghost") {
    return "#705898"
  } else if (pokemonType === "ice") {
    return "#98D8D8"
  } else if (pokemonType === "ground") {
    return "#E0C068"
  } else if (pokemonType === "electric") {
    return "#F8D030"
  } else if (pokemonType === "poison") {
    return "#A040A0"
  } else if (pokemonType === "dragon") {
    return "#7038F8"
  } else if (pokemonType === "normal") {
    return "#A8A878"
  } else if (pokemonType === "steel") {
    return "#B8B8D0"
  } else if (pokemonType === "flying") {
    return "#A890F0"
  } else if (pokemonType === "fairy") {
    return "#EE99AC"
  } else if (pokemonType === "fire") {
    return "#F08030"
  } else if (pokemonType === "water") {
    return "#6890F0"
  } else {
    return "#A8B820"
  }
}

const Pokemons = ({
  currentItems,
  nameJson,
}: {
  currentItems: Pokemon_V2_Pokemon[]
  nameJson: PokemonName[]
}) => {
  return (
    <>
      {currentItems && (
        <div className="flex flex-row justify-center flex-wrap gap-8 px-28 py-10">
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
                className="flex items-center justify-center rounded-2xl pl-4 pr-2 py-2 gap-4"
                style={{
                  backgroundColor: p.pokemon_v2_pokemontypes[0].pokemon_v2_type
                    ?.name
                    ? bgColorCode(
                        p.pokemon_v2_pokemontypes[0].pokemon_v2_type?.name
                      )
                    : "white",
                }}
              >
                <p className="text-center">{name?.japanese}</p>
                <Image
                  src={url}
                  height={100}
                  width={100}
                  alt={name?.japanese ? name.japanese : "pokemon"}
                  className="bg-white rounded-lg"
                />
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
      <Pokemons currentItems={currentItems} nameJson={nameJson} />
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
