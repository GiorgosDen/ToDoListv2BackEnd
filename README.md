# TaskMaster Backend App (v2)
A REST API built with Node.js and following the MVC (Model-View-Controller) architecture. This backend serves as a core component of the Full-Stack [ToDoList v2 App](https://github.com/GiorgosDen/ToDOListv2).

---

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Security:** bcrypt (password hashing), JSON Web Tokens (JWT) for authorization
* **API Testing:** Thunder Client

---

## Security & Architecture
* **Password Hashing:** User passwords are securely hashed using the bcrypt library.
* **Token-Based Auth:** JSON Web Tokens (JWT) are used for user authorization to protect routes and manage user data.
* **Unique Identifiers:** User emails and IDs are strictly enforced as unique identifiers.

---

## Features & Functionalities
### User Management
* **Sign Up:** Public route allowing new users to register in the system.
* **Login:** Authenticate using an email and password to receive an access JWT.
* **Update:** Protected route allowing authorized users to update their profile information.
* **Deregister:** Option to remove a user account from the system.
### Task Management
* **Daily Task Management:** Real-time state management for creating, completing, and deleting tasks.
* **Task Status Engine:** Automatic status calculation (Pending, Completed, Expired) based on due times.
* **Task Categories:** Organize tasks using custom categories.
* **Task Priorities:** View detailed priority levels for tasks.

## Environment & Configuration
Configuration managed via **.env** variables for database connections and CORS options.

## Roadmap
[ ] Implement TaskCategory Router, Controller, and Model.
[ ] Add Priority view logic.

---
*Developed by Giorgos Den.*

