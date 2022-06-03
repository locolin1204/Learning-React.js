import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className = {props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square value = {this.props.squares[i]}
                  onClick = {()=> this.props.onClick(i)}
                  key = {i}
                  className = {`${this.props.winnerSquares.includes(i) && "winner-squares"} square`}
            />);
  }

  render() {
    const elements = [0,1,2];
    let startNum = 0;

    const squareRows = elements.map(() => {
      return (
        <div className="board-row" key = {startNum}>
          {elements.map(() => {return (this.renderSquare(startNum++))})}
        </div>
      )
    })

    return (
      <div className="board">
        {squareRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        click: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascend: false,
    }
  }
  // function that generate the whole description
  fullDesc(historyObj){
    return(
      <div>
        {historyObj.desc}
        <span className={`${historyObj.notFirstMove && "player-status"}`}>{historyObj.curPlayer}</span>
        {historyObj.desc2}
        <span className={`${historyObj.notFirstMove && "coordinates"}`}>{`${historyObj.row} ${historyObj.col}`}</span>
      </div>
    )
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    const moves = history.map((step,move) => {
      const historyObj = {
        row: Math.floor(history[move].click/3),
        col: history[move].click%3,
        curPlayer: move % 2 ? "X" : "O",
        desc: "",
        desc2: "",
        notFirstMove: false,
      }
      if(move){
        historyObj.notFirstMove = true;
        historyObj.desc = `Go to move #${move} `;
        historyObj.desc2 = ` placed at `;
        historyObj.row = `${historyObj.row},`
      } else {
        historyObj.desc = "Go to game start";
        historyObj.desc2 = "";
        historyObj.curPlayer = "";
        historyObj.row = "";
        historyObj.col = "";
      }
      return (
        <div className="move-elements" key={move}>
            <button
              className="time-button"
              onClick={() => {this.jumpTo(move)}}
              > 
                {(move === this.state.stepNumber) ?
                <b>
                {this.fullDesc(historyObj)}
                </b> : 
                <div>
                {this.fullDesc(historyObj)}
                </div>}
              </button>
        </div>
      );
    });

    const ascend = this.state.ascend;
    const winner = calculateWinner(current.squares);

    let status;
    let playerStatus;
    let winSquares = [];
    if(winner){
      status = "Winner is ";
      playerStatus = winner.winner;
      winSquares = winner.winSquares;
    } else if(this.state.stepNumber < 9) {
      status = "Next player is ";
      playerStatus = (this.state.xIsNext ? "X" : "O");
    } else {
      status = "This game is a draw!";
      playerStatus = false;
    }
    return (
      <div className="game-main">
        <div className={`${winner && "display-winner"} status ${this.state.stepNumber >= 9 && "display-draw"}`}>
        {status} 
        <div className={`${playerStatus && "player-status"} next-player`}>{playerStatus}</div>
        </div>
          <div className="game">
            <div className="game-board">
              <Board 
                squares = {current.squares}
                onClick = {(i)=> this.handleClick(i)}
                winnerSquares = {winSquares}
              />
            </div>
            <div className="game-info">
              <button className="order-button" onClick = {() => {this.handleOrder()}} >{ascend ? "Ascending" : "Descending"}</button>
              <div className="game-history">{ascend ? moves.reverse() : moves }</div>
            </div>
          </div>
      </div>
    );
  }

  handleOrder(){
    this.setState({
      ascend: !this.state.ascend,
    })
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        click: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {winner: squares[a], winSquares: lines[i]};
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);