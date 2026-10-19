# KisanSetu — Smart Agricultural Market Linkage (MERN Stack)

KisanSetu is a fullstack MERN (MongoDB, Express.js, React.js, Node.js) agricultural market linkage and price discovery platform connecting Indian smallholder farmers, Farmer Producer Organizations (FPOs), verified institutional buyers, and logistics transporters with AI crop inspection, daily APMC vegetable mandi price updates, and multilingual voice access (Telugu, Hindi, and English).

---

## 🛠️ Mandatory Technology Stack

- **Frontend:** React 19 with pure JavaScript and JSX (`.jsx` and `.js`), styled with Tailwind CSS.
- **Backend:** Node.js with Express.js REST API architecture.
- **Database:** MongoDB with Mongoose ORM models and schema validation.
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` password hashing, protected frontend routes, and role-based access control.
- **AI & Voice:** Gemini AI Multimodal Vision model for crop defect grading and neural TTS voice assistance.
- **Strict Plain JavaScript:** 100% JavaScript and JSX throughout the entire codebase (`.jsx` and `.js` only, no TypeScript).

---

## 📁 Project Architecture & Directory Structure

```text
├── server/                       # Backend architecture
│   ├── config/
│   │   └── db.js                 # Mongoose connection & connection state monitor
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   ├── CropLot.js            # Farmer crop lot schema
│   │   ├── Offer.js              # Buyer offer & negotiation schema
│   │   ├── Order.js              # Fulfillment & logistics tracking schema
│   │   ├── Vegetable.js          # Daily APMC vegetable items schema
│   │   ├── PriceHistory.js       # APMC price revision audit logs
│   │   ├── CommunityPost.js      # Kisan forum discussions & field clips
│   │   ├── CommunityMessage.js   # Farmer-to-farmer direct messages
│   │   ├── Notification.js       # In-app notifications
│   │   ├── Report.js             # Moderator reports
│   │   ├── SellRequest.js        # FPO farmer aggregation requests
│   │   ├── Transporter.js        # Logistics fleet
│   │   └── Warehouse.js          # WDRA accredited storage facilities
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile, role management
│   │   ├── cropController.js     # Lots CRUD, AI quality inspection, trends
│   │   ├── vegetableController.js# APMC market vegetables CRUD & price history
│   │   ├── orderController.js    # Orders and buyer offers
│   │   ├── communityController.js# Forum, chat, clips, notifications
│   │   ├── voiceController.js    # Voice assistant, Google TTS, IVR simulator
│   │   ├── fpoController.js      # Sell request aggregation & commissions
│   │   └── transportController.js# Logistics & warehouse booking
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── vegetableRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── voiceRoutes.js
│   │   ├── fpoRoutes.js
│   │   └── transportRoutes.js
│   ├── seedData.js               # Initial genuine database seeder
│   └── store.js                  # Resilient high-availability datastore
├── server.js                     # Root Express server entry point (Port 3000)
├── src/                          # Frontend React SPA
│   ├── components/               # React JSX UI components & Modals
│   │   ├── community/            # Kisan Community Hub components
│   │   ├── FarmerDashboard.jsx   # Farmer portal
│   │   ├── FPODashboard.jsx      # FPO officer portal & aggregation
│   │   ├── MarketAdminDashboard.jsx # Daily APMC price management
│   │   ├── TransporterPortal.jsx # Logistics fleet tracking
│   │   ├── Header.jsx            # Responsive navigation & role badges
│   │   ├── ProtectedRoute.jsx    # Auth & Admin route guards
│   │   └── Toast.jsx             # Notification alerts
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx       # JWT authentication & session management
│   │   ├── LanguageContext.jsx   # Multilingual i18n context (EN / TE / HI)
│   │   ├── LocationContext.jsx   # GPS geolocation & APMC city selector
│   │   └── ToastContext.jsx      # Global toast alerts
│   ├── data/                     # APMC cities, seed crops, translations
│   ├── services/                 # Axios REST API client modules
│   │   ├── api.js                # Axios instance with JWT interceptors
│   │   ├── authService.js        # Authentication endpoints
│   │   ├── cropService.js        # Lots and AI inspection API
│   │   ├── vegetableService.js   # APMC vegetable catalog API
│   │   ├── orderService.js       # Orders & offers API
│   │   └── communityService.js   # Forum & chat API
│   ├── pages/                    # React router route pages
│   │   ├── Login.jsx             # Multilingual login with role selector
│   │   ├── Signup.jsx            # Multi-role registration
│   │   ├── Dashboard.jsx         # Main ecosystem dashboard
│   │   ├── Profile.jsx           # User profile & KYC settings
│   │   └── AdminUsers.jsx        # Admin User Management Directory
│   ├── App.jsx                   # Application routing
│   └── main.jsx                  # React DOM mount entry
├── .env.example                  # Environment configuration template
└── package.json                  # Dependencies & execution scripts
```

---

## 🔒 Authentication & Security

- **Password Hashing:** Passwords are automatically hashed using `bcryptjs` with salt rounds prior to storage. Passwords and hash digests are never returned in API responses.
- **JWT Tokens:** Issued upon login or registration with an expiry of 7 days, signed using `JWT_SECRET`.
- **Axios Interceptors:** Client requests automatically include the `Authorization: Bearer <token>` header from `localStorage`.
- **Protected Routes:** Unauthorized visitors accessing protected pages are redirected to `/login`.
- **Admin Portal Access:** Strictly guarded by `AdminRoute` and backend `authorizeRole('admin')`. Only authorized platform administrators with role `admin` can access the Admin Portal.

---

## 📡 REST API Documentation

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with hashed password & role | No |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT | No |
| `POST` | `/api/auth/google-login` | Authenticate with Google identity | No |
| `POST` | `/api/auth/phone-login` | Authenticate via mobile number / OTP | No |
| `GET` | `/api/auth/me` | Fetch current user authenticated profile | Yes (Bearer) |
| `PUT` | `/api/auth/profile` | Update profile, location, KYC, or bank details | Yes (Bearer) |
| `PUT` | `/api/auth/password` | Change password with current password verification | Yes (Bearer) |
| `POST` | `/api/auth/logout` | Invalidate active user session | Yes (Bearer) |

### 2. Crop Produce & Price Discovery (`/api`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lots` | List available crop lots (filters: status, crop, farmerId) |
| `GET` | `/api/lots/:id` | Get lot details |
| `POST` | `/api/lots` | Create a new crop listing |
| `PUT` | `/api/lots/:id` | Update lot status or price |
| `DELETE` | `/api/lots/:id` | Remove crop listing |
| `POST` | `/api/ai/quality-check` | Optical AI crop grade and moisture inspection |
| `GET` | `/api/recommendations` | Net take-home value market recommendation |
| `GET` | `/api/prices/trends` | Historical APMC price curves (7/30/90 days) |

### 3. APMC Daily Vegetables (`/api/vegetables`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vegetables` | Catalog with search, filter (category, market, grade), and sort |
| `GET` | `/api/vegetables/:id` | Single vegetable details |
| `POST` | `/api/vegetables` | Market Admin adds new commodity listing |
| `PUT` | `/api/vegetables/:id` | Market Admin updates daily auction rate & creates history record |
| `DELETE` | `/api/vegetables/:id` | Archive commodity listing |
| `GET` | `/api/vegetables/history` | Historical audit log of all market price revisions |

### 4. Orders & Buyer Offers (`/api`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | Fetch orders with status and logistics step |
| `GET` | `/api/orders/:id` | Order details with driver tracking |
| `POST` | `/api/orders` | Create confirmed purchase order |
| `GET` | `/api/offers` | Fetch buyer offers for a lot |
| `POST` | `/api/offers` | Buyer submits price offer per quintal |
| `PUT` | `/api/offers/:id` | Accept/reject offer (auto-creates order & marks lot sold on accept) |

### 5. Community & Chat (`/api/community`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/community/posts` | List discussions, pest alerts, and field clips |
| `POST` | `/api/community/posts` | Create new farmer community post |
| `PUT` | `/api/community/posts/:id/like` | Toggle post upvote/like |
| `POST` | `/api/community/posts/:id/comments` | Add farmer reply or solution |
| `GET` | `/api/community/messages` | Direct chat conversation threads |
| `POST` | `/api/community/messages` | Send direct message between ecosystem members |

### 6. Voice & Telephony (`/api`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ai/tts` | Stream neural audio for Telugu, Hindi, or English |
| `POST` | `/api/ai/voice-query` | Natural language voice query with local dialect recognition |
| `POST` | `/api/voice/ivr` | Interactive IVR toll-free telephony simulation (1800-425-166) |

---

## 🚀 Getting Started & Installation

### 1. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env
```
Configure your `.env` values:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/kisansetu?retryWrites=true&w=majority"
JWT_SECRET="your_secure_jwt_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
PORT=3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The server starts at `http://localhost:3000` with Vite middleware mounted directly onto Express.

### 4. Production Build & Start
```bash
npm run build
npm start
```
Runs the compiled application bundled via esbuild and Vite on port 3000.
