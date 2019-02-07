defmodule Memory.Game do
  def new do
    %{
      tiles: random_tiles(),
      matching: false,
      clicksAllowed: true,
      matchingTile: "none",
      score: 0
    }
  end

  def client_view(game) do
    ts = game.tiles
    s = game.score

    %{
      "tiles" => ts,
      "score" => s
    }
  end

  def flip(game, tile) do
    ts = game.tiles
    index = tile["index"]
    newScore = game.score + 100

    if !game.matching do
      replacement = Map.put(tile, "flipped", true)

      newTiles = List.replace_at(ts, index, replacement)

      game
      |> Map.merge(%{tiles: newTiles, matchingTile: tile, matching: true})
      |> Map.put(:score, newScore)
    else
      if tile["letter"] == game.matchingTile["letter"] do
        matchingIndex = game.matchingTile["index"]

        newMatchTile =
          Map.merge(game.matchingTile, %{
            "flipped" => false,
            "completed" => true
          })

        replacement =
          Map.merge(tile, %{
            "flipped" => false,
            "completed" => true
          })

        newTiles = List.replace_at(ts, index, replacement)
        newerTiles = List.replace_at(newTiles, matchingIndex, newMatchTile)

        game
        |> Map.merge(%{tiles: newerTiles, matchingTile: "none", matching: false})
        |> Map.put(:score, newScore)
      else
        matchingIndex = game.matchingTile["index"]

        newMatchTile =
          Map.merge(game.matchingTile, %{
            "flipped" => true
          })

        replacement =
          Map.merge(tile, %{
            "flipped" => true,
            "completed" => false
          })

        newTiles = List.replace_at(ts, index, replacement)
        newerTiles = List.replace_at(newTiles, matchingIndex, newMatchTile)

        game
        |> Map.merge(%{tiles: newerTiles, matchingTile: "none", matching: false})
        |> Map.put(:score, newScore)
      end
    end
  end

  def unflip(game) do
    newTiles =
      Enum.map(game.tiles, fn x ->
        Map.put(x, "flipped", false)
      end)

    game
    |> Map.merge(%{tiles: newTiles})
  end

  def random_tiles() do
    tiles = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H"
    ]

    tiles
    |> Enum.shuffle()
    |> Enum.with_index()
    |> Enum.map(fn {v, k} ->
      %{"index" => k, "letter" => v, "flipped" => false, "completed" => false}
    end)
  end
end
