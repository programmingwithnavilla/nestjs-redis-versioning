# 👥 Users Service – NestJS + Redis + Prisma

A scalable and high-performance user service built with **NestJS**, **Prisma**, and **Redis-based versioned caching**.

---

## 🚀 Features

- 🔧 Clean architecture with Repository & Service layers
- ⚡ **High-speed Redis caching** with version control
- 🧪 Easy to test and extend
- 📦 Built with **Prisma** ORM and **TypeScript**
- 🛡️ Type-safe DTOs and clean code structure

---

## ✅ API Endpoints

| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| GET    | `/users`       | Get all users          |
| GET    | `/users/:id`   | Get user by ID         |
| POST   | `/users`       | Create a new user      |
| PUT    | `/users/:id`   | Update existing user   |
| DELETE | `/users/:id`   | Delete user            |

---

## 🧠 Redis Caching Strategy

This service uses **versioned Redis caching** to ensure high performance and consistency, without manual cache invalidation.

### 🔄 Versioned Cache Keys

- List cache key: `users-v:{version}`
- Single user cache key: `user:{id}-v:{version}`

### 🔧 Versioning Logic

- `GET /users` → Reads from `users-v:{version}`
- `POST /users` → Creates user, then `INCR users:version`
- `PUT /users/:id` → Updates user, bumps `users:version` and `user:{id}:version`
- `DELETE /users/:id` → Deletes user, bumps versions

This ensures that any mutation (create/update/delete) results in a new cache version, **without needing to delete keys**.

### ⏳ Expiration

Cached data is automatically set with an expiration time (e.g., 1 hour), keeping memory usage optimized.

---

## 🧪 Testing the Cache

```bash
# 1. Initial request - DB hit + cache set
GET /users

# 2. Create user - version incremented
POST /users

# 3. Request again - new version forces DB hit and new cache set
GET /users

# 4. Same logic applies for:
GET /users/:id
PUT /users/:id
DELETE /users/:id
