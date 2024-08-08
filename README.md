![SQLearn Logo](https://github.com/dokjons/SQLearn/blob/main/static/fav/android-chrome-192x192.png?raw=true)
# SQLearn

## Overview

SQLearn is an interactive web application designed to help users learn and practice SQL (Structurec Query Language) in a fun and engaging way. It provides a safe enviroment for users to execute SQL commands, complete tasks, and improve their understanding of SQL syntax and operations.

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Learning Outcomes](#learning-outcomes)
4. [Contributions](#contributions)
5. [License](#license)
6. [Made By](#made-by)
7. [Contact](#contact)

## Features

### 1. Interactive SQL Sandbox
- Users can write and execute SQL queries in a safe, controlled enviroment.
- Supports various SQL commands including `SELECT`, `INSERT`, `UPDATE`, and more.

### 2. Task-Based Learning
- Users can accept tasks that challenge them to execute specific SQL commands.
- Each task includes:
    - A description of the task.
    - The expected SQL query that users should write.
    - Hints to guide users through the task.

### 3. Task Tracking
- Users can keep track of the tasks they have completed.
- A database maintains user progress, allowing them to revisit tasks and see their learning journey.

### 4. SQL Command List
- A comprehensive list of SQL commands is available, providing descriptions, examples, and usage guidance.
- Users can search for specific commands to quickly find relevant information.

### 5. Customizable Enviroment
- Users can switch between light and dark themes.
- The application allows for a rich coding experince with syntax highlighting and code suggestions.

### 6. Random User Generation
- The app includes a feature to generate random user data, providing a realistic dataset for users to practice SQL queries.
- A feature to reset the database to default is also included, allowing the user to start from scratch.

## Getting Started

1. **Installation**:
    - **For Windows Users**:
        - Option 1: Download the ZIP file from the [latest release](https://github.com/dokjons/SQLearn/releases).
            1. Extract the ZIP file.
            2. Navigate to the extracted project directory.
            3. Run the SQLearn.exe file.<br>
            _(Some antiviruses will go off, note this is a false positve)_
        - Option 2: Use the command line, similar to macOS/Linux:
            ```bash
            git clone https://github.com/yourusername/SQLearn.git
            cd SQLearn
            ```
    - **For macOS/Linux Users**:
        ```bash
        git clone https://github.com/yourusername/SQLearn.git
        cd SQLearn
        ```
    - Create a virtual enviroment (Optional but recommended):
        ```bash
        python venv venv
        ```
    - Install the required dependencies using pip:
        ```bash
        pip install -r req.txt
        ```

2. **Setup**:
    - Start the Flask server by running the `app.py` script to launch the application:
        ```bash
        python app.py
        ```

3. **Using SQLearn**:
    - Navigate to the application in your web browser: `127.0.0.1:5000`.
    - Start exploring SQL commands, accept tasks, and practice writing SQL queries in the sandbox.


## Learning Outcomes

By using SQLearn, users will:
- Gain a solid understanding of SQL syntax and operaions.
- Learn how to interact with databases using SQL commands.
- Develop problem-solving skills by completing tasks.
- Be able to write efficient SQL queries for data manipulation and retrieval.

## Contributing

Contributions to SQLearn are welcome! Feel free to submit issues or pull requests on the GitHub repository.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Made By

This project was created by [dokjons](https://github.com/dokjons)

## Contact

For any inquires or feedback, please reach out to me on the GitHub repo.
