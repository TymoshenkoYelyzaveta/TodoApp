class Todo {
    constructor(text, checked, id) {
        this.text = text;
        this.checked = checked;
        this.id = id;
    }
}


class UI {
    static displayTodos() {
        const todos = Store.getTodos();
        todos.forEach((todo) => UI.addTodo(todo));
    }

    static addTodo(todo) {
        const list = document.querySelector('.js-todo-list');
        list.insertAdjacentHTML('beforeend', `
        <li class="todo-item ${todo.checked ? 'done' : ''}" data-key="${todo.id}">
            <input id="${todo.id}" type="checkbox"/>
            <label for="${todo.id}" class="tick js-tick"></label>
            <span>${todo.text}</span>
            <i class="fas fa-trash-alt fa-2x delete-todo js-delete-todo"></i>
            <h5 class="js-delete-todo">Delete</h5>

        </li>
    `);
    }

    static deleteTodo(el) {
        if (el.classList.contains('js-delete-todo')) {
            el.parentElement.remove();
        }
    }


    static clearField() {
        const input = document.querySelector('.js-todo-input');
        input.value = '';
        input.focus();
    }


    static toggleDone(id) {
        const item = document.querySelector(`[data-key='${id}']`);
        const todos = Store.getTodos();
        todos.forEach((todo, index) => {
            if (todo.id === id) {
                if (todos[index].checked) {
                    item.classList.add('done');
                } else {
                    item.classList.remove('done');
                }
            }
        });
    }
}

class Store {
    static getTodos() {
        let todos;
        if (localStorage.getItem('todos') === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }
        return todos;
    }

    static addTodo(todo) {
        const todos = Store.getTodos();
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static removeTodo(id) {
        const todos = Store.getTodos();

        todos.forEach((todo, index) => {
            if (todo.id === id) {
                todos.splice(index, 1);
            }
        });

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static toggleDone(id) {
        const todos = Store.getTodos();

        todos.forEach((todo, index) => {
            if (todo.id === id) {
                if (todos[index].checked) {
                    todos[index].checked = false;
                } else {
                    todos[index].checked = true;
                }
            }
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

// Event: Display All Todos
document.addEventListener('DOMContentLoaded', UI.displayTodos);


// Event: Add a todo 
const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {

    event.preventDefault();

    //Get the value from input
    const input = document.querySelector('.js-todo-input');
    const text = input.value.trim();

    if (text !== '') {
        // Get random id for the todo item
        const id = (~~(Math.random() * 1e8)).toString(16);

        // Init new todo
        const todo = new Todo(text, false, id);
        UI.addTodo(todo);
        Store.addTodo(todo);
        UI.clearField();
    }
});

//Event: Remove a Todo
document.querySelector('.js-todo-list').addEventListener('click', (e) => {

    if (event.target.classList.contains('js-delete-todo')) {
        // Remove a todo from UI
        UI.deleteTodo(e.target);

        // Remove a todo from storage
        Store.removeTodo(e.target.parentElement.dataset.key);
    }

    if (e.target.classList.contains('js-tick')) {
        const itemKey = e.target.parentElement.dataset.key;
        console.log(e.target.parentElement);
        Store.toggleDone(itemKey);
        UI.toggleDone(itemKey);
    }
});