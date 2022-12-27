import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql-pokemon2.vercel.app",
  documents: ["src/**/*.tsx", "pages/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/@types/types.d.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
}

export default config
