import "../styles/globals.css"
import UrqlProvider from "./urqlProvider"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <UrqlProvider>{children}</UrqlProvider>
      </body>
    </html>
  )
}

export default RootLayout
