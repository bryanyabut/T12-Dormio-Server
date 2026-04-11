# Dormio server (Backend API)

<p align="center">
  <img src="assets/dormio_api.jpg" alt="Dormio App Screenshot" width="400"/>
</p>

A backend API for Dormio mobile app that handles the authentication, meal planning, maintenance request, chore assignment, 
budgeting, profile management, scheduling assignment, and push notifications.

## Table of Contents

*   [Getting Started](#getting-started)
*   [Installation](#installation)
*   [Usage](#usage)

---

### Built With

* [![JavaScript](https://img.shields.io/badge/JavaScript-ES6-%23F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [![Node.js](https://img.shields.io/badge/NODE.JS-24.3.0-%23339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
* [![Express](https://img.shields.io/badge/EXPRESS-5.2-%23000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
* [![Prisma](https://img.shields.io/badge/PRISMA-6.19.2-%232D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
* [![PostgreSQL](https://img.shields.io/badge/POSTGRESQL-18.1-%23336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Dependencies
[![CORS](https://img.shields.io/badge/CORS-enabled-brightgreen)](https://www.npmjs.com/package/cors)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.2-blue?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey?logo=express&logoColor=black)](https://expressjs.com/)
[![nodemon](https://img.shields.io/badge/nodemon-3.1.11-blueviolet?logo=nodemon&logoColor=white)](https://www.npmjs.com/package/nodemon)
[![dotenv](https://img.shields.io/badge/dotenv-17.3.1-lightgrey?logo=dotenv&logoColor=black)](https://www.npmjs.com/package/dotenv)
[![morgan](https://img.shields.io/badge/morgan-1.10.1-orange)](https://www.npmjs.com/package/morgan)
[![bcrypt](https://img.shields.io/badge/bcrypt-6.0.0-blue?logo=node.js&logoColor=white)](https://www.npmjs.com/package/bcrypt)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-9.0.3-yellowgreen)](https://www.npmjs.com/package/jsonwebtoken)
[![Firebase](https://img.shields.io/badge/Firebase-13.7.0-yellow?logo=firebase&logoColor=black)](https://firebase.google.com/)



## Getting Started

git clone https://github.com/bryanyabut/T12-Dormio-Server.git

### Installation

Step-by-step instructions on how to install and set up the project.
1.  Clone the repository:
    ```sh
    git clone https://github.com/bryanyabut/T12-Dormio-Server.git
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Create your .env file
4.  Enter your env variables in `.env`:
    ```javascript
    DATABASE_URL="YOUR DB URL";
    NODE_ENV="development"
    PORT="YOUR PORT"
    JWT_SECRET="YOUR JWT SECRET"
    JWT_EXPIRES_IN="EXPIRATION OF JWT"
    ```
5.  Run prisma migration
    ```sh
    npx prisma migrate dev
    ```
6.  Run prisma genarate
    ```sh
    npx prisma generate
    ```
7.  Seed data to your postgresql db
    ```sh
    npx prisma db seed
    ```

## Usage

* Run npm start
  ```sh
  npm start
  ```



## installation steps
- npm install
- npx prisma generate