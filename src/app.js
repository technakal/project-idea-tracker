const app = {
  todos: {}
};

const calculateLength = (list) => {
  return list.map(item => app.todos[item].length).reduce((a, b) => a + b);
}

const trackers = document.querySelectorAll(".progress-tracker");
const checklists = document.querySelectorAll(".checklist");

checklists.forEach(list => {
  const listName = list.id;
  app.todos[listName] = [];
  const todos = list.querySelectorAll("input");
  todos.forEach(todo => {
    app.todos[listName].push({
      id: todo.id,
      done: todo.checked
    });
  })
});

trackers.forEach(tracker => {
  const listNames = [];
  checklists.forEach(list => listNames.push(list.id));
  const length = calculateLength(listNames);
  tracker.querySelector('span').innerHTML = `0/${length}`;
})