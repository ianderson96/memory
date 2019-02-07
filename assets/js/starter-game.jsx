import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
const shuffle = require("fisher-yates-shuffle");

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel} />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      tiles: [],
      score: 0,
      clicksPaused: false
    };
    this.channel
      .join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp);
        const g = resp.game;
        this.setState(resp.game);
      })
      .receive("error", resp => {
        console.log("Unable to join", resp);
      });
  }

  handleClick(tile) {
    if (!this.state.clicksPaused) {
      this.channel.push("flip", { tile: tile }).receive("ok", resp => {
        this.setState(resp.game);
      });

      const flipped = this.state.tiles.filter(
        tile => tile.flipped && !tile.completed
      );
      if (flipped.length >= 1) {
        this.setState({
          clicksPaused: true
        });
        setTimeout(() => {
          this.unflipTiles();
          this.setState({
            clicksPaused: false
          });
        }, 750);
      }
    }
  }

  unflipTiles() {
    this.channel.push("unflip", {}).receive("ok", resp => {
      this.setState(resp.game);
    });
  }

  reset() {
    this.channel.push("reset", {}).receive("ok", resp => {
      this.setState(resp.game);
    });
  }

  render() {
    if (this.state.tiles.length > 0) {
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
          <button className="button" onClick={this.reset.bind(this)}>
            Reset
          </button>
          <span id="score">
            Score: {this.state.score} (lower score is better!)
          </span>
        </div>
      );
    } else {
      return <div />;
    }
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
      <h2>{props.flipped || props.completed ? props.letter : ""}</h2>
    </div>
  );
}
