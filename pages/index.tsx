import PokemonPagination from "../src/components/pokemonPagination"
import csv from "csvtojson"

export type PokemonName = {
  japanese: string
  english: string
}

const Component = ({ nameJson }: { nameJson: PokemonName[] }) => {
  return (
    <>
      <div>
        <PokemonPagination itemsPerPage={10} nameJson={nameJson} />
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
