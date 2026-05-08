# NivasAI BFF

Backend-for-Frontend API gateway for the NivasAI MERN + microservices architecture.

## Role In The System

```text
nivasai-app      -> React frontend. Calls this BFF only.
nivasai-bff      -> Express API, Firebase auth verification, MongoDB, orchestration.
nivasai-services -> AI/event microservices such as complaint classification and ward analysis.
nivasai-infra    -> Firebase, GCP, hosting, and deployment configuration.
```

The frontend should not call Gemini, Document AI, Twilio, or server-side Google APIs directly. Those keys belong in this backend or in the microservices repo.

## Tech Stack

- Node.js 20
- Express
- TypeScript
- MongoDB + Mongoose
- Firebase Admin SDK
- Zod validation
- Axios microservice adapter

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The API defaults to:

```text
http://localhost:4000/api
```

Set this in `nivasai-app`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Authentication

Frontend requests to protected routes must include a Firebase ID token:

```http
Authorization: Bearer <firebase_id_token>
```

The BFF verifies the token with Firebase Admin and creates or updates a Mongo user record. New users default to the `resident` role.

## Environment Variables

See [.env.example](.env.example).

Required for local development:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/nivasai
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NIVASAI_SERVICES_BASE_URL=
```

## API Endpoints

### Health

```http
GET /api/health
```

### Current User

```http
GET /api/me
```

### Complaints

```http
POST  /api/complaints
GET   /api/complaints
GET   /api/complaints/:complaintId
PATCH /api/complaints/:complaintId/status
POST  /api/complaints/:complaintId/route
```

### Wards

```http
GET  /api/wards
GET  /api/wards/:wardId
POST /api/wards/:wardId/analyze
```

### Housing

```http
GET  /api/housing/profile
POST /api/housing/profile
POST /api/housing/matches
GET  /api/housing/applications
POST /api/housing/applications
```

### Documents

```http
POST /api/documents/upload-complete
POST /api/documents/:documentId/parse
GET  /api/documents/:documentId
```

### Notifications

```http
POST /api/notifications/register-token
```

## Error Format

All API errors use:

```json
{
  "error": "ValidationError",
  "message": "Request validation failed",
  "code": 400,
  "details": {}
}
```

## Microservice Adapter

All calls to `nivasai-services` go through `src/services/microservicesClient.ts`.

The client currently exposes stable methods:

- `classifyComplaint`
- `routeComplaint`
- `analyzeWard`
- `matchHousing`
- `parseDocument`
- `broadcastNotification`

If `NIVASAI_SERVICES_BASE_URL` is not configured, methods return safe placeholder responses where possible. This lets frontend integration begin before every AI microservice endpoint is deployed.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```
