const baseUrl = "https://technakal.github.io/project-ideas-api/data.json";

/**
 * Tests whether a particular type of storage is available on the client machine.
 * @param {string} type - The type of storage to test.
 */
const storageAvailable = type => {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
};

/**
 * Class constructor for the Project item
 * Stores details for a single project.
 * @param {string} text - The textual description of the project.
 * @param {string} category - The sub-category to which the project belongs. These vary by project list.
 * @param {boolean} completed - Tracks whether a project is completed.
 */
class Project {
  constructor(text, category, completed) {
    this.id = Math.floor(Math.random() * 1000 + 1);
    this._text = text;
    this._category = category.toLowerCase();
    this._completed = completed;
  }

  /**
   * Getter method for the text property.
   */
  get text() {
    return this._text;
  }

  /**
   * Getter method for the category property.
   */
  get category() {
    return this._category;
  }

  /**
   * Getter method for the completed property.
   */
  get completed() {
    return this._completed;
  }

  /**
   * Setter method for the completed property.
   * @param {boolean} value - The status of the project.
   * @returns {boolean}
   */
  set completed(value) {
    this._completed = value;
    return this.completed;
  }

  /**
   * Creates the DOM representation of the project item.
   * @returns Project DOM element.
   *   <li>
   *     <input type="checkbox" id="1234" checked/>
   *     <label for="1234">Build a spaceship.</label>
   *   </li>
   */
  createProjectElem() {
    return `<li><input type="checkbox" id="${this.id}" ${
      this.completed ? "checked" : ""
    }/><label for="${this.id}">${this.text}</label></li>`;
  }
}

/**
 * Class constructor for the ProjectList item
 * Creates an object to represent a collection of related projects.
 * @param {string} listName - The name of the project list.
 * @param {array} projects - The projects making up the project list.
 * @param {string} source - The attribution source for the project list.
 * @param {number} totalCompleted - How many projects in the list are completed.
 */
class ProjectList {
  constructor(listName, projects, source, totalCompleted) {
    this._listName = listName;
    this._projects = projects;
    this._source = source;
    this._totalCompleted = totalCompleted;
  }

  /**
   * Getter method for the listName property.
   * @returns {string}
   */
  get listName() {
    return this._listName;
  }

  /**
   * Getter method for the listName property.
   * @returns {string}
   */
  get projects() {
    return this._projects;
  }

  /**
   * Getter method for the listName property.
   * @returns {string}
   */
  get source() {
    return this._source;
  }

  /**
   * Getter method for the totalCompleted property.
   * @returns {number}
   */
  get totalCompleted() {
    return this._totalCompleted;
  }

  /**
   * Returns the total number of projects in the list.
   * @returns {number}
   */
  get totalProjects() {
    return this.projects.length;
  }

  /**
   * Getter method for the categories.
   * Returns the filtered list of category names for projects in the dataset.
   * @returns {array}
   */
  get categories() {
    const categories = this.projects.map(project => project.category);
    return categories.filter((item, index) => categories.indexOf(item) >= index);
  }

  /**
   * Setter method for the totalCompleted value.
   * @param {array} list - The list of projects to check for completed status.
   * @returns {number}
   */
  set totalCompleted(list) {
    this._totalCompleted = this.calculateTotalCompleted(list);
    return this.totalCompleted;
  }

  /**
   * Retrieves the projects related to a single category.
   * Returns the filtered list of category names for projects in the dataset.
   * @param {string} category - The name of the category.
   * @returns {array}
   */
  getProjectsByCategory(category) {
    return this.projects
      .map(project => (project.category === category ? project : null))
      .filter(project => project !== null);
  }

  /**
   * Calculates how many projects in the list are completed.
   * @param {array} list - The list of projects to check for completed status.
   * @returns {number}
   */
  calculateTotalCompleted(list) {
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

  /**
   * Checks how many projects are in the list.
   * @param {array} list - The list of projects.
   * @returns {number}
   */
  calculateTotalProjects(list) {
    return list.length;
  }

  /**
   * Formats the name of the category for DOM representation.
   * @param {string} category - The name of the category in the datastore.
   * @returns {string}
   */
  formatCategoryName(category) {
    const name = category.split(" ").map(word => {
      if (word !== "and" && word !== "or" && word !== "the") {
        return word[0].toUpperCase() + word.slice(1, word.length);
      }
      return word;
    });
    return name.join(" ");
  }

  /**
   * Formats the name of the category so that it can be used as a DOM id.
   * @param {string} category - The name of the category in the datastore.
   * @returns {string}
   */
  formatCategoryId(category) {
    return category.split(" ").join("-");
  }

  /**
   * Creates the DOM representation of the category section.
   * @returns {string} Category DOM element.
   *   <div class="checklist">
   *     <div class="checklist-header">
   *       <h3 class="checlist-title">Numbers</h3>
   *       <span class="checklist-total">0/22</span>
   *     </div>
   *     <ul class="collapsed" id="numbers"></ul>
   *   </div>
   */
  createCategoryElem(category) {
    const categoryTotal = this.calculateTotalProjects(this.getProjectsByCategory(category));
    const categoryTotalCompleted = this.calculateTotalCompleted(this.getProjectsByCategory(category));
    return `<div class="checklist" id="${this.formatCategoryId(category)}"><div class="checklist-header"><h3 class="checklist-title">${this.formatCategoryName(
      category
    )}</h3>${this.createTotalView(categoryTotalCompleted, categoryTotal)}</div><ul class="collapsed"></ul></div>`;
  }

  /**
   * Creates the full DOM representation of all category sections.
   * @param {array} categories - The list of categories in the project list.
   * @returns {string} All Category DOM elements
   */
  createCategoryView(categories) {
    return categories.map(category => this.createCategoryElem(category)).join("");
  }

  /**
   * Creates the DOM representation for the project completion counter.
   * @param {number} current - The current number of projects that are completed.
   * @param {number} max - The number of projects in the list.
   * @returns {string} Total DOM element
   *   <span class="checklist-total">0/22</span>
   */
  createTotalView(current, max) {
    return `<span class="checklist-total ${current == max ? "done" : ""}">${current}/${max}</span>`;
  }

  updateTotalView(category) {
    const max = this.calculateTotalProjects(this.getProjectsByCategory(category));
    const current = this.calculateTotalCompleted(this.getProjectsByCategory(category));
    return `${current}/${max}`;
  }
}

/**
 * Class constructor for the App item
 * Stores data for the entire application
 * @param {string} currentList - The name of the current list displayed in the app.
 * @param {array} projectLists - The projects available to the application.
 */
class App {
  constructor(currentList, projectLists) {
    this._currentList = currentList;
    this._projectLists = projectLists;
  }

  /** 
   * Getter method for the currentList property.
   */
  get currentList() {
    return this._currentList;
  }

  /** 
   * Setter method to update the currentList property.
   * @returns {string}
   */
  set currentList(listName) {
    this._currentList = listName;
    return this.currentList;
  }

  /**
   * Getter method for the projectLists property.
   */
  get projectLists() {
    return this._projectLists;
  }

  /** 
   * Setter method for the projectLists property.
   * @returns {array}
   */
  set projectLists(projectLists) {
    this._projectLists = projectLists;
    return this.projectLists;
  }

  /**
   * Retrieves the index of the projectList within projectLists which matches the listName supplied.
   * @param {string} listName - The name of the list to retreive.
   * @returns {number}
   */
  findProjectIndex(listName) {
    const projectList = this.projectLists.find(
      projectList => projectList.listName.toLowerCase() === listName.toLowerCase()
    );
    return this.projectLists.indexOf(projectList);
  }

  /**
   * Formats the supplied data for storage in localStorage.
   * Makes the data retrievable by the app the next time around.
   * @param {array} projectLists - The projectLists array to format.
   * @returns {array}
   */
  formatProjectsForSave(projectLists) {
    const data = projectLists.map(projectList => {
      return {
        listName: projectList.listName,
        source: projectList.source,
        totalCompleted: projectList.calculateTotalCompleted(projectList.projects),
        projects: projectList.projects.map(project => {
          return {
            text: project.text,
            category: project.category,
            completed: project.completed
          }
        })
      }
    })
    return JSON.stringify(data);
  }

  /**
   * Stores the data in localStorage.
   * @returns {boolean}
   */
  saveDataToLocalStorage() {
    localStorage.setItem('currentList', JSON.stringify(this.currentList));
    localStorage.setItem('projectLists', this.formatProjectsForSave(this.projectLists));
    return true;
  }

  /**
   * Toggles the CSS class that opens and closes a category section.
   * @param {node} elem - The DOM element to manipulate
   * @returns {node}
   */
  toggleCollapsed(elem) {
    if (elem.className === "collapsed") {
      return this.updateClassName(elem, "open");
    }
    return this.updateClassName(elem, "collapsed");
  }

  getCurrentProjects() {
    return this.projectLists[this.findProjectIndex(this.currentList)];
  }

  switchProjectList(listName) {
    this.currentList = listName;
    this.createAppInDom();
  }

  createAppInDom() {
    const currentProjects = this.getCurrentProjects()
    this.setSource(currentProjects);
    this.setTotalView(currentProjects);
    this.setCategoryView(currentProjects);
    this.setProjectsView(currentProjects);
    this.setProjectSelector();
    this.setInteractivity(currentProjects);
  }

  setSource(currentProjects) {
    return this.updateDomLocation('override',
      `<a href="${currentProjects.source}">${this.currentList[0].toUpperCase() +
    this.currentList.slice(1, this.currentList.length)}</a>`,
      "#source"
    );
  }

  setTotalView(currentProjects) {
    return this.updateDomLocation(
      'override',
      currentProjects.createTotalView(
        currentProjects.totalCompleted,
        currentProjects.totalProjects
      ),
      "#totalCompleted"
    );
  }

  setCategoryView(currentProjects) {
    const categories = currentProjects.categories;
    const categoryHtml = currentProjects.createCategoryView(categories);
    return this.updateDomLocation('override', categoryHtml, "#checklists");
  }

  setProjectsView(currentProjects) {
    const categories = currentProjects.categories;
    return categories.map(category => {
      const projectHtml = currentProjects.projects
        .map(project => {
          return project.category === category ? project.createProjectElem() : null;
        })
        .filter(project => project !== null)
        .join("");
      this.updateDomLocation('override', projectHtml, `#${category.split(" ").join("-")} ul`);
    });
  }

  setProjectSelector() {
    const lists = this.projectLists.map(list => list.listName);
    const html = lists.map(list => `<button data-name="${list}">${list[0].toUpperCase() + list.slice(1,list.length)}</button>`).join('');
    this.updateDomLocation('override', html, `#nav__main`);
  }

  setInteractivity(currentProjects) {
    this.handleCompletedToggle(currentProjects);
    this.handleHeaderClick();
    this.handleButtonClick();
  }

  handleCompletedToggle(currentProjects) {
    const uls = document.querySelectorAll('ul');
    return uls.forEach(ul => ul.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') {
        const project = currentProjects.projects.find(project => project.id == e.target.id);
        project.completed = e.target.checked;
        currentProjects.totalCompleted = currentProjects.projects;
        const categoryTotalContainer = ul.parentElement.firstElementChild.querySelector('.checklist-total');
        categoryTotalContainer.innerHTML = currentProjects.updateTotalView(project.category)
        const current = currentProjects.calculateTotalCompleted(currentProjects.getProjectsByCategory(project.category));
        const max = currentProjects.calculateTotalProjects(currentProjects.getProjectsByCategory(project.category));
        if (current === max) {
          categoryTotalContainer.className = "checklist-total done";
        } else {
          categoryTotalContainer.className = "checklist-total";
        }
        if (currentProjects.totalCompleted === currentProjects.totalCompleted) {
          document.querySelector("#totalCompleted span").className = "checklist-total done";
        } else {
          document.querySelector("#totalCompleted span").className = "checklist-total";
        }
        this.setTotalView(currentProjects);
        this.saveDataToLocalStorage();
      }
    }));
  }

  handleHeaderClick() {
    const checklists = document.querySelectorAll('.checklist-header');
    checklists.forEach(list => list.addEventListener('click', e => {
      let target = e.target;
      while (target.className !== 'checklist-header') {
        target = e.target.parentNode;
      }
      this.toggleCollapsed(target.parentNode.querySelector('ul'));
    }));
  }

  handleButtonClick() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.addEventListener('click', e => {
      const target = e.target.dataset.name;
      this.switchProjectList(target);
    }));
    buttons.forEach(button => {
      console.log(this.currentList);
      if (button.dataset.name === this.currentList.toLowerCase()) {
        button.className = "active";
      } else {
        button.className = "";
      }
    });
  }

  /**
   * Updates the DOM with the supplied html.
   * @param {string} command - The controlling command for how to handle the DOM.
   * @param {string} html - The template literal to insert into to the DOM.
   * @param {*} location - The DOM location to update.
   * @returns {function}
   */
  updateDomLocation(command, html, location) {
    if (command === 'override') {
      return document.querySelector(location).innerHTML = html;
    } else {
      let currentHtml = document.querySelector(location).innerHTML;
      currentHtml += html;
      return document.querySelector(location).innerHTML = currentHtml;
    }
  }

  /**
   * Updates the elem's class to the newClass.
   * @param {node} elem - Dom element to update
   * @param {string} newClass - The class name to set.
   * @returns {function}
   */
  updateClassName(elem, newClass) {
    return (elem.className = newClass);
  }
}

/**
 * Initializer object.
 * Retrieves data, sets up the application, and controls interactivity.
 */
const initializer = {
  /**
   * Creates a new instance of a project from the JSON data.
   * @param {object} item - The project object.
   * @returns {object}
   */
  createProject(item) {
    return new Project(item.text, item.category, item.completed);
  },

  /**
   * Creates a new instance of a project list the JSON data.
   * @param {array} list - The project list array.
   * @returns {object}
   */
  createProjectList(list) {
    const projects = list.projects.map(project => this.createProject(project));
    return new ProjectList(list.listName, projects, list.source, list.totalCompleted);
  },

  /**
   * Retrieves data from the API.
   * @returns {object}
   */
  async retrieveDataSource() {
    const baseUrl = "https://technakal.github.io/project-ideas-api/data.json";
    try {
      let response = await fetch(baseUrl);
      let data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Instantiates the app and configures preliminary settings.
   * @returns {object}
   */
  async createApp() {
    let data;
    if (!storageAvailable('localStorage') || localStorage.getItem('currentList') === null) {
      data = await this.retrieveDataSource();
      console.log("Data source is API");
    } else {
      data = await {
        currentList: JSON.parse(localStorage.getItem('currentList')),
        projectLists: JSON.parse(localStorage.getItem('projectLists'))
      }
      console.log("Data source is localStorage");
    }
    const app = new App(data.currentList, data.projectLists.map(list => this.createProjectList(list)));
    if (storageAvailable('localStorage')) {
      app.saveDataToLocalStorage();
    }
    app.createAppInDom();
    return app;
  }
};

const app = initializer.createApp();