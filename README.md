# User Management System – Backend

A **Node.js + TypeScript backend** for a User Management System built with **Express**, **Drizzle ORM**, and **MySQL**. It includes authentication using **JWT**, password hashing with **bcrypt**, and a clean project structure suitable for scalable backend development.

---

## 🚀 Tech Stack

* **Node.js**
* **TypeScript**
* **Express.js**
* **MySQL**
* **Drizzle ORM**
* **JWT (Authentication)**
* **bcrypt (Password Hashing)**
* **dotenv (Environment Variables)**

---

## 📂 Project Structure

```bash
src/
├── db/
│   ├── index.ts        # Database connection
│   ├── schema/         # Drizzle schemas
│   └── seed.ts         # Database seeding script
├── controllers/        # Route controllers
├── routes/             # Express routes
├── middlewares/        # Auth & other middlewares
├── utils/              # Helper utilities
├── server.ts           # App entry point
.env                    # Environment variables
package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=user_management_system
JWT_SECRET=your_super_secret_jwt_key
```

> ⚠️ **Important:** Never commit your `.env` file. Always keep it in `.gitignore`.

---

## 📦 Installation

```bash
# Install dependencies
npm install
```

---

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

This will start the server using **ts-node-dev** with auto-reload.

---

## 🌱 Database Seeding

To seed initial users or data into the database:

```bash
npm run seed
```

---

## 🔐 Authentication Flow

* Passwords are hashed using **bcrypt**
* JWT tokens are generated using `JWT_SECRET`
* Tokens are expected in request headers for protected routes

Example:

```http
Authorization: Bearer <token>
```

---

## 🧪 Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "seed": "ts-node src/db/seed.ts"
}
```

---

## 🛡️ Security Best Practices

* Use strong `JWT_SECRET`
* Never expose `.env` values
* Hash passwords before saving to DB

