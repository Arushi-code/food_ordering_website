# 🍔 FEASTO — Food Ordering Website

**FEASTO** is a full-stack food ordering web application that allows users to discover restaurants, explore menus, add food to their cart, place orders, track order status, save favorite restaurants, and participate in group food ordering.

The application also includes an **admin dashboard** for managing restaurants and orders.

---

## 🌐  Live project link
https://feasto-h2st.onrender.com

---


## 🌟 Features

### 👤 User Authentication

* User Registration
* User Login
* JWT-based authentication
* Protected routes
* User profile management
* Password update support

### 🍽️ Restaurant Discovery

* Browse available restaurants
* View restaurant details
* Explore restaurant menus
* View food descriptions and prices
* Restaurant ratings
* Food categories and tags
* Estimated delivery time

### 🔎 Food Discovery

* Browse different cuisines
* Vegetarian and non-vegetarian options
* Healthy and vegan food options
* Desserts and bakery items
* Burgers, pizza, sushi, Mexican, Chinese, Indian and Korean cuisines

### 🛒 Cart & Ordering

* Add food items to cart
* Manage cart items
* Place food orders
* Calculate total order amount
* Secure order creation for logged-in users

### 📦 Order Tracking

Users can track their order through different stages:

`Order Placed → Preparing → Out for Delivery → Delivered`

The backend also supports automatic order-status progression for demonstration purposes.

### ❤️ Favorites

* Save restaurants to favorites
* Remove restaurants from favorites
* View favorite restaurants from the user profile

The favorites functionality is implemented through protected user routes.

### 👥 Group Cart

FEASTO supports collaborative food ordering through a **Group Cart** feature.

Users can:

* Start a group cart for a restaurant
* Invite/join a shared ordering session
* Add items under different members
* Maintain separate items for each participant
* Lock the session when required

### 🎁 Surprise Bags

Restaurants can offer surplus food through discounted **Surprise Bags**.

Each surprise bag can contain:

* Original price
* Discounted price
* Available quantity
* Pickup time

This feature helps reduce food waste while providing users with discounted meals.

### 👨‍💼 Admin Panel

Administrators can:

* View all orders
* Update order status
* Add restaurants
* Delete restaurants
* Manage restaurant data
* Access protected admin routes

## Admin-only authorization is handled using JWT authentication and role-based access control.

## 🏪 Sample Restaurants

The application comes with sample restaurant data covering multiple cuisines:

| Restaurant             | Cuisine         | Rating | Delivery  |
| ---------------------- | --------------- | -----: | --------- |
| Gourmet Burger Kitchen | American        |  ⭐ 4.8 | 20–30 min |
| Sushi Master           | Japanese        |  ⭐ 4.9 | 40–50 min |
| Taco Fiesta            | Mexican         |  ⭐ 4.6 | 15–25 min |
| Green Bowl Cafe        | Healthy / Vegan |  ⭐ 4.7 | 25–35 min |
| Dragon Wok             | Chinese         |  ⭐ 4.5 | 30–40 min |
| Mamma Mia Pizzeria     | Italian         |  ⭐ 4.8 | 35–45 min |
| Seoul BBQ Kitchen      | Korean          |  ⭐ 4.7 | 40–50 min |
| Spice of India         | Indian          |  ⭐ 4.9 | 25–40 min |
| Sweet Tooth Bakery     | Desserts        |  ⭐ 4.9 | 15–25 min |

The backend seeds restaurants and their menu items automatically when the database is initialized.

---

## 🧑‍💻 Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* React.js 

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* Role-based authorization
* Protected API routes
* CORS

The backend uses Express, Mongoose, CORS and JWT, with MongoDB as the database layer.

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │      FEASTO UI      │
                    │   React / Frontend  │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Express Server   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication     Restaurants       Orders
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    │     Mongoose ODM    │
                    └─────────────────────┘
```

---

## 📂 Project Structure

```text
FEASTO/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── Restaurant.js
│   │   ├── Order.js
│   │   ├── User.js
│   │   └── GroupCart.js
│   │
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .env
├── .gitignore
└── README.md
```

---

## 🔐 Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
JWT Token Generated
 │
 ▼
Token Stored by Frontend
 │
 ▼
Protected API Request
 │
 ▼
JWT Verification
 │
 ▼
Authorized User
```

The application generates JWT tokens during registration and login and uses middleware to protect authenticated routes.

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Restaurants

```http
GET  /api/restaurants
GET  /api/restaurants/:id
GET  /api/restaurants/deals/surprise-bags
POST /api/restaurants
DELETE /api/restaurants/:id
```

### Orders

```http
POST /api/orders
GET  /api/orders/myorders
GET  /api/orders/:id
GET  /api/orders
PUT  /api/orders/:id/status
```

### User Profile

```http
GET /api/users/profile
PUT /api/users/profile
POST /api/users/favorites/:id
```

### Group Cart

```http
POST /api/group-cart/start
GET  /api/group-cart/:id
POST /api/group-cart/:id/add
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/food_ordering
JWT_SECRET=your_secret_key
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/feasto.git
cd feasto
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database

FEASTO uses **MongoDB** with **Mongoose**.

Main collections/models:

```text
Users
Restaurants
Orders
GroupCarts
```

The application also supports automatic database seeding with sample restaurants and menu data.

---

## 👨‍💼 Admin Access

The backend supports role-based admin authorization.

Admin users can access protected operations such as:

* Viewing all orders
* Updating order status
* Creating restaurants
* Deleting restaurants

> ⚠️ For production, use a strong password and store credentials securely. Do not commit `.env` files or real credentials to GitHub.

---

## 📸 Screenshots

Add screenshots of your application here:

```text
### 🏠 Home Page
![Home Page](screenshots/home.png)

### 🍽️ Restaurant Page
![Restaurant Page](screenshots/restaurant.png)

### 🛒 Cart
![Cart](screenshots/cart.png)

### 📦 Order Tracking
![Order Tracking](screenshots/order-tracking.png)

### 👤 User Profile
![Profile](screenshots/profile.png)

### 👨‍💼 Admin Dashboard
![Admin Dashboard](screenshots/admin.png)
```

---

## 🔮 Future Enhancements

* 💳 Online payment integration
* 📍 Real-time delivery location tracking
* 🗺️ Google Maps integration
* 🔔 Push notifications
* ⭐ Restaurant and food reviews
* 🔎 Advanced food search and filtering
* 🏷️ Coupons and promotional offers
* 📱 Fully responsive mobile UI
* 🤖 AI-powered food recommendations
* 📊 Advanced admin analytics dashboard
* 🛵 Delivery partner module
* 📦 Real-time order tracking using WebSockets

---

## 🎯 Project Objective

The main objective of FEASTO is to build a **real-world full-stack food ordering platform** that demonstrates practical implementation of:

* Frontend development
* REST API development
* Database management
* Authentication and authorization
* CRUD operations
* State management
* Order processing
* Role-based access control
* Collaborative ordering

---

## 👩‍💻 Author

**Arushi Jha**

B.Tech — Computer Science Engineering (Artificial Intelligence)

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub!

---

### 📜 License

This project is created for educational and portfolio purposes.
