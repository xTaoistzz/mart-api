
# 🛒 Mart API

Mart API คือ RESTful API ที่ใช้สำหรับจัดการระบบร้านค้า เช่น การลงทะเบียนผู้ใช้ จัดการสินค้า และออเดอร์ พัฒนาโดยใช้ **Node.js** และ **Express** พร้อมระบบ JWT Authentication

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB (ผ่าน `./db`)
- dotenv
- cors
- JWT (Token-based auth)

## ⚙️ Installation

1. **Clone repo**
   ```bash
   git clone https://github.com/xTaoistzz/mart-api.git
   cd mart-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**

   สร้างไฟล์ `.env` ใน root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/your-db
   JWT_SECRET=your_jwt_secret
   ```

4. **Run server**
   ```bash
   npm start
   ```

## 📌 API Endpoints

### 🔑 Auth (`/api/v1`)
| Method | Endpoint     | Description       |
|--------|--------------|-------------------|
| POST   | `/register`  | สมัครสมาชิก       |
| POST   | `/login`     | เข้าสู่ระบบ        |

> **Note:** ต้องตรวจสอบว่า `authRouter` ครอบคลุม endpoint เหล่านี้

### 📦 Products (`/api/v1/products`) *(requires token)*

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | `/`               | ดูสินค้าทั้งหมด     |
| POST   | `/`               | เพิ่มสินค้า         |
| PUT    | `/:id`            | แก้ไขสินค้า         |
| DELETE | `/:id`            | ลบสินค้า            |

### 📄 Orders (`/api/v1/orders`) *(requires token)*

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | `/`               | ดูออเดอร์ทั้งหมด    |
| POST   | `/`               | สร้างออเดอร์ใหม่     |

## 🔒 Authentication

ใช้ `Authorization` header แบบ Bearer token:

```http
Authorization: Bearer <your_jwt_token>
```

## 🧪 Example cURL

```bash
curl -X POST http://localhost:3000/api/v1/login   -H "Content-Type: application/json"   -d '{"username": "user", "password": "pass"}'
```

## 👨‍💻 Developer

**Suphatsit Singkaew (xTaoistzz)**  
GitHub: [@xTaoistzz](https://github.com/xTaoistzz)

## 📄 License

This project is licensed under the MIT License.
