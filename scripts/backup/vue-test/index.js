// Define a new component called todo-item
Vue.component("todo-item", {
  props: ["todo"],
  template: "<li>{{ todo.text }}</li>",
});

var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    title: "You loaded this page on " + new Date().toLocaleString(),
    seen: true,

    todos: [
      { text: "Learn JavaScript" },
      { text: "Learn Vue" },
      { text: "Build something awesome" },
    ],

    groceryList: [
      { id: 0, text: "Vegetables" },
      { id: 1, text: "Cheese" },
      { id: 2, text: "Whatever else humans are supposed to eat" },
    ],
  },

  methods: {
    reverseMessage: function () {
      this.message = this.message.split("").reverse().join("");
    },
  },
});

document.onclick = () => app.todos.push({ text: "New item " + new Date() });
