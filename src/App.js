// useState に付いての説明は以下を参照する。
// cf. https://ja.reactjs.org/docs/hooks-state.html#whats-a-hook
// ここでは React のフック機能を使用するために react から useState を言う機能をインポートしている。
// フック＝ React の機能に接続するための特別な関数（<ーイミフ）

import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

export default function Board() {
  // 9つの正方形に対応する、状態変数。
  // 9個の配列にはそれぞれ'X', '○', null が入る想定となっている。
  // .fill() とすることで配列の初期値を設定することができる。
  // この変数でどの正方形にどの値が入っているかを判断できるようになった。
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    // squares 配列のシャローコピーを作ってその先頭要素を"X"に変える。
    // コピーした配列を set して表示されている値を更新することで、左上隅の正方形に"X"を表示する。
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={ () => handleClick(0) } />
        <Square value={squares[1]} onSquareClick={ () => handleClick(1) } />
        <Square value={squares[2]} onSquareClick={ () => handleClick(2) } />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={ () => handleClick(3) } />
        <Square value={squares[4]} onSquareClick={ () => handleClick(4) } />
        <Square value={squares[5]} onSquareClick={ () => handleClick(5) } />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={ () => handleClick(6) } />
        <Square value={squares[7]} onSquareClick={ () => handleClick(7) } />
        <Square value={squares[8]} onSquareClick={ () => handleClick(8) } />
      </div>
    </>
  )
}
