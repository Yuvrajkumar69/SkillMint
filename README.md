# SkillMint — Premium Online Learning & Course Marketplace

SkillMint is a production-quality, modern ed-tech platform designed for discovering, purchasing, and taking online courses in **Technology** and **Management / Business**.

Built with a **Spring Boot 3.4 REST API (Java 21)** backend, a **React 19 + Vite + TypeScript + Tailwind CSS** frontend, **MySQL** database persistence, **Razorpay (Test Mode)** payment verification, and **Spring Mail** transactional notifications.

---

## 🚀 Key Features

### 🎓 Learning & Course Experience
- **Substantial Course Catalog**: Rich Technology (Java, Spring Boot, React, Python, AWS, DevOps, AI/ML, SQL) & Management (Project Management, Product, Finance, Marketing, HR) categories.
- **Advanced Marketplace**: Server-side filtering by category, difficulty level, price range, rating, and keyword search with sorting (popular, newest, rating, price).
- **Course Detail & Trailer Preview**: Full course landing pages featuring animated video trailers, learning outcomes, curriculum breakdown, prerequisites, instructor profiles, and student reviews.
- **Protected Learning Workspace (`/learn/:courseId`)**: Dedicated video player, collapsible curriculum navigation, resource downloads, lesson completion tracking, and automatic progress percentage calculation.
- **Enrolled Student Reviews**: Verified review system restricting course reviews and ratings exclusively to enrolled students.

### 🔐 Authentication & Account Security
- **Email Verification (`/verify-email`)**: Automated signup verification token flow with HTML email notifications and resend capabilities.
- **JWT Authentication**: Short-lived Bearer tokens, password hashing with BCrypt (cost factor 12), and role-based access control (`ROLE_USER`, `ROLE_ADMIN`).
- **Password Lifecycle**: Forgot password token flow (`/forgot-password`, `/reset-password`) with security notification emails.

### 💳 Cart, Checkout & Razorpay Payments
- **Cart & Wishlist**: Real-time state management for saving courses and building custom course orders.
- **Authoritative Backend Pricing**: Checkout prices calculated strictly on the backend to prevent client-side tampering.
- **Razorpay Test Mode Integration**: Secure Razorpay order generation and client checkout modal.
- **Payment Verification & Webhook**:
  - HMAC-SHA256 signature verification for client callbacks (`/api/payment/verify`).
  - Idempotent Razorpay Webhook endpoint (`POST /api/payment/webhook`).
  - Automated enrollment creation, cart clearing, and transactional email confirmations upon payment capture.
 
  - ### 🎥 Course Content & Video Learning

SkillMint currently provides course learning content through **YouTube-hosted educational videos**, which are played inside the protected course learning experience after a course is purchased and the student is enrolled.

This approach allows the platform to demonstrate the complete **course purchase → enrollment → learning → video playback** workflow while the platform is in its development/early-stage phase. Since original proprietary course content is not currently available, YouTube videos are being used as learning resources for demonstration purposes.

> 🚀 **Future Implementation:** We plan to introduce our own original course content and dedicated video/content infrastructure, allowing SkillMint to provide a fully self-hosted learning experience with proprietary courses, structured lessons, and additional learning resources.


### 🛡️ Admin Management Console (`/admin`)
- **System Overview**: Live revenue metrics, total active users, course counts, enrollments, and system status indicators.
- **Course & Lesson CRUD**: Create, update, publish, or delete courses and manage course lessons.
- **Category & Instructor Management**: Add and manage platform categories and instructor bios.
- **User Account Management**: Toggle account status (Enable / Disable) and inspect user privileges.
- **Order & Payment Logs**: Full audit table of all customer orders, status codes, and Razorpay transaction IDs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, Axios, TanStack Query |
| **Backend** | Java 21, Spring Boot 3.4.4, Spring Security, Spring Data JPA, Hibernate, Spring Mail, Razorpay Java SDK |
| **Database** | MySQL, Flyway Migrations (`V1__init_schema.sql`) |
| **Authentication** | JSON Web Tokens (JWT), BCrypt Password Encoder |

---

## 📁 Repository Structure

```
SkillMint/
├── skillmint-backend/          # Spring Boot 3.4 REST API Backend (Java 21)
│   ├── src/main/java/com/skillmint/
│   │   ├── config/             # SecurityConfig, WebConfig, RazorpayConfig
│   │   ├── controller/         # Auth, Course, Cart, Wishlist, Order, Payment, Enrollment, Admin, Review
│   │   ├── dto/                # AuthDTOs, CourseDTOs, PaymentDTOs, CommonDTOs
│   │   ├── entity/             # User, Course, Category, Instructor, Order, Payment, Enrollment, Review, LessonProgress
│   │   ├── repository/         # JPA Repositories
│   │   ├── security/           # JwtTokenProvider, JwtAuthenticationFilter, UserDetailsServiceImpl
│   │   └── service/            # Business Logic Services
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway V1__init_schema.sql
│   │   └── application.properties
│   ├── mvnw & mvnw.cmd         # Maven Wrapper
│   └── pom.xml
│
├── skillmint-frontend/         # React 19 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── api/                # Axios Instance & Services
│   │   ├── components/         # Navbar, Footer, CourseCard, FilterPanel
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Home, Courses, Detail, Learn, Admin, Signin, Signup, Cart, Checkout, Orders, Profile
│   │   └── types/              # TypeScript Interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│   └── migrations/             # V1__init_schema.sql
│
├── .env.example                # System environment variable template
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to create your local environment variables:

```bash
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/skillmint_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
DB_USERNAME=root
DB_PASSWORD=root

# Security
JWT_SECRET=SkillMint2024SuperSecretKey!ChangeInProduction!AtLeast256BitsLong1234567890AbCdEfGh
JWT_EXPIRATION_MS=86400000

# Razorpay Credentials (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xWMxkWsJ8Z3PNq
RAZORPAY_KEY_SECRET=dXWsxbV1d0XntN66yokALhrs
RAZORPAY_WEBHOOK_SECRET=secret_webhook_key_123

# SMTP Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# Application URLs
APP_FRONTEND_URL=http://localhost:5173
APP_BACKEND_URL=http://localhost:8080
```

---

## ⚡ Running Locally

### 1. Backend (`skillmint-backend`)

Ensure MySQL server is running locally on port 3306 with database `skillmint_db`.

```powershell
# Set JDK 21 environment if needed
$env:JAVA_HOME="C:\Program Files\Java\jdk-21.0.12"
$env:PATH="C:\Program Files\Java\jdk-21.0.12\bin;$env:PATH"

# Run Maven build and start Spring Boot app
cd skillmint-backend
./mvnw clean spring-boot:run
```

The Spring Boot REST API will start at `http://localhost:8080`.

### 2. Frontend (`skillmint-frontend`)

```bash
cd skillmint-frontend
npm install
npm run dev
```

The React frontend will be live at `http://localhost:5173`.

---

## 🧪 Building & Verification

To verify full project compilation and type safety:

```powershell
# Backend Maven build
cd skillmint-backend
./mvnw clean package

# Frontend TypeScript & Vite production build
cd skillmint-frontend
npm run build
```

---

## 🔒 Security Notes
- All credentials in `application.properties` are bound to environment variable parameters.
- Hardcoded test keys in repository commits are designated for local testing; rotate before production deployment.
