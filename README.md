This project is a test assignment for ShakaCode.com

The application allows user to register (or login if already registered). 
If the user is an admin he can see and edit the list of all users (on the Admin page).
If user is not an admin he can just see a Home page.

The application consists of two parts:
- Back-end part (server folder) is a REST API which uses Python 3, Flask framework with Flask-RESTful and MongoDB to store the data.
- Front-end part (client folder) is a SPA application created with React 16, Redux and Typescript.

JWT authorization is used to pass user credentials between client and server.

## Back-end

To run the back-end use this command line in the server folder: 
```sh
python run.py
```

It launches Flask web server usually accessible on [http://localhost:5000](http://localhost:5000).


You can configure the back-end by editing config.py file. You can set the MongoDB connection string (you can use a local server or a MongoDB Atlas cloud based server).

The back-end uses PyMongo MongoDB driver and Flask-JWT-Extended/PyJWT library to work with JWT.

The JWT part was inspired by [this tutorial](https://codeburst.io/jwt-authorization-in-flask-c63c1acf4eeb). Please note all admin-specific API endpoints (the ones used from the Admin page) are secured - the JWT token used to access them should be created for the user in Admin role.

## Front-end

The front end is a React application created with the create-react-app (CRA) script so all usual shell commands are available to run the application:

- `npm start`
Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- `npm test`
Launches the test runner in the interactive watch mode.

- `npm run build`
Builds the app for production to the `build` folder.

The front-end can be configured (used .env file) to use a non-standard API host address.

The front-end uses reactstrap package (Bootsrtap wrapper) for styling, react-router package to navigate through application pages, redux/redux-thunk package for state management and the grid from the primereact component library.


**Warning: While back-end support JWT refresh token and has an appropriate endpoint the front-end does not support token renewal (due to the lack of time).**
