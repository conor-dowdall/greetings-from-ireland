# Conor Dowdall | Full Stack Web Developer

## Greetings from Ireland

A full-stack web project where you can buy an authentic Irish greeting from an authentic Irish person.

### Setting Up The Project

- Start a MySQL server and use the greetings-from-ireland.sql file, in the greetings-from-ireland directory, to create the project database, which is called greetings_from_ireland. This can be done within a MySQL terminal session with the command

```mysql
source path-to-file/greetings_from_ireland.sql
```

or done any other way that your system supports.

- From within the greetings-from-ireland directory
  - use .env.example to create a .env file with the correct information for your system, including
    - SERVER_PORT=“your-preferred-port-number”
      - the server listens on port 5501, by default
    - DB_USER=“your-database-user-name”
    - DB_PASSWORD=“your-database-user-password”
- From within the greetings-from-ireland directory, enter the commands

```bash
npm install
npm start
```

- The server will start listening on the port number defined in the .env file.
- Using a modern web-browser like Chrome of Firefox, navigate to
  - localhost:5501
  - (change 5501 to your preferred port number, if you changed it in .env)

### Using The Website

The website first loads the home page, where a hero section greets you, inviting you to register or login. This functionality is also available in the navigation section, at the top of the page. After a successful login, the user may purchase and then play the audio of “authentic Irish greetings” from “an authentic Irish person”. The greetings were recorded and processed by Conor Dowdall.

### Learning Resources Used

The Complete Nodejs MySQL Login System

- https://www.udemy.com/course/the-complete-nodejs-mysql-login-system/
- created by Telmo Sampaio
- from Udemy

Following this excellent course, the Greetings from Ireland project implements a fully-functional registration-and-login system, backed by a MySQL database, which stores user information in a users table, including salted and hashed passwords, for up-to-date password security in case of a website breach.

The project serves cookies to the browser for persistent user logins and automatically redirects the login and registration pages to the profile page, if a user is logged in.

### Theming

The colors of the Irish flag were used throughout the website, to give it a consistent look and feel. This was aided by the use of CSS custom properties (variables), defined in the html section of style.css, located in the style directory inside the public directory for the project, which propagate down through the whole site.
All images used in the project were sourced from Pixabay (https://pixabay.com/), under the Pixabay Content License (https://pixabay.com/service/license-summary/), and each image used has an author attribution in the footer of the page it resides in.

### Register, Login, Logout

Using the navigation at the top of the home page, or the hero section links, a new user is encouraged to register on the website. This stores their details persistently in the database, for future logins. Passwords are salted and hashed, following instructions to use the bcrypt package on npm, as instructed by The Complete Nodejs MySQL Login System and Web Dev Simplified. No email verification is performed, and is maybe something that could be done in future versions of the project.

After registration, the user is redirected to the login page and encouraged to login to the website using the email address and password they provided at registration. There are no accounts set up in the blank project, so you are encouraged to register an account, before attempting to login. The database can always be wiped clean by running or importing the greetings-from-ireland.sql script, as outlined in the section: Setting Up The Project. This script drops all tables if they exist before creating them again.

An express Router is imported into app.mjs from the auth-route.mjs javascript module in the routes directory. This handles any authentication-related tasks, such as a post request on /login or /register, or a get request on /logout. This javascript module imports functions from the auth-controller.mjs javascript module in the controllers directory, and these functions perform relevant database queries (using mysql-pool-controller.mjs), and cookies-related tasks, for setting up the account and logging in-and-out.

One departure from the learning material, that this project uses is the use of ES modules, rather than Node’s default CommonJS modules. This is marked in the package.json file in the main project directory using "type": "module" and presented several obstacles, which were overcome with help from various internet forums such as Stack Overflow (https://stackoverflow.com/).

#### auth-controller.mjs – register

- **gets** the details passed from the form, via req.body
- **checks** if the email is already registered in the users table and, if so, responds by loading the register page again, using status 401, displaying an appropriate message
- **checks** if the two passwords supplied match and, if not, responds by loading the register page again, using status 401, displaying an appropriate message
- **inserts** the new user data, with a salted and hashed password into the users table
- **loads** the login page with the newly created email pre-filled in

#### controllers – login

- **checks** if the password or email fields are empty and, if so, responds by loading the login page again, using status 401, and displaying an appropriate message
- **verifies** that the email matches to a registered user and, if not, responds by loading the login page again, using status 401, and displaying an appropriate message
- **compares** the password supplied with the stored (hashed) password, by using bcrypt’s compare function and, if they don’t match, responds by loading the login page again, using status 401, and displaying an appropriate message
- **generates** a cookie to be used for authentication until the user logs out or the cookie expires and redirects the user to their profile page

#### controllers – logout

- **overwrites** the authentication cookie, sets its expiry to Date.now(), and redirects to the home page using status 200

### Form Validation Using HTML

Form validation is performed by the browser on the client side and the form cannot be submitted if all the required fields (all of them) are not filled in. The browser attaches an appropriate message to the relevant input upon an invalid submission.

This is achieved using the “required” boolean attribute in the form’s inputs. The browser also does validation on the text in the email field and the form cannot be submitted if this doesn’t match the expected form of an email address. This is done for the login and register forms, as well as the email-subscribe form on the home page.
