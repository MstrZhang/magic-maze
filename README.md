# Magic Maze

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ddf7d97e9d2a44d6b15d8b0db34820e0)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=UTSCC09/project-magicmaze&amp;utm_campaign=Badge_Grade)

A game based off of the cooperative table-top game _Magic Maze_

Web-implementation developed by the team of:

- Kevin Zhang
- Rakin Uddin
- Stephen Luc

---

## Project Description

### Overview

[Magic Maze](https://boardgamegeek.com/boardgame/209778/magic-maze) is a real-time cooperative table-top game. Our implementation of the game will be for only 4 players and features the main, simplest "scenario" of the game.

The game is made up of four characters who are each searching for a unique item associated to their character within the maze. When all four characters obtain all of their items, they must all "escape" the maze by reaching the appropriate "exit" associated with each character. All four characters start randomly on the starting maze pieces and extend the maze by "searching" for new maze pices.

The game is "won" if the characters all obtain their items within the given time limit of 3 minutes. The game is lost if the characters are unable to accomplish the above task in the alloted time limit. 

The players are unable to communicate with one another during regular play but can "ping" other players indicating that they wish them to perform an action. The players may however communicate with one another if they utilize a **TIME SQUARE** which is described later in the next section

### Playing the Game

Each of the four players of the game is randomly given 1 or 2 "actions" which they can apply to any of the characters in the maze given that the action is "legal". There are 7 actions in total which are:

1. Move character **UP**
2. Move character **DOWN**
3. Move character **LEFT**
4. Move character **RIGHT**
5. **SEARCH** for a new tile in the maze 
6. Use a **VORTEX**
7. Use an **ESCALATOR**

Description of Actions:

- The first four actions are trivial and move pieces in one of the four cardinal directions. This action is legal as long as there is not a wall in between the initial and final destination (i.e. characters cannot move through walls)
- The **SEARCH** action extends the maze by adding a new maze piece. The maze pieces line up accordingly to their **OUT SQUARE** and **IN SQUARE** indicated on the maze pieces. Each maze piece can have a variety of "squares" that will be described later in then ext section.
- The **VORTEX** action allows an appropriately coloured character standing on an appropriately coloured **VORTEX SQUARE** to teleport to any other revealed vortex of the same colour. When all the characters obtain all their unique items, the **VORTEX SQUARES** all become disabled and cannot be used for the remainder of the game.
- The **ESCALATOR** action allows a user standing on an **ESCALATOR SQUARE** to move to the attached **ESCALATOR SQUARE**. This action is similar to a vortex however the **ESCALATOR SQUARES** are physically attached

### Types of Squares

There are 11 types of squares in the game:

1. Floor
2. Wall
3. Unique Item
4. Vortex
5. Escalator 
6. Search
9. Exit
10. Time
11. In/Out

Description of squares:

- A **FLOOR SQUARE** indicates a space that a character can occupy. A character's movement action is considered to be legal if every square the character passes through is a **FLOOR SQUARE**
- A **WALL SQUARE** indicates a space that a character cannot occupy. A character's movement action is considered to be illegal if there exists a square that the character must pass through that is a **WALL SQUARE**
- A **UNIQUE ITEM** is one of the four unique items in the game that each character must obtain. Each **UNIQUE ITEM** is colour-coded with the four characters in the game and only the appropriate character may obtain the item.
- A **VORTEX SQUARE** allows the character to use the **VORTEX ACTION** as described earlier. They are colour-coded as well similarly to the **UNIQUE ITEM**. A character may occupy the **VORTEX SQUARE** without using the **VORTEX ACTION** and may also occupy a **VORTEX SQUARE** of an inappropriate colour (but they cannot use the **VORTEX ACTION**). After obtaining all the unique items, all **VORTEX SQUARES** become disabled for the remainder of the game.
- An **ESCALATOR SQUARE** allows the character to use the **ESCALATOR ACTION** as described earlier. These squares are not colour-coded and can be used by any character given that the player has the **ESCALATOR ACTION**.
- The **SEARCH SQUARE** allows the player with the **SEARCH ACTION** to extend the maze and "search" for a new maze tile.
- The **EXIT SQUARE** is required to complete the game. All **EXIT SQUARES** are colour-coded similarly to the other squares above. After obtaining all unique items, all players must reach their appropriate **EXIT SQUARE**. Accomplishing this before the allotted time ends is considered a victory for the player.
- The **TIME SQUARE** extends the allotted time by 2 minutes. During this period of time, the players are allowed to communicate with one another (via messaging) until they perform a player action (e.g. movement, vortex, etc...). Once a **TIME SQUARE** is used, it becomes disabled and that **TIME SQUARE** cannot be used for the remainder of the game.
- The **IN/OUT SQUARES** indicate how the maze tiles need to be lined up when a **SEARCH ACTION** is performed. They serve no purpose gameplay-wise.

### Non-gameplay Features

Before starting a game, players will have to register an account and can either create or join a running lobby. Once a lobby reaches 4 players, the players can initiate the game and begin playing as described above.

When the players are in the lobby or have the ability to communicate via the **TIME SQUARE**, a chat service will be enabled and the players may communicate with one another via instant messaging.

---

## Features of Beta Version

For the beta version, we are aiming to complete the basic game functionality for only a single player. Overall, our team is aiming to accomplish the following tasks:

- Having basic game functionality for a single player
    - Ensuring that all the game mechanics work for a single player
        - Character movement
        - Special movement (e.g. vortex warping, escalator movement, maze searching, etc...)
        - Synchronization with a single player and the timer
    - Ensuring that maze generation works for a single player
        - Ensuring that maze tiles line up after being searched
        - Ensuring that the whole maze renders properly for a single player

Overall, we will aim to develop a playable game for a single player and leave networking challenges to be completed for the final version

---

## Features of the Final Version

For the final verison, we are aiming to complete the rest of the functionality for the game being the implementation of all 4 players playing concurrently as well as services such as the lobby and chat services and functionality. Overall, we are aiming to accomplish the following tasks:

- Having 4-players implemented:
    - Ensuring that all 4-players can move pieces and act concurrently
    - Ensuring that the game still operates as it did before but with 3 additional players
- Chat service functionality:
    - Having chat functionality in the lobby
    - Having chat functionality in game when granted the ability by the **TIME SQUARE**
    - Pinging other players to indicate that you wish for them to make an action
- Lobby functionality:
    - Allowing players to create lobbies
    - Allowing players to join open lobbies
    - Allowing players to create games in different lobbies

---

## Technology Stack

Our proposed technology stack is outlined as follows:

**Front-end technology:**

- React
    - Frontend framework
    - Used for user interface, client-side scripting, etc
- Redux
    - Used for client-side state management (e.g. managing game states for each client)

**Back-end technology:**

- NodeJS
    - Handles backend functionality
    - Handles API calls
- GraphQL
    - Application querying language
    - Will use in place of RESTful communication
    - Can return selective amounts of content in a single request without much overhead
        - Useful for returning game states to all clients

**Database technology:**

- MongoDB
    - Maze tiles will be stored in 2D JSON arrays
    - Having a NoSQL database will be advantageous when working with reading and writing lots of JSON data

**Deployment technology:**

- Kubernetes
    - Use for deployments and container orchestration to ensure high availability/scalability
- Docker
    - Containerize each component of the application to ensure modularity and reusability

---

## Top 5 Technical Challenges

The top 5 technical challenges we face in this project are as follows:

1. Concurrency
    - Each player has control of all the characters at all times
        - Need to avoid race-conditions between provided actions
    - A character must be "locked" when a player wants to perform an action and unlocked when the action is performed
2. Expanding the maze
    - Each maze tile will come from a database of maze tile layouts that will be picked randomly
    - When a **SEARCH ACTION** is performed, the maze needs to extend appropriately by lining up the **IN/OUT SQUARES**
3. Consistency
    - Each player needs to have an up-to-date state of the maze
    - When actions are performed, every player needs to receive the updates quickly and at the same time
    - Each player needs to be in sync with the in-game timer as well
4. Messaging Service
    - Messaging needs to be instant and fast between the players during situations where they can chat with one another
        - Players need to be able to chat with one another in the lobby or when granted the ability by the **TIME SQUARE**
5. Sessions
    - Implementation of the join-able lobbies
        - Lobbies become locked after 4 players enter them
        - Lobbies are associated with the players by their login sessions
