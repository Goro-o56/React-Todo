import { useState } from 'react';

type Todo = {
  value: string;

  readonly id: number;

  checked: boolean;
  removed: boolean;
};




export const App = () => {
  /**
   * text = ステートの値
   * setText =ステートの値を更新するメソッド
   * useStateの引数 = ステートの初期値(=空の文字列)
  */
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]); /*これはTodo型の配列ということ*/

  const handleOnEdit = (id: number, value: string) => {
    /**
     * ディープコピー:
     * Array.map()を利用するが、それぞれの要素をスプレッド構文で
     * 一旦コピーし、 それらのコピーを要素とする新しい配列を再生成
     * 
     * const deepCopy = todos.map((todo)=> ({
     *    value: todo.value,
     *    id: todo.id,
     * }));
     * 
    */
    const deepCopy = todos.map((todo) => 
      ({...todo})
    );

    const newTodos = deepCopy.map((todo) => {
      if(todo.id === id) {
        todo.value = value;
      }
      return todo;
    });

    console.log('Original todos');
    todos.map((todo) => console.log(`id: ${todo.id}, value: ${todo.value}`));

    setTodos(newTodos);
  };

  const handleOnSubmit = () => { //良い感じに関数を返そう

    if(!text) return; //textが無ならreturnする

    const newTodo: Todo = { //この中で必要な型を定義しよう
      value: text,

      id: new Date().getTime(), //idを与える

      checked: false,
      removed: false,
    };
    
    /**
     * スプレッド構文を用いてtodosステートのコピーへnewTodoを追加する
     * 以下と同義
     * 
     * const oldTodos = todos.slice();
     * old todos.unshift(newTodo);
     * setTodos(oldTodos);
     * 
    */


    //この下の2つの関数を返せる
    setTodos([newTodo, ...todos]); //更新関数、元の配列をnewTodoに既存のtodosを加えた配列へと更新
    
    setText(''); //フォームへの入力をクリアする
  };

  const handleOnCheck = (id: number, checked: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }));

    const newTodos = deepCopy.map((todo) =>{
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => { //これはtextステート向けの予定
    setText(e.target.value); //関数化することで、後のコンポーネント間でのprops受け渡しが容易になる
  };

  const handleOnRemove = (id: number, removed: boolean) => {
    const deepCopy = todos.map((todo) => ({...todo}));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    })

    setTodos(newTodos);
  };
  return (
    <div>
      <form 
        onSubmit = {(e) => { //handleOnSubmit() と preventDefault()を返す 
          e.preventDefault(); //Enterキー打鍵でページそのものがリロードされるのを防ぐ
          handleOnSubmit(); //配列を更新する関数を返す関数
        }} 
      >
      <input 
      type = "text" 
      value = {text} //これはtextステート
      onChange = {(e) => handleOnChange(e)} //これはonChangeイベント(入力テキストの変化)をtextステートに反映
      />
      <input
        type = "submit"
        value = "追加"
        onSubmit = {handleOnSubmit} //配列を更新することを呼び出す
      />

      </form>
      <ul>
        {todos.map((todo) => {
          return (
          <li key={todo.id}>
          <input
            type = "checkbox"
            disabled = {todo.removed}
            checked = {todo.checked}
            onChange = {() => handleOnCheck(todo.id, todo.checked)}
          />  
          <input
            type="text"
            disabled = {todo.checked || todo.removed}
            value={todo.value}
            onChange={(e) => handleOnEdit(todo.id, e.target.value)}
          />

          <button onClick={() => handleOnRemove(todo.id, todo.removed)}>
                {todo.removed ? '復元' : '削除'}
              </button>

          </li>
            ); //todoを展開 表示
          }
        )
        }
      </ul>
    </div>
  );
};
