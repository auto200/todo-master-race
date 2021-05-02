(() => {
  //DOM
  const noTodosMessageEl = document.querySelector("#no-todos-message");
  const addTodoInput = document.querySelector("#add-todo-form-input");
  const addTodoForm = document.querySelector("#add-todo-form");
  const todosContainer = document.querySelector("#todos-container");

  //listeners
  addTodoForm.addEventListener("submit", addTodo);

  //globals
  const todos = JSON.parse(window.localStorage.getItem("todos")) || [];

  //init
  if (todos.length) {
    noTodosMessageEl.classList.add("hidden");
    todos.forEach((todo) => {
      const el = buildTodoElement(todo);
      todosContainer.appendChild(el);
    });
  }

  function addTodo(e) {
    e.preventDefault();
    const content = addTodoInput.value;
    if (!content) return;
    const todo = {
      id: Math.random(),
      content,
      done: false,
    };
    todos.push(todo);
    const todoEl = buildTodoElement(todo);
    todosContainer.appendChild(todoEl);
    addTodoInput.value = "";
    noTodosMessageEl.classList.add("hidden");
    saveTodosInLocalStorage();
  }

  function buildTodoElement(todo) {
    const todoContainer = document.createElement("div");
    todoContainer.setAttribute("data-id", todo.id);
    todoContainer.classList.add("todo");

    const textContent = document.createElement("span");
    textContent.classList.add("todo-content");
    todo.done && textContent.classList.add("line-through");
    textContent.innerText = todo.content;
    todo.done && textContent.classList.add("todo-done");
    todoContainer.appendChild(textContent);

    const actionBtnsWrapper = document.createElement("div");
    actionBtnsWrapper.classList.add("todo-actions");
    todoContainer.appendChild(actionBtnsWrapper);
    actionBtnsWrapper.addEventListener("click", saveTodosInLocalStorage);

    const editBtn = document.createElement("button");
    editBtn.classList.add("todo-actions-edit");
    editBtn.innerText = "EDIT";
    editBtn.addEventListener("click", () => editTodoContent(todo));
    actionBtnsWrapper.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.classList.add("todo-actions-delete");
    delBtn.innerText = "DEL";
    delBtn.addEventListener("click", () => deleteTodo(todo));
    actionBtnsWrapper.appendChild(delBtn);

    const toggleDoneBtn = document.createElement("button");
    toggleDoneBtn.classList.add("todo-actions-done");
    todo.done && toggleDoneBtn.classList.add("bg-green");
    toggleDoneBtn.innerText = "DONE";
    toggleDoneBtn.addEventListener("click", () => toggleTodoDone(todo));
    actionBtnsWrapper.appendChild(toggleDoneBtn);

    return todoContainer;
  }

  function editTodoContent(todo) {
    const newContent = prompt("Edit content of current todo", todo.content);
    todo.content = newContent;
    const todoContentEL = document.querySelector(
      `.todo[data-id='${todo.id}'] .todo-content`
    );
    todoContentEL.innerText = newContent;
  }

  function deleteTodo({ id }) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmed) return;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return;
    todos.splice(todoIndex, 1);
    const todoEL = document.querySelector(`.todo[data-id='${id}']`);
    todoEL.remove();
    if (!todos.length) {
      noTodosMessageEl.classList.remove("hidden");
    }
  }

  function toggleTodoDone(todo) {
    todo.done = !todo.done;
    const todoTextContent = document.querySelector(
      `.todo[data-id='${todo.id}'] .todo-content`
    );
    const todoToggleDoneBtn = document.querySelector(
      `.todo[data-id='${todo.id}'] .todo-actions-done`
    );
    if (todo.done) {
      todoTextContent.classList.add("line-through");
      todoToggleDoneBtn.classList.add("bg-green");
    } else {
      todoTextContent.classList.remove("line-through");
      todoToggleDoneBtn.classList.remove("bg-green");
    }
  }
  function saveTodosInLocalStorage() {
    window.localStorage.setItem("todos", JSON.stringify(todos));
  }
})();
