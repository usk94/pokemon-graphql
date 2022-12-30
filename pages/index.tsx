import PokemonPagination from "../src/components/pokemonPagination"
import styles from "../styles/PaginationContainer.module.scss"

const Component = () => {
  return (
    <>
      <div className={styles.container}>
        <PokemonPagination itemsPerPage={10} />
      </div>
    </>
  )
}

export default Component
