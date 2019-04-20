
## App Structure

### Classes

#### Project
Represents a single project idea.

##### Properties: 
* text - Stores the textual description of the project.
* category - Stores the category to which the project belongs. This is not the same as the projectList.
* completed - Boolean value storing whether the user has completed the project.

##### Methods
```js
get text() {
  // returns text description
}

get category() {
  // returns project category
}

get completed() {
  // returns project completion status
}

toggleCompleted() {
  // toggles completed status
}

createProjectView() {
  // returns the DOM representation of the project
}
```

#### ProjectList
##### Properties
* listName - Text value storing the name of the ProjectList.
* projects - Array storing all of the projects in the ProjecTList.

##### Methods
```js
get listName() {
  // returns list name
}

get projects() {
  // returns all projects in the list
}

getCategories() {
  // returns all categories in the list
}

getTotalCompleted(list) {
  // returns the total number of projects marked as completed, based on the submitted list.
  // can be used to get the total completed
  // can be used to get the total completed for a single category
}

createCategoryView(categories) {
  // returns the DOM representation of the category list.
}

createTotalView(total) {
  // returns the DOM representation of the total
  // can be used to return the total completed
  // can be used to return the total completed for a single category
}
```

#### App

##### Properties
* state:
  * currentList
  * projects
  * totalCompleted

##### Methods

```js
set currentList(listName) {
  // sets the currentList to the listName 
}

set projects(projectLists) {
  // sets the projects to the projectLists
}

set totalCompleted(total) {
  // sets the totalCompleted to the total
}

formatForSave(currentList, projects) {
  // formats the currentList and projects for storage as JSON.
  // converts from app data to JSON data
}

saveDataToLocalStorage(data) {
  // saves the data to the localStorage, if available
}

retrieveDataSource() {
  // retrieves state information from localStorage or the data.json file, assuming I can get that to work.
}

updateDomLocation(html, location) {
  // replces the DOM location with the html
}

updateClassNames(elem, newClass) {
  // sets the class of the elem to newClass
}
```

## Data Structure

### JSON

* currentList - Text value storing the default project tracker that the app should display upon loading.
* projectLists - Array storing all project objects.
* listName - Text value storing the name of the current project list object.
* projects - array storing all of the projects in a given list.

```js
{
  "currentList": "listOne",
  "projectLists": [
    {
      "listName": "listOne",
      "source": "urlOne"
      "projects": [
        {
          "text": "Make a party game that allows users to take turns playing mini-games",
          "category": "interactivity",
          "completed": false,
        },
        ...
      ]
    },
    {
      "listName": "listTwo",
      "source": "urlTwo",
      "projects": [
        {
          "text": "Write a workout app that stores user workouts to a database.",
          "category": "database",
          "completed": false,
        },
        ...
      ]
    },
    ...
  ]
}
```

### In-Motion Data

#### Project

```js
{
  text: 'Write a programme which finds the factorial of a number entered by the user. (check for all conditions).',
  category: 'beginner',
  completed: false,
}
```

#### ProjectList

```js
{
  listName: 'baum'
  projects: [
    {
      text: 'Write a programme which finds the factorial of a number entered by the user. (check for all conditions).',
      category: 'beginner',
      completed: false,
    },
    ...
  ]
}
```

#### App

```js
{
  state: {
    currentList: 'baum',
    projects: [
      {
        listName: 'karan',
        projects: [
          {
            text: 'Find PI to the Nth Digit - Enter a number and have the program generate PI up to that many decimal places. Keep a limit to how far the program will go.',
            category: 'numbers',
            completed: false,
          },
          // ...
        ]
      },
      {
        listName: 'baum'
        projects: [
          {
            text: 'Write a programme which finds the factorial of a number entered by the user. (check for all conditions).',
            category: 'beginner',
            completed: false,
          },
          // ...
        ]
      },
      // ...
    ],
    totalCompleted: 2
  } 
}
```