import { gql, useQuery } from "urql"
import { Attack, Pokemon, Query } from "../src/@types/types"

const getPikachu = gql(`
  query getPikachu {
    pokemon (name: "pikachu") {
      number
      name
      image
      attacks {
        fast {
          name
          type
          damage
        }
      }
    }
  }
`)

const Component = () => {
  const [result, reeexcuteQuery] = useQuery<Query>({
    query: getPikachu,
  })
  const { data, fetching, error } = result
  const attackName = data?.pokemon?.attacks?.fast[0]?.name

  if (fetching) return <p>ロード中...</p>
  if (error) return <p>こういうエラーが発生しました: {error.message}</p>
  return <p>{attackName}</p>
}

export default Component
