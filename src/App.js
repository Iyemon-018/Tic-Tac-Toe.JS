// useState に付いての説明は以下を参照する。
// cf. https://ja.reactjs.org/docs/hooks-state.html#whats-a-hook
// ここでは React のフック機能を使用するために react から useState を言う機能をインポートしている。
// フック＝ React の機能に接続するための特別な関数（<ーイミフ）

import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {
  // 引数で指定したマスの表示テキストを変更できるようにした。
  // これを呼び出そうとすると onSquareClick={handleClick(0)} と書けば良いように思うが、
  // 実際には想定したとおりには動かない。
  // <Square ... /> 部分はこのコンポーネントの一部で、レンダリングの対象となっている。
  // そのため、handleClick で setSquares を呼び出したときにもう一度レンダリングが行われてしまう。
  // 問題の原因は"(0)"の部分にある。
  // {handleClick(0)} と書くと、クリックイベントを待たずにイベントが着火してしまう。
  // これにより、handleClick(0) → setSquares → レンダリング → handleClick(0) ...
  // の繰り返しになってしまい、無限ループとなる。
  //
  // 対策として、onSquareClick={ () => handleClick(0) } とかく。
  // これは「アロー演算子」と呼び、C# でいうところのコールバックのようなものになる。
  // cf. https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  function handleClick(i) {
    // 初期状態＝どのプレイヤーもクリックしていない であれば選択可能とする。
    // 以下の分岐については null, undefined, 空文字, 0 以外の値が入っている場合、true となる。
    // つまり、このコンポーネントの仕様上"◯" or "X"が入っていれば true となる。
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // squares 配列のシャローコピーを作ってその先頭要素を"X"に変える。
    // コピーした配列を set して表示されている値を更新することで、左上隅の正方形に"X"を表示する。
    const nextSquares = squares.slice();

    // 現在の手順によってマークがかわる。
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = '◯';
    }

    onPlay(nextSquares);
    // setSquares(nextSquares);

    // // レンダリング後に手順を変更することで先攻・後攻を切り替えている。
    // setIsNext(!xIsNext);
  }

  // 現在の状態をプレイヤーに知らせるための状態ラベルを定義する。
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : '◯');
  }

  return (
    <>
      <div className='status'>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

export default function Game() {
  // 現在のプレイヤーの先攻・後攻を表すフラグです。
  // true = 先攻(X)の順序, false = 後攻(○)の順序 とする。
  const [xIsNext, setXIsNext] = useState(true);

  const [history, setHistory] = useState([Array(9).fill(null)]);

  // 現在表示しているステップの値です。
  // 履歴を選択するとそのステップの状態を表示するために使用する。
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];

  /**
   * 正方形をクリックしたときのハンドラです。
   * @param {Array} nextSquares 次にレンダリングする正方形の状態配列です。
   */
  function handlePlay(nextSquares) {
    // 履歴を保持する。
    // ...history.slice(0, currentMove + 1) によって、これまでの履歴の配列を定義している。
    // ... は「スプレッド構文」と呼び、...<変数> とすることで、その変数を0個以上の値に展開することができる。
    // つまり以下では、現時点の履歴配列に新規履歴（nextSquares）を加えることで
    // あらたな履歴として更新しようとしている。
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);

    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext);
  }

  /**
   * 指定したターン数にジャンプします。
   * 特定の履歴番号へジャンプするために使います。
   * @param {Any} nextMove 表示したいターン数を設定します。
   */
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 == 0);
  }

  // ボタンで履歴にジャンプするためのコンポーネントを作る。
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    // button の UI で履歴の手順を示す。
    // このボタンを押下することでその手順の履歴にジャンプできるようになる。
    // React ではリスト UI （=<ol><li>）を複数レンダリングする際に
    // リスト項目の位置を覚えておく必要がある。
    // 覚えておくための仕組みとして React では key という予約済みプロパティが存在する。
    // key には同階層のリスト項目に対して一意である値を設定する。
    // この key が割り振られることによって、リスト項目の増減、順序の変更に対応している。
    // key が適切に設定されていない場合、以下のような警告が表示されてしまう。
    // note: Warning: Each child in a list should have a unique "key" prop.
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  // <ol> 要素には moves しかいないが、レンダリングされるたびに moves が呼ばれるため
  // ターンが進むごとに <li><button>... が増えていく。
  // マスをクリックすると再レンダリングされターンが進む。
  // これを繰り返すことでボタンの数（履歴の数）が増えていくという仕組み。
  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/**
 * 勝者が確定したかどうかを判定します。
 * @param {Array} squares 正方形のマーク状態を表す配列を設定します。
 * @returns 判定結果を返します。null の場合、ゲームは継続されます。勝者が確定している場合はそのプレイヤーのマーク文字列を返します。
 */
function calculateWinner(squares) {
  // 正方形の配置で勝利が確定するマスのインデックスの組み合わせを定義する。
  // 左上を0, 右下を8として2次元配列の組み合わせに一致する場合、勝利が確定する。
  // 以下にはその勝利が確定するパターンを網羅している。
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a]
      && squares[a] === squares[b]
      && squares[a] === squares[c]) {
      // 勝利が確定しているパターン
      return squares[a];
    }
    return null;
  }
}