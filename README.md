Task Manager App
================

A React-based task management application that allows users to add, edit, delete, and organize tasks based on priority levels. The app utilizes drag-and-drop functionality to rearrange tasks between High, Medium, and Low priority columns.

Table of Contents
-----------------

-   [Features](#features)
-   [Demo](#demo)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Technologies Used](#technologies-used)
-   [Contributing](#contributing)
-   [License](#license)

Features
--------

-   **Add Tasks**: Create new tasks with a title, description, and priority level.
-   **Edit Tasks**: Modify existing tasks through an intuitive interface.
-   **Delete Tasks**: Remove tasks with a confirmation prompt to prevent accidental deletions.
-   **Drag and Drop**: Reorder tasks and move them between priority columns using drag-and-drop functionality.
-   **Local Storage Persistence**: Tasks are saved in the browser's local storage, allowing data to persist between sessions.
-   **Expand/Collapse Tasks**: Toggle task details for a cleaner view.



Getting Started
---------------

### Prerequisites

-   **Node.js** (version 12 or higher)
-   **npm** (version 6 or higher)

### Installation

1.  **Clone the repository:**

    `git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name`

2.  **Install dependencies:**

    `npm install`

Usage
-----

1.  **Start the development server:**

    `npm run dev`

2.  **Open the application in your browser:**

    `http://localhost:3000`

3.  **Interact with the app:**

    -   Click the **Add** button (plus icon) to create a new task.
    -   Fill out the form with the task's title, description, and select a priority level.
    -   The new task will appear in the corresponding priority column.
    -   Click on a task to expand or collapse its details.
    -   Use the **Edit** button to modify a task.
    -   Use the **Delete** button to remove a task (a confirmation dialog will appear).
    -   Drag and drop tasks between columns to change their priority.

Project Structure
-----------------

-   **Main.js**: The entry point of the application. It renders the `App` component within the `ChakraProvider` for theming.
-   **App.js**: The main component that manages the state of tasks, including adding, editing, deleting, and handling drag-and-drop events.
-   **PriorityColumn.js**: Represents each priority column (High, Medium, Low) and renders tasks belonging to that priority.
-   **TaskCard.js**: Displays individual tasks with options to expand details, edit, or delete.
-   **FormContainer.js**: Contains the form for adding new tasks, implemented as a drawer for better UX.
-   **components/**: Directory containing components like `PriorityColumn`, `TaskCard`, and `FormContainer`.

Technologies Used
-----------------

-   **React**: JavaScript library for building user interfaces.
-   **Chakra UI**: A simple, modular, and accessible component library for React.
-   **@hello-pangea/dnd**: A drag-and-drop library for React applications.
-   **Local Storage**: Used to persist tasks between browser sessions.
-   **CSS Modules**: Scoped CSS styling for components.