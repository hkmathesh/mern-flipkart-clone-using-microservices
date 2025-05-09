# 🛒 MERN Flipkart Clone (Microservices Architecture)

[![React](https://img.shields.io/badge/Frontend-React-blue.svg?logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Microservices-green.svg?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg?logo=mongodb)](https://mongodb.com/)
[![Auth](https://img.shields.io/badge/Auth-Firebase-orange.svg?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Educational-lightgrey)](#license)

> A full-stack e-commerce app inspired by Flipkart, built with the **MERN stack**, **Firebase Authentication**, and **microservices architecture**.
>  
> ✨ For **educational use only** — not affiliated with Flipkart.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Firebase Config](#-firebase-config)
- [Screenshots](#-screenshots)
- [Live Demo](#-live-demo)
- [Author](#-author)
- [License](#-license)

---

## 🚀 Features

- 🔐 Firebase Auth (Login & Signup)
- 🛍️ Browse Products by Category
- 🛒 Add to Cart (Context API)
- 📦 Checkout with Delivery Address
- 💳 Place Orders with Payment Method
- 🧾 View User-Specific Order History
- 💾 MongoDB for persistent data
- ⚙️ Microservices: Product, Address, Order
- 🧩 Role-based protected routes
- 📱 Mobile Responsive UI (Tailwind CSS)

---

## 🛠️ Tech Stack

### Frontend
- **React** (with Vite)
- **Tailwind CSS**
- **React Router DOM**
- **Firebase Auth**
- **Context API** (for cart & auth)

### Backend (Microservices)
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- Microservices:
  - `product-service` – product data
  - `cart-service` – order processing and history
  - `order-service` – order processing and history
  - `address-service` – user delivery addresses
- **Axios** for internal service-to-service calls
- **Render** for deployment

---

## 📁 Folder Structure
mern-flipkart-clone-using-microservices/ 
├── flipkart-frontend/ # React + Vite frontend 
├── flipkart-backend/ 
  ├── product-service/ # Microservice for products 
  ├── cart-service/ # Microservice for carts
  ├── order-service/ # Microservice for orders
  ├── address-service/ # Microservice for addresses 

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mern-flipkart-clone-using-microservices.git
cd mern-flipkart-clone-using-microservices

## 🔐 Firebase Config

In your frontend project, create a file at `src/config.js`:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;

### 🌍 Live Demo
Frontend: https://mern-flipkart-microservices-frontend.onrender.com

Backend (microservices):

Product API: https://mern-flipkart-product-service.onrender.com/

Cart API: https://mern-flipkart-cart-service.onrender.com/

Order API: https://mern-flipkart-order-service.onrender.com/

Address API: https://mern-flipkart-address-service.onrender.com/

### 🙋‍♂️ Author
Harikrishnan
https://github.com/hkmathesh/mern-flipkart-clone

Passionate MERN stack developer building real-world projects 💻

### 📄 License
This project is licensed for educational and non-commercial use only.
Not affiliated with or endorsed by Flipkart.# mern-flipkart-clone-using-microservices
