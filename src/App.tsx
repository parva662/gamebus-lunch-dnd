import { useEffect, useState } from 'react'
import './App.css'
import { ErrorState } from './components/ErrorState'
import { GameBoard } from './components/GameBoard'
import { LoadingState } from './components/LoadingState'
import { useLunchGame } from './game/useLunchGame'
import { loadActiveMenu } from './services/menuLoader'
import type { MenuConfig } from './types/menu'

function App() {
  const [menu, setMenu] = useState<MenuConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadMenu(): Promise<void> {
      setMenu(null)
      setError(null)

      try {
        const activeMenu = await loadActiveMenu()

        if (!cancelled) {
          setMenu(activeMenu)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'The lunch menu could not be loaded.')
        }
      }
    }

    void loadMenu()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
  }

  if (!menu) {
    return <LoadingState />
  }

  return <LunchGame menu={menu} />
}

function LunchGame({ menu }: { menu: MenuConfig }) {
  const game = useLunchGame(menu)

  return <GameBoard menu={menu} game={game} />
}

export default App
