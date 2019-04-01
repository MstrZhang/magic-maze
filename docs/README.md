# Magic Maze Instructions

## Game Description

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
