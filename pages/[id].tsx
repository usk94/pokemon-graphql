import csv from "csvtojson"
import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import { gql, useQuery } from "urql"
import { allPokemonTypes, PokemonName } from "."
import { Query_Root } from "../src/@types/types"

type PokemonTrait = {
  japanese: string
  english: string
}

const getPokemon = gql(`
  query getPokemon($id: Int!) {
    pokemon_v2_pokemon(where:{pokemon_species_id: {_eq: $id}}) {
      name
      height
      weight
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
    }
  }
`)

const Component = ({
  params,
  nameJson,
  traitJson,
}: {
  params: { id: number }
  nameJson: PokemonName[]
  traitJson: PokemonTrait[]
}) => {
  const [result, reeexcute] = useQuery<Query_Root>({
    query: getPokemon,
    variables: { id: params.id },
  })
  const { data, fetching, error } = result
  if (fetching) return null
  const frontUrl = JSON.parse(
    data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites!
  ).front_default
  const backUrl = JSON.parse(
    data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonsprites[0].sprites!
  ).back_default
  const name = nameJson.find(
    (n) => n.english.toLowerCase() === data?.pokemon_v2_pokemon[0].name
  )
  const traits = [
    traitJson.find(
      (t) =>
        t.english.toLowerCase().replace(/\s+/g, "") ===
        data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonabilities[0].pokemon_v2_ability?.name
          .toLowerCase()
          .replace(/-/g, "")
    ),
    traitJson.find(
      (t) =>
        t.english.toLowerCase().replace(/\s+/g, "") ===
        data?.pokemon_v2_pokemon[0].pokemon_v2_pokemonabilities[1].pokemon_v2_ability?.name
          .toLowerCase()
          .replace(/-/g, "")
    ),
  ]
  let types = []
  data?.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes[0].pokemon_v2_type
    ?.name &&
    types.push(
      allPokemonTypes[
        data?.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes[0].pokemon_v2_type
          ?.name as keyof typeof allPokemonTypes
      ]
    )
  data?.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes[1].pokemon_v2_type
    ?.name &&
    types.push(
      allPokemonTypes[
        data?.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes[1].pokemon_v2_type
          ?.name as keyof typeof allPokemonTypes
      ]
    )

  if (error) return <p>こういうエラーが発生しました: {error.message}</p>
  return (
    <div>
      <div className="flex flex-row justify-center gap-6 mt-8">
        {frontUrl && (
          <Image
            src={frontUrl}
            height={200}
            width={200}
            alt={name ? `${name} front image` : "pokemon"}
          />
        )}
        {backUrl && (
          <Image
            src={backUrl}
            height={200}
            width={200}
            alt={name ? `${name} back image` : "pokemon"}
          />
        )}
      </div>
      {name?.japanese && (
        <p className="text-center font-bold text-xl mt-6">{name.japanese}</p>
      )}
      {types.length > 0 && (
        <p className="text-xl mt-6 text-center">
          タイプ: {types[0]}, {types[1]}
        </p>
      )}
      <div className="flex justify-center gap-6">
        {data?.pokemon_v2_pokemon[0].height && (
          <p className="text-xl mt-6">
            高さ: {data?.pokemon_v2_pokemon[0].height}m
          </p>
        )}
        {data?.pokemon_v2_pokemon[0].weight && (
          <p className="text-xl mt-6">
            重さ: {data?.pokemon_v2_pokemon[0].weight}kg
          </p>
        )}
      </div>
      {traits.length > 0 && (
        <p className="text-xl mt-6 text-center">
          特性: {traits[0]?.japanese}, {traits[1]?.japanese}
        </p>
      )}
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const params = context.params
  const nameCsvPath = "./pokemon_name.csv"
  const traitCsvPath = "./pokemon_trait.csv"
  const nameJson = await csv().fromFile(nameCsvPath)
  const traitJson = await csv().fromFile(traitCsvPath)
  return { props: { params, nameJson, traitJson } }
}

export default Component
