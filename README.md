# 🧠 Users Service — NestJS + Redis + Prisma

A production-ready Users service built with **NestJS**, **Redis** (for versioned caching), and **Prisma ORM**.

---

## 🚀 Features

- ✅ CRUD operations for users
- ✅ Redis caching with smart versioning
- ✅ Atomic cache version updates using `INCR`
- ✅ No cache deletion — old versions expire naturally
- ✅ Clean, scalable architecture

---

## 📦 Tech Stack

- **NestJS** – Modular TypeScript framework
- **Redis** – Caching layer with versioning
- **Prisma** – Type-safe database client
- **TypeScript** – Full typing for safety and clarity

---

## 📁 Project Structure

src/
├── users/
│ ├── users.service.ts # Business logic and caching
│ ├── users.controller.ts # HTTP layer
│ ├── users.repository.ts # Prisma data access
│ ├── dto/ # DTOs for input validation
├── cache/
│ └── redis.service.ts # Redis abstraction

---

## 🧠 Caching Strategy

Caching is done via Redis and **versioned** per resource:

- `users:version` → version of the full users list
- `user:version:{id}` → version of a single user
- Cache keys include version to prevent stale reads
- No manual deletion: versions are bumped, and old cache expires via TTL

### 🔑 Example Redis Keys

| Redis Key               | Description                     |
|------------------------|---------------------------------|
| `users:version`        | Global version for user list    |
| `users:cache:v3`       | Cached users list (version 3)   |
| `user:version:42`      | Version for user with ID = 42   |
| `user:cache:42-v2`     | Cached user 42 (version 2)      |

---

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run start:dev

## ✅ API Endpoints

| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| GET    | `/users`       | Get all users          |
| GET    | `/users/:id`   | Get user by ID         |
| POST   | `/users`       | Create new user        |
| PUT    | `/users/:id`   | Update existing user   |
| DELETE | `/users/:id`   | Delete user            |

---

## 🧪 Testing the Cache

- `GET /users` → First request (hits DB and caches result)  
- `POST /users` → Creates a new user and **increments version**  
- `GET /users` → New version = new cache key → fresh DB fetch and cache again  
- `GET /users/:id` → Caches individual user with a versioned key  
- `PUT /users/:id` / `DELETE /users/:id` → Increments both list and user-specific versions

✅ **No cache is manually deleted.**  
🚀 **Old cache is ignored due to versioning and naturally expires.**

---

## 📖 License

**MIT** — Free to use, modify, and distribute.

---

## 📬 Feedback / Contributions

Pull requests and suggestions are welcome!  
Let’s improve this service together.

---