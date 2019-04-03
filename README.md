# Magic Maze

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ddf7d97e9d2a44d6b15d8b0db34820e0)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=UTSCC09/project-magicmaze&amp;utm_campaign=Badge_Grade)
[![CircleCI](https://circleci.com/gh/UTSCC09/project-magicmaze.svg?style=shield&circle-token=919148bff631b86af81101d8abf73ca8d070f8a2)](https://circleci.com/gh/UTSCC09/project-magicmaze)

A game based off of the cooperative table-top game _Magic Maze_

Web-implementation developed by the team of:

- Kevin Zhang
- Rakin Uddin
- Stephen Luc

---

### URLs

Application: [magicmaze.me](https://magicmaze.me)

Youtube Video: https://www.youtube.com/watch?v=JBg4oSQp03k

### Overview

[Magic Maze](https://boardgamegeek.com/boardgame/209778/magic-maze) is a real-time cooperative table-top game. Our implementation of the game will be for only 4 players and features the main, simplest "scenario" of the game. 

The game is made up of four characters who are searching for a unique item associated to their character within the maze. Upon obtaining all of their items, they all must escape the maze by reaching the appropriate exit before time runs out. Each player can control any of the characters but can only make them perform 1 to 2 actions in the maze.

## Technology stack

### Frontend architecture

Our frontend stack is comprised of the following technologies:

- React
  - General user interface building
    - Utilization of components (stateless and stateful)
    - Handling interactivity between components
- Redux
  - General state management
    - **Game state**: information related to playing the actual game
      - Examples: character locations, maze tile locations, vortex status, ...
    - **User states**: information related to users on the application
      - Examples: login authentication, user actions in the game, lobbies, ...
- PixiJS
  - Rendering and manipulation of sprites in the actual game
    - Examples:
      - Rendering and handling of character objects in coordination with spritesheet
      - Event handling based on user interaction on stage and elements on stage
        - i.e. moving characters, selecting characters, ...
      - General visual interactivity (e.g. scrolling and panning the stage)
- Apollo client
  - Interaction with backend for data transfer using GraphQL
    - Data querying and manipulation
      - Handling publisher/subscriptions, GraphQL queries, and GraphQL mutations
      - Alternative to traditional RESTful API
- Frontend component frameworks:
  - Bootstrap
    - General components across the application
      - Examples: modals, cards, buttons, forms, badges, ...
  - Fontawesome
    - General icons across the application
  - Toastify
    - Short messages to alert the user
      - Examples: game state changes, form entry, ...

Many of the technologies in our stack were chosen due to prior knowledge and use such as React and the majority of the frontend component frameworks

Our team chose to use **PixiJS** for the rendering of the game components primarily for the ease of rendering and manipulation of large masses of graphical images from a spritesheet. In addition to this, our team was interested in the functionality of a separate viewport from the canvas stage in order to pan and zoom the stage to accomodate for the procedurally generated maze which PixiJS provided with the `pixi-viewport` library

Our team chose to use **Apollo client** in conjunction with **GraphQL** as more efficient strategy of querying for data from large objects with many unused properties. As an example, we often query for certain parameters of a game state while the game state can hold many properties. Using GraphQL, we can select for exactly the properties we want from a large object (like a game state) in a single request where as a traditional RESTful API would request the entire object and typically be less performant due to overfetching

### Backend architecture

Our backend stack is made up of the following technologies:

- NodeJS
  - A single purpose web server that allows communication between the frontend and the database while performing most of the computation
  - Since it's written in JavaScript there is a lot of packages that can be imported to help perform many tasks 
- MongoDB
  - A NoSQL database which stores its objects in a JSON-like format
    - Allows for custom objects to be built easily
- GraphQL
  - A querying langauge that allows for a single request to access several objects which can be nested together
  - Can be quick to retrieve data even on slow networks
- Apollo Server
  - Allows for interaction between the backend and the database
    - Data querying and manipluation
      - Creation of the queryies, mutations and subscriptions which are used in Apollo Client
- Firebase
  - A secondary database which is used for storing and authenticating user upon registering and logging in

Many technology in this stask was also chosen due to prior knowledge such as NodeJS, MongoDB and Firebase. While GraphQL was chosen because of our interest to learn more about it and try it out.

Our team chose to use **GraphQL** mainly because we wanted to try it out and gain practical experience using it. It made querying data extremely simplistic especially since we are usually getting many nested objects. Using the traditional RESTful API, we would of needed to make multiple requests to the backend to retrieve all the this data. However, using GraphQL allowed us to make a single request and send back a single response with all the information. This also goes along with using **Apollo Server** since were using Apollo Client on the frontend.

### Deployment architecture

Our deployment stack is made up of the following technologies:

- Docker
  - An application to containerize your application into modular, reusable components. This enables the application to be more flexible since the application can be deployed separately as well as onto other platforms like Amazon Web Services or Google Cloud Platform
- Heroku
  - A hosting service for applications. One can deploy an application onto Heroku through the CLI or the web interface

As with the backend and frontend stacks, these technologies were chosen due to prior experience with them. The benefit of using Heroku is its ease of use to host applications. It is also very configurable because you can add custom hostnames and plugins.

---

## Technical challenges

The technical challenges we faced in this project were as follows

### Concurrency

Each player has control of all the characters at all times. Because of this, we need to avoid race-conditions between provided actions between players and keep the state of all characters known to all the players in the game. To do so, we added needed a way of keeping the states of all the game consistent across all players as well as utilizing a mechanism to lock characters when a player requests to perform an action as well as unlocking the character after an action has been performed. It was a challenge to place and remove locks as needed as well as keeping their states consistent across all players in the game

### Consistency

Having 4 concurrent users in the game, we were faced with the challenge of ensuring that the views of all four users were up to date with the given state in all points of the application. This was accomplished using publisher / subscriber components to listen for and push updates to all listening clients in the application. Consistency was found to be required in nearly all aspects of the application ranging from the lobbies (keeping lobby lists and current lobbies up to date) as well as during the game state (keeping the game view up to date on all clients). In addition to this, we were faced with the challenge of keeping the timer up to date across all clients given that the game revolves around a central timer

### Sessions

Since our application primarily revolved around separate actions across separate users, we faced the challenge of appropriately assigning states and actions across the various logged in sessions of our application. This ranged from ensuring that players could only perform their appropriately assigned actions in the game to general lobby management with users creating / destroying lobbies as well as general user management and tracking. Our team faced the challenge of keeping track of and effectively manipulating the concurrent users on the application across all their possible states

### GraphQL

Not having used GraphQL in the past, our team was faced with the challenge of its use in place of traditional RESTful APIs. Error handling in particular was challenging with GraphQL in contrast to traditional RESTful APIs as GraphQL always returns HTTP codes of `200` regardless of whether or not the query was successful or not. This lead to making it more difficult to perform error handling given the added complexity of constantly monitoring responses in the event of an error. In addition to this, general debugging became more of a chore as the error handling at times was not particularly obvious
