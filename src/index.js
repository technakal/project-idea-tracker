class Project {
  constructor(text, category, completed) {
    this.id = Math.floor(Math.random() * 1000 + 1);
    this._text = text;
    this._category = category;
    this._completed = completed;
  }

  get text() {
    return this._text;
  }

  get category() {
    return this._category;
  }

  get completed() {
    return this._completed;
  }

  toggleCompleted() {
    this._completed = !this._completed;
  }

  createProjectElem() {
    return `<li><input type="checkbox" id="${this.id}" ${
      this.completed ? "checked" : ""
    }/><label for="${this.id}">${this.text}</label></li>`;
  }
}

class ProjectList {
  constructor(listName, projects, source) {
    this._listName = listName;
    this._projects = projects;
    this._source = source;
  }

  get listName() {
    return this._listName;
  }

  get projects() {
    return this._projects;
  }

  get source() {
    return this._source;
  }

  getCategories() {
    const categories = this.projects.map(project => project.category);
    return categories.filter((item, index) => categories.indexOf(item) >= index);
  }

  getProjectsByCategory(category) {
    return this.projects
      .map(project => (project.category === category ? project : null))
      .filter(project => project !== null);
  }

  getTotalProjects(list) {
    return list.length;
  }

  getTotalCompleted(list) {
    return list
      .map(project => {
        if (project.completed) {
          return 1;
        } else {
          return 0;
        }
      })
      .reduce((a, b) => a + b);
  }

  createCategoryElem(category) {
    const categoryArray = category.split(" ");
    const categoryId = categoryArray.join("-");
    const categoryName = categoryArray
      .map(word => word[0].toUpperCase() + word.slice(1, word.length))
      .join(" ");
    return `<div class="checklist"><div class="checklist-header"><h3 class="checklist-title">${categoryName}</h3><span class="checklist-total">${this.getTotalCompleted(
      this.projects
    )}/${this.getTotalProjects(
      this.getProjectsByCategory(category)
    )}</span></div><ul class="collapsed" id="${categoryId}"></ul></div>`;
  }

  createCategoryView(categories) {
    return categories.map(category => this.createCategoryElem(category)).join("");
  }

  createTotalView(list) {
    // returns the DOM representation of the total
    // can be used to return the total completed
    // can be used to return the total completed for a single category
  }
}

class App {
  constructor() {
    this._currentList = "karan";
    this._projectLists = [];
    this._totalCompleted = 0;
    this._baseUrl = "https://technakal.github.io/project-ideas-api/data.json";
  }

  get currentList() {
    return this._currentList;
  }

  set currentList(listName) {
    this._currentList = listName;
  }

  get projectLists() {
    return this._projectLists;
  }

  set projectLists(projectLists) {
    this._projectLists = projectLists;
  }

  get totalCompleted() {
    return this._totalCompleted;
  }

  set totalCompleted(newTotal) {
    this._totalCompleted = newTotal;
  }

  async retrieveDataSource(url) {
    try {
      let response = await fetch(this._baseUrl);
      let data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  findProjectIndex(listName) {
    const projectList = this.projectLists.find(
      projectList => projectList.listName.toLowerCase() === listName.toLowerCase()
    );
    return this.projectLists.indexOf(projectList);
  }

  formatForSave(currentList, projects) {
    // formats the currentList and projects for storage as JSON.
    // converts from app data to JSON data
  }

  isStorageAvailable(storageType) {
    // returns boolean for whether storageType is available for use
  }

  saveDataToLocalStorage(data) {
    // retrieves state information from localStorage or the data.json file, assuming I can get that to work.
  }

  toggleCollapsed(elem) {
    if (elem.className === "collapsed") {
      return this.updateClassName(elem, "open");
    }
    return this.updateClassName(elem, "collapsed");
  }

  updateDomLocation(html, location) {
    document.querySelector(location).innerHTML = html;
  }

  updateClassName(elem, newClass) {
    return (elem.className = newClass);
  }
}

const initializer = {
  createProject(item) {
    return new Project(item.text, item.category, item.completed);
  },

  createProjectList(list) {
    const projects = list.projects.map(project => this.createProject(project));
    return new ProjectList(list.listName, projects, list.source);
  },

  createApp() {
    const app = new App();
    app.retrieveDataSource(app._baseUrl).then(data => {
      const projectLists = data.projectLists.map(list => this.createProjectList(list));
      app.projectLists = projectLists;
      app.currentList = data.currentList;
      const currentListContent = app.projectLists[app.findProjectIndex(app.currentList)];

      app.totalCompleted = currentListContent.getTotalCompleted(currentListContent.projects);
      app.updateDomLocation(
        `${app.totalCompleted}/${currentListContent.getTotalProjects(currentListContent.projects)}`,
        "#totalCompleted"
      );
      const categories = currentListContent.getCategories();
      const categoryHtml = currentListContent.createCategoryView(categories);
      app.updateDomLocation(categoryHtml, "#checklists");
      categories.map(category => {
        const projectHtml = currentListContent.projects
          .map(project => {
            return project.category === category ? project.createProjectElem() : null;
          })
          .filter(project => project !== null)
          .join("");
        app.updateDomLocation(projectHtml, `#${category.split(" ").join("-")}`);
      });
      app.updateDomLocation(
        `<a href="${currentListContent.source}">${app.currentList[0].toUpperCase() +
          app.currentList.slice(1, app.currentList.length)}</a>`,
        "#source"
      );
      const checklists = document.querySelectorAll(".checklist");
      checklists.forEach(item =>
        item.addEventListener("click", e => {
          if (e.target.tagName === "H3") {
            app.toggleCollapsed(e.target.parentNode.parentNode.querySelector("ul"));
          }
        })
      );
      return app;
    });
  }
};

const app = initializer.createApp();
