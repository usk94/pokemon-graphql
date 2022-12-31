import PokemonPagination from "../src/components/pokemonPagination"
import csv from "csvtojson"
import { gql, useQuery } from "urql"
import { Query_Root } from "../src/@types/types"
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import React, { useState } from "react"

export type PokemonName = {
  japanese: string
  english: string
}

const getPokemons = gql(`
  query getPokemons {
    pokemon_v2_pokemon(limit:30, where:{pokemon_species_id: {_gt: 500}}) {
      name
      id
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`)

const Component = ({ nameJson }: { nameJson: PokemonName[] }) => {
  const [result, reeexcute] = useQuery<Query_Root>({
    query: getPokemons,
  })
  const { data, fetching, error } = result
  const pokemons = data?.pokemon_v2_pokemon
  const [generation, setGeneraion] = useState(1)
  const [number, setNumber] = useState(5)
  const handleChangeGeneration = (event: SelectChangeEvent<number>) => {
    setGeneraion(event.target.value as number)
  }
  const handleChangeNumber = (event: SelectChangeEvent<number>) => {
    setGeneraion(event.target.value as number)
  }

  if (fetching) return <p>ロード中...</p>
  if (!pokemons) return <p>一致するポケモンはいませんでした</p>
  if (error) return <p>こういうエラーが発生しました: {error.message}</p>

  return (
    <>
      <div>
        <FormControl>
          <InputLabel>世代で検索</InputLabel>
          <Select
            value={generation}
            label="generation"
            onChange={handleChangeGeneration}
            className="flex flex-row"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>絞り込み件数</InputLabel>
          <Select value={number} label="number" onChange={handleChangeNumber}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <PokemonPagination
          itemsPerPage={10}
          nameJson={nameJson}
          pokemons={pokemons}
        />
      </div>
    </>
  )
}

export const getServerSideProps = async () => {
  const csvFilePath = "./pokemon_name.csv"
  const nameJson = await csv().fromFile(csvFilePath)
  return { props: { nameJson } }
}

export default Component
