import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
const shuffle = require("fisher-yates-shuffle");

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    let letters = [
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
    ];
    // shuffling letters with the fisher-yates-shuffle npm library
    letters = shuffle(letters);
    let tiles = [];
    for (var i = 0; i < 16; i++) {
      tiles.push({
        index: i,
        letter: letters[i],
        flipped: false,
        completed: false
      });
    }
    this.state = {
      tiles: tiles,
      matching: false,
      clicksAllowed: true,
      matchingTile: "none",
      score: 0
    };
  }

  handleClick(tile) {
    if (this.state.clicksAllowed && !tile.completed && !tile.flipped) {
      let tiles = this.state.tiles.slice();
      if (this.state.matching) {
        var matches = tile.letter == this.state.matchingTile.letter;
        if (matches) {
          this.handleMatchedTile(tile, tiles);
        } else {
          this.handleNotMatchedTile(tile, tiles);
        }
      } else {
        var index = tile.index;
        var newTile = {
          index: tile.index,
          letter: tile.letter,
          flipped: !tile.flipped,
          completed: tile.completed
        };
        tiles[index] = newTile;
        this.setState({
          tiles: tiles,
          matching: true,
          clicksAllowed: true,
          matchingTile: tile,
          score: this.state.score + 100
        });
      }
    }
  }

  handleMatchedTile(tile, tiles) {
    tiles[tile.index] = {
      index: tile.index,
      letter: tile.letter,
      flipped: true,
      completed: true
    };
    let matchingTile = this.state.matchingTile;
    tiles[matchingTile.index] = {
      index: matchingTile.index,
      letter: matchingTile.letter,
      flipped: true,
      completed: true
    };
    this.setState({
      tiles: tiles,
      matching: false,
      clicksAllowed: true,
      matchingTile: "none",
      score: this.state.score
    });
  }

  handleNotMatchedTile(tile, tiles) {
    tiles[tile.index] = {
      index: tile.index,
      letter: tile.letter,
      flipped: true,
      completed: false
    };
    let matchingTile = this.state.matchingTile;
    this.setState({
      tiles: tiles,
      matching: true,
      clicksAllowed: false,
      matchingTile: matchingTile,
      score: this.state.score
    });
    setTimeout(() => {
      let secondTiles = tiles.slice();
      secondTiles[tile.index] = {
        index: tile.index,
        letter: tile.letter,
        flipped: false,
        completed: false
      };
      secondTiles[matchingTile.index] = {
        index: matchingTile.index,
        letter: matchingTile.letter,
        flipped: false,
        completed: false
      };
      this.setState({
        tiles: secondTiles,
        matching: false,
        clicksAllowed: true,
        matchingTile: "none",
        score: this.state.score
      });
    }, 750);
  }

  reset() {
    let letters = [
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
    ];
    // shuffling letters with the fisher-yates-shuffle npm library
    letters = shuffle(letters);
    let tiles = [];
    for (var i = 0; i < 16; i++) {
      tiles.push({
        index: i,
        letter: letters[i],
        flipped: false,
        completed: false
      });
    }
    this.setState({
      tiles: tiles,
      matching: false,
      clicksAllowed: true,
      matchingTile: "none",
      score: 0
    });
  }

  render() {
    let renderedTiles = [];
    for (var i = 0; i < 4; i++) {
      var k = i * 4;
      var row = [];
      for (var j = 0; j < 4; j++) {
        var tile = this.state.tiles[k + j];
        row.push(
          <Tile
            key={tile.index}
            index={tile.index}
            letter={tile.letter}
            flipped={tile.flipped}
            completed={tile.completed}
            handleClick={this.handleClick.bind(this)}
          />
        );
      }
      renderedTiles.push(<div className="row">{row}</div>);
    }
    return (
      <div className="column">
        {renderedTiles}
        <button className="button" onClick={this.reset}>
          Reset
        </button>
        <span id="score">
          Score: {this.state.score} (lower score is better!)
        </span>
      </div>
    );
  }
}

function Tile(props) {
  return (
    <div
      className={
        props.completed
          ? "row row-center tile completed"
          : "row row-center tile"
      }
      onClick={() => props.handleClick(props)}
    >
      <h2>{props.flipped ? props.letter : ""}</h2>
    </div>
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
