#  React Webshop — Fullstack E-commerce Project

A full-featured, modern webshop built with **React** on the frontend and **Node.js**, **Express**, and **MariaDB** on the backend. The project uses **Sequelize** as an ORM to manage SQL-based data efficiently. The architecture follows a clean, modular service-based structure, making it scalable, maintainable, and easy to extend.

---

##  System Architecture Overview

![Architecture Diagram](./path/to/your/image.png) <!-- Update with actual image path or use raw GitHub URL if hosted -->

###  Architecture Breakdown
- **Frontend**: React + Tailwind CSS
- **API Layer** (`Express`)
  - `app.js` connects routes and middleware.
  - `userRoutes` and `productRoutes` handle incoming API requests.
- **Service Layer**
  - `userService` and `productService` process logic and forward queries to the database layer.
- **Sequelize Models**
  - Models define the schema and handle relationships with MariaDB.
- **Database**: **MariaDB** (via Sequelize)

---

##  Database & Sequelize Models

###  Database: MariaDB

The project uses **MariaDB**, a robust, open-source SQL database system ideal for transactional applications and large data operations.

###  Sequelize ORM

All database interactions are abstracted using Sequelize, which allows:
- Defining models for tables
- Auto-generating queries
- Managing associations (e.g. one-to-many, many-to-many)

###  Database Tables

- `user`: Stores user data (ID, name, email, password)
- `products`: Contains all product information
- `cart`: Maps users to products with quantities
- `rating`: Handles product reviews and ratings

###  Relationships

- **user ↔ cart**: One-to-many
- **user ↔ rating**: One-to-many
- **product ↔ rating**: One-to-many
- **cart ↔ products**: Many-to-many via cart table

---

##  Key Features (Frontend)

###  Core User Flow
- Browse products with dynamic rendering
- Add/remove items to/from cart
- View product details
- Adjust item quantities
- Cart persists across app views

###  Cart System
- Managed by `CartContext` (React Context API)
- Real-time updates across components
- Sidebar and navbar badge stay in sync

###  Smart Component Design
- `Navbar`, `CartSidebar`, `CartItems`, and `UserDropdown` extracted into separate reusable components
- Clean state flow: no prop drilling

###  Image Pathing
- Product images are referenced by filename only (e.g. `flower.jpg`)
- Frontend resolves them as full URLs (e.g. `http://localhost:3001/images/flower.jpg`)

---

##  Backend API

### Folder Structure

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
