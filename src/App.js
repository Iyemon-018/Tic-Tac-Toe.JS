// useState に付いての説明は以下を参照する。
// cf. https://ja.reactjs.org/docs/hooks-state.html#whats-a-hook
// ここでは React のフック機能を使用するために react から useState を言う機能をインポートしている。
// フック＝ React の機能に接続するための特別な関数（<ーイミフ）

import { useState } from 'react';

function Square() {
  // ここでは「state 変数」を定義している。
  // 以下のように定義することで value という変数がこの関数内部で使用できる。
  // 通常の変数と異なり、関数を抜けてもこの変数は保持される。
  // useState(<引数>) の引数には変数 value の初期値を登録する。
  // setValue は変数 value を更新するための関数として使用される。
  // setValue('9') とすると、value の値が文字列 9　になる。
  // ex. https://ja.reactjs.org/docs/hooks-state.html#updating-state
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X')
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  )
}
