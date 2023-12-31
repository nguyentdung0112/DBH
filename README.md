# DBH

In the project directory, you can run: 
- open terminal: cd be
+ BE:
npm run devStart
- open terminal: cd my-react-app
+ FE:
npm start
- Runs the app in the development mode.
Open http://localhost:4000 to view it in your browser.

You need to change the data in the sequelize file to match your mysql account
in sequelize.js: 
- const port = {yourPort};
- const user = "root";
- const password = "{yourPassword}";

You also need to use POSTMAN to fake data for the website:
createAccountAdmin and fake data room
- I have already written these 2 APIs in BE/src/controllers
