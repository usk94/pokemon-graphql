import csv from "csvtojson"
import { gql, useQuery } from "urql"
import { Query_Root } from "../src/@types/types"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import React, { useState } from "react"
import PokemonList from "../src/components/pokemonList"

export type PokemonName = {
  japanese: string
  english: string
}

const allPokemonTypes = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy",
]

const generationLimit = {
  none: {
    _gt: 0,
    _lt: 899,
  },
  first: {
    _gt: 0,
    _lt: 152,
  },
  second: {
    _gt: 151,
    _lt: 252,
  },
  third: {
    _gt: 251,
    _lt: 387,
  },
  fourth: {
    _gt: 386,
    _lt: 494,
  },
  fifth: {
    _gt: 493,
    _lt: 650,
  },
  sixth: {
    _gt: 649,
    _lt: 722,
  },
  seventh: {
    _gt: 721,
    _lt: 808,
  },
  eighth: {
    _gt: 807,
    _lt: 899,
  },
}

const getPokemons = gql(`
  query getPokemons($limit: Int!, $pokemonType: [String!], $_gt: Int!, $_lt: Int!) {
    pokemon_v2_pokemon(limit: $limit, where:{pokemon_species_id: {_gt: $_gt, _lt: $_lt}, pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _in: $pokemonType}}}}) {
      name
      id
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`)

const Component = ({ nameJson }: { nameJson: PokemonName[] }) => {
  const [generation, setGeneration] =
    useState<keyof typeof generationLimit>("first")
  const [pokemonType, setPokemonType] = useState("none")
  const [limit, setLimit] = useState(898)
  const [pause, setPause] = useState(false)
  const handleChangeGeneration = (event: SelectChangeEvent) => {
    setGeneration(event.target.value as keyof typeof generationLimit)
    setPause(true)
  }
  const handleChangePokemonType = (event: SelectChangeEvent) => {
    setPokemonType(event.target.value)
    setPause(true)
  }
  const handleChangeLimit = (event: SelectChangeEvent<number>) => {
    setLimit(event.target.value as number)
    setPause(true)
  }
  const PokemonTypeForQuery =
    pokemonType !== "none" ? [pokemonType] : allPokemonTypes
  const [result, reexecute] = useQuery<Query_Root>({
    query: getPokemons,
    variables: {
      limit,
      pokemonType: PokemonTypeForQuery,
      _gt: generationLimit[generation]._gt,
      _lt: generationLimit[generation]._lt,
    },
    pause,
  })
  const { data, fetching, error } = result
  const pokemons = data?.pokemon_v2_pokemon
    .filter((p) => p.id <= 898)
    .sort((a, b) => {
      return a.id - b.id
    })
  const onClick = () => {
    reexecute({ requestPolicy: "network-only" })
  }

  if (fetching) return <p>ロード中...</p>
  if (!pokemons) return <p>一致するポケモンはいませんでした</p>
  if (error) return <p>こういうエラーが発生しました: {error.message}</p>

  return (
    <div>
      <div className="flex justify-center gap-8 mt-8">
        <FormControl className="w-28">
          <InputLabel sx={{ color: "black" }}>世代で検索</InputLabel>
          <Select
            value={generation}
            label="generation"
            onChange={handleChangeGeneration}
          >
            <MenuItem value="none">なし</MenuItem>
            <MenuItem value="first">第1世代</MenuItem>
            <MenuItem value="second">第2世代</MenuItem>
            <MenuItem value="third">第3世代</MenuItem>
            <MenuItem value="fourth">第4世代</MenuItem>
            <MenuItem value="fifth">第5世代</MenuItem>
            <MenuItem value="sixth">第6世代</MenuItem>
            <MenuItem value="seventh">第7世代</MenuItem>
            <MenuItem value="eighth">第8世代</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="w-28">
          <InputLabel sx={{ color: "black" }}>タイプで検索</InputLabel>
          <Select
            value={pokemonType}
            label="pokemonType"
            onChange={handleChangePokemonType}
            sx={{ color: "black" }}
          >
            <MenuItem value="none">なし</MenuItem>
            <MenuItem value="normal">ノーマル</MenuItem>
            <MenuItem value="fire">ほのお</MenuItem>
            <MenuItem value="water">みず</MenuItem>
            <MenuItem value="grass">くさ</MenuItem>
            <MenuItem value="electric">でんき</MenuItem>
            <MenuItem value="ice">こおり</MenuItem>
            <MenuItem value="fighting">かくとう</MenuItem>
            <MenuItem value="poison">どく</MenuItem>
            <MenuItem value="ground">じめん</MenuItem>
            <MenuItem value="flying">ひこう</MenuItem>
            <MenuItem value="psychic">エスパー</MenuItem>
            <MenuItem value="bug">むし</MenuItem>
            <MenuItem value="rock">いわ</MenuItem>
            <MenuItem value="ghost">ゴースト</MenuItem>
            <MenuItem value="dark">あく</MenuItem>
            <MenuItem value="dragon">ドラゴン</MenuItem>
            <MenuItem value="steel">はがね</MenuItem>
            <MenuItem value="fairy">フェアリー</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="w-24">
          <InputLabel sx={{ color: "black" }}>件数</InputLabel>
          <Select value={limit} label="number" onChange={handleChangeLimit}>
            <MenuItem value={898}>なし</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={onClick}>
          <SearchIcon
            sx={{ color: "black", fontSize: 36 }}
            className="text-black text-4xl"
          />
        </Button>
      </div>
      <PokemonList itemsPerPage={10} nameJson={nameJson} pokemons={pokemons} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const csvFilePath = "./pokemon_name.csv"
  const nameJson = await csv().fromFile(csvFilePath)
  return { props: { nameJson } }
}

export default Component
