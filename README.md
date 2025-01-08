# Ezbob-task#

## Getting Started

This project contains both frontend and backend components. Follow the instructions below to set up and run the project.

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
    ```sh
    git clone git@github.com:Si3r4dz/Ezbob-task.git
    cd Ezbob-task
    ```

2. Install dependencies for both frontend and backend:

    ```sh
    # Navigate to backend directory and install dependencies
    cd BE
    npm install

    # Navigate to frontend directory and install dependencies
    cd ../FE
    npm install
    ```

### Running the Project

1. Start the backend server:

    ```sh
    cd BE
    npm run dev
    ```

    The backend server will start on `http://localhost:3001`.

2. Start the frontend development server:

    ```sh
    cd ../FE
    npm start
    ```

    The frontend application will start on `http://localhost:3000`.

### Running Tests

To run the tests for the frontend:

```sh
cd FE
npm test
```