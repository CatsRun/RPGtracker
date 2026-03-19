CSE341 project framework
Dependencies:
Npm init --y
npm install express --save
create .gitignore
npm install nodemon --save-dev
In package.json added: "start": "nodemon index.js"
npm install mongodb
npm install dotenv --save
npm install --save-dev swagger-autogen
npm install --save validate.js
npm install passport-google-oauth20

create files: swagger.js, .gitignore, .env, readme.md, index.js
create files controllers, db, middleware, routes,

To install dependencies: npm install
To start the program: npm start

Login:
/auth/google

Test:
/api/characters (data should pull up, if any)

Logout:
/auth/logout

Test:
/api/characters ("not authenticated")
