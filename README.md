# SCOUT School Safety Management System

SCOUT lets school staff raise safety alerts in seconds, routes each alert to the right people by email and SMS, and gives administrators one place to track the response, confirm delivery and review incidents afterwards.

| | |
|---|---|
| **Project ID** | P000455SE |
| **Current release** | v1.0.0 (23 October 2026) |
| **Live application** | https://scout-school-safety.vercel.app |
| **Backend API** | https://scout-production-deployment.onrender.com/api (health check: `/api/health`) |
| **GitHub repository** | https://github.com/scoutemmet01/SCOUT-Production-Deployment |
| **Frontend hosting (Vercel)** | https://vercel.com/scout-7a2a/scout-production-deployment |
| **Backend hosting (Render)** | https://dashboard.render.com/web/srv-db3oall9fdbs73ekchbg |
| **Database and sign-in (Firebase)** | https://console.firebase.google.com/project/scout-safety-prod/overview |
| **Demo evidence** | `P000455SE-demo.pdf`: screenshots of every main function and validation scenario on the live application |
| **Development guide** | SCOUT Development Guide v1.0: machine setup, coding standard, version control policy, deployment and a worked example |

The hosting dashboards need a login to the SCOUT account (see [Accounts and credentials](#accounts-and-credentials)).

### Project team

- **Sponsor:** Emmet Brazil, Product Owner (SCOUT)
- **Project supervisor:** Monisha Viswanathan, RMIT University
- **Team:** Rinad Anwar, Akshay Jyani, Benaiha Johnson Edward Inbaraj, Hasini Tummala, Tharun Venkadesh Manimaran

## Contents

- [Project documents](#project-documents)
- [Release notes](#release-notes)
- [Accounts and credentials](#accounts-and-credentials)
- [Architecture and cloud services](#architecture-and-cloud-services)
- [Installation and running locally](#installation-and-running-locally)
- [Running the tests](#running-the-tests)
- [Deployment](#deployment)
- [Alert notifications](#alert-notifications)
- [Data management](#data-management)
- [Change log](#change-log)
- [Git workflow](#git-workflow)

## Project documents

| Document | What it covers |
|---|---|
| SCOUT Development Guide v1.0 | Setting up a developer machine, the code and comment standard, version control policy, deployment, and a worked example of one feature from screen to database |
| Technical Solution Design v1.0 | Architecture, components, data model and test summary |
| Test Plan v0.4 | Test strategy, test cases and results |
| SCOUT Product Backlog | Prioritised user stories with Definitions of Done, owners, effort and sprint |
| Project Charter v2.0, Risk Register v2.0, Issues Register v1.0 | Scope and governance, project risks, and issues raised and resolved |
| `P000455SE-demo.pdf` | Screenshots of the main functions and validation scenarios on the live application |
| [`server/src/db/FIREBASE.md`](server/src/db/FIREBASE.md), [`server/src/db/SEEDING.md`](server/src/db/SEEDING.md), [`FIRESTORE_EMULATOR_SETUP.md`](FIRESTORE_EMULATOR_SETUP.md) | Firestore structure, seeding and the local emulator (in this repository) |

## Release notes

### v1.0.0 (23 October 2026)

First production release of SCOUT, deployed to Vercel (frontend) and Render (backend) with Firebase as the database and login provider. The sponsor asked the team to turn an existing prototype into a clearer, more reliable product that needs little training, and to hand it over running under accounts he owns. Over five sprints the team delivered 23 backlog items.

**What the release does**

- **Staff** raise emergency or general alerts from the dashboard in one or two taps, submit structured alerts with a preview of who will be notified, save up to five personal quick alerts, and follow their incidents live.
- **School Admins** see their school's safety status, move incidents through Acknowledged → In Progress → Resolved, flag resolved incidents for review, choose who receives each alert type and by which channel, send test alerts that notify nobody, set the overdue timeout and retention period, and view analytics and notification delivery.
- **Company Admins** manage schools, alert types and locations for the whole network, see every school's incidents, analytics and notifications, and archive old resolved incidents.
- **Notifications** go out by email (Brevo) and SMS (ClickSend). Each message is tracked as pending, sent, delivered or failed, with the provider's reason recorded for failures and a Retry button on the Notifications page. Recipients acknowledge an alert from a link in the email or SMS, with no login needed.
- **Phones** are supported: on small screens the sidebar becomes a menu opened from the top bar.

**New in this release** (see the [change log](#change-log) for the full list)

- Email moved from Gmail SMTP to the Brevo API, so it works on Render's free tier, which blocks SMTP.
- Delivery confirmation through Brevo and ClickSend webhooks, failure reasons and Retry.
- Notifications page filters by school, type, channel, status and date.
- Validation for school names, alert type names and duplicate locations.
- Wider two-column Submit Alert form and a mobile navigation drawer.
- Updated Staff dashboard.

**Issues delivered in this release (Jira: Scout System v1.0.0)**

Each issue can be opened at `https://rinadanwar.atlassian.net/browse/<key>`, for example https://rinadanwar.atlassian.net/browse/SCRUM-17.

Stories

- [SCRUM-9](https://rinadanwar.atlassian.net/browse/SCRUM-9) School Admin - add system-wide configuration settings
- [SCRUM-10](https://rinadanwar.atlassian.net/browse/SCRUM-10) Emergency Type dropdown shows all types
- [SCRUM-11](https://rinadanwar.atlassian.net/browse/SCRUM-11) Alert submission confirmation message
- [SCRUM-12](https://rinadanwar.atlassian.net/browse/SCRUM-12) Quick-action buttons for alert testing
- [SCRUM-14](https://rinadanwar.atlassian.net/browse/SCRUM-14) Load schools dynamically from database instead of hardcoded data
- [SCRUM-15](https://rinadanwar.atlassian.net/browse/SCRUM-15) Fix Analytics page to display accurate data with proper filtering by school
- [SCRUM-17](https://rinadanwar.atlassian.net/browse/SCRUM-17) Implement SMS and email notifications for triggered alerts
- [SCRUM-18](https://rinadanwar.atlassian.net/browse/SCRUM-18) Allow staff to create custom quick alert types for frequent emergencies
- [SCRUM-19](https://rinadanwar.atlassian.net/browse/SCRUM-19) Remove System-wide Config section from Setup Page
- [SCRUM-20](https://rinadanwar.atlassian.net/browse/SCRUM-20) Create dedicated School Management page
- [SCRUM-21](https://rinadanwar.atlassian.net/browse/SCRUM-21) Enable emergency alert submission in less than 3 clicks
- [SCRUM-23](https://rinadanwar.atlassian.net/browse/SCRUM-23) Deploy SCOUT Application to Production Environment
- [SCRUM-24](https://rinadanwar.atlassian.net/browse/SCRUM-24) Implement system-wide input validation
- [SCRUM-25](https://rinadanwar.atlassian.net/browse/SCRUM-25) Clearly label and categorize dashboard data sources
- [SCRUM-27](https://rinadanwar.atlassian.net/browse/SCRUM-27) Filter and sort dashboard data by school
- [SCRUM-28](https://rinadanwar.atlassian.net/browse/SCRUM-28) Clearly indicate and filter Incident page data by school
- [SCRUM-29](https://rinadanwar.atlassian.net/browse/SCRUM-29) Display unique Incident Number for each incident
- [SCRUM-30](https://rinadanwar.atlassian.net/browse/SCRUM-30) Connect Setup Page directly to Submit Alert workflow
- [SCRUM-31](https://rinadanwar.atlassian.net/browse/SCRUM-31) Preview alert before final submission
- [SCRUM-32](https://rinadanwar.atlassian.net/browse/SCRUM-32) Improve filtering on Notifications page
- [SCRUM-33](https://rinadanwar.atlassian.net/browse/SCRUM-33) Keep incident status visible on Staff dashboard
- [SCRUM-34](https://rinadanwar.atlassian.net/browse/SCRUM-34) Simplify Staff Incidents page
- [SCRUM-36](https://rinadanwar.atlassian.net/browse/SCRUM-36) Delete an incident logged by mistake

Bugs

- [SCRUM-37](https://rinadanwar.atlassian.net/browse/SCRUM-37) Renaming an alert type stops its notifications
- [SCRUM-38](https://rinadanwar.atlassian.net/browse/SCRUM-38) Recipient preview shows people who will not actually be contacted
- [SCRUM-39](https://rinadanwar.atlassian.net/browse/SCRUM-39) Two alert types with the same name: one cannot be set up
- [SCRUM-40](https://rinadanwar.atlassian.net/browse/SCRUM-40) Emergency button sends the alert but shows nothing on screen
- [SCRUM-41](https://rinadanwar.atlassian.net/browse/SCRUM-41) You can create the same incident twice from the confirmation box
- [SCRUM-42](https://rinadanwar.atlassian.net/browse/SCRUM-42) Test alerts are counted as real ones on the dashboard
- [SCRUM-43](https://rinadanwar.atlassian.net/browse/SCRUM-43) Delete button is shown, then the server refuses the delete
- [SCRUM-44](https://rinadanwar.atlassian.net/browse/SCRUM-44) Duplicate location names are accepted in Setup
- [SCRUM-45](https://rinadanwar.atlassian.net/browse/SCRUM-45) School Management accepts names containing only special characters
- [SCRUM-46](https://rinadanwar.atlassian.net/browse/SCRUM-46) School filter does not show all registered schools
- [SCRUM-47](https://rinadanwar.atlassian.net/browse/SCRUM-47) Fix Alert Name Validation in Alert Configuration
- [SCRUM-48](https://rinadanwar.atlassian.net/browse/SCRUM-48) Fix incorrect acknowledgement message for resolved incidents
- [SCRUM-51](https://rinadanwar.atlassian.net/browse/SCRUM-51) Add mobile navigation drawer to the app layout

Tasks

- [SCRUM-49](https://rinadanwar.atlassian.net/browse/SCRUM-49) Simplify Staff Dashboard UI and Improve Quick Alerts Accessibility
- [SCRUM-50](https://rinadanwar.atlassian.net/browse/SCRUM-50) Use the width of the screen so pages need less vertical scrolling

**Known issues and limitations**

- SMS needs ClickSend credit. A trial account can only text numbers verified in the ClickSend dashboard, and messages are rejected (and shown as failed) once the credit runs out.
- Alert emails are sent from a Gmail address through Brevo, so some recipients may find them in spam until a school domain is set up and verified in Brevo.
- The Render free tier sleeps after about 15 minutes without traffic. The first request after that can take up to a minute.
- The Email/SMS/Both choice for an alert recipient is set when the recipient is added; to change it, remove the recipient and add them again.

## Accounts and credentials

### Demo accounts on the live application

The login page has quick-login buttons for these accounts. They belong to the demo school "Beta School".

| Role | Email | Password |
|---|---|---|
| School Admin | `admin.beta@scout.edu` | `Scout@1234` |
| Staff | `staff.beta@scout.edu` | `Scout@1234` |
| Company Admin | `admin@scout.edu` | Shared directly by the Product Owner |

The Company Admin password is not published here because this repository is public and that account can change settings for every school.

### Service accounts

Vercel, Render, Firebase, Brevo and ClickSend all run under a dedicated SCOUT account owned by the Product Owner. Ask him for access: he shares the password directly, and it should be changed after the final handover. Credentials are never written into project documents or this repository.

### Credentials needed to deploy and run SCOUT

Real keys are never committed. Each one is set as an environment variable (see [Environment variables](#environment-variables)) or kept in a local, gitignored file. Ask the Product Owner or a team lead for the values.

| Service | What is needed | Where it is set | Where to get it |
|---|---|---|---|
| Firebase (Firestore and Authentication) | Service account JSON for the backend; web app config for the frontend | `server/firebase-service-account.json` locally, `FIREBASE_SERVICE_ACCOUNT_JSON` on Render; `VITE_FIREBASE_*` in `client/.env` and Vercel | Firebase console → Project settings → Service accounts / General (project `scout-safety-prod`) |
| Brevo (email) | API key and a verified sender address | `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` | Brevo → SMTP & API → API keys; Senders |
| ClickSend (SMS) | Username and API key | `CLICKSEND_USERNAME`, `CLICKSEND_API_KEY` | ClickSend → Developers → API Credentials |
| Delivery webhooks | A long random shared secret | `NOTIFICATION_WEBHOOK_SECRET` | Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Company Admin bootstrap | Email, password and name for the first Company Admin | `COMPANY_ADMIN_EMAIL`, `COMPANY_ADMIN_PASSWORD`, `COMPANY_ADMIN_NAME`, then `npm run seed:company-admin` | Chosen by the team |
| Vercel, Render and Firebase consoles | Login to the hosting and database dashboards | — | The SCOUT account, through the Product Owner |

## Architecture and cloud services

| Part | Technology | Hosted on |
|---|---|---|
| Frontend (`client/`) | React 19, Vite, Tailwind CSS, React Router, Recharts | Vercel |
| Backend API (`server/`) | Node.js, Express 5, Firebase Admin SDK | Render (web service) |
| Database and login | Cloud Firestore and Firebase Authentication | Firebase (Google Cloud) |
| Email | Brevo transactional API | Brevo |
| SMS | ClickSend REST API | ClickSend |
| CI | GitHub Actions runs the frontend and backend tests on every push and pull request to `main` | GitHub |

The frontend signs users in with Firebase Authentication and calls the backend with the user's Firebase ID token. The backend checks the token and the user's role before reading or writing Firestore, and sends notifications.

## Installation and running locally

### Prerequisites

| Tool | Version | Where to get it | Used for |
|---|---|---|---|
| Node.js and npm | 24 (the version CI uses) | https://nodejs.org | Running and testing both apps |
| Git | Any recent | https://git-scm.com | Version control |
| Visual Studio Code | Any recent | https://code.visualstudio.com | Recommended editor (ESLint extension) |
| Java JDK | 21 or newer | https://adoptium.net | Only for the local Firestore emulator |
| Firebase CLI | 13 or newer | `npm install -g firebase-tools` | Only for the local Firestore emulator |

You also need the environment values (Firebase keys and service account, and Brevo and ClickSend keys if you want real email and SMS). Ask the Product Owner or a team lead.

### Default local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Backend health check: `http://localhost:5000/api/health`

### Setup steps

1. Clone the repository and install dependencies in both apps.

```bash
git clone https://github.com/scoutemmet01/SCOUT-Production-Deployment.git
cd SCOUT-Production-Deployment

cd client
npm install

cd ../server
npm install
```

2. Copy the example env files and fill in your own values.

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Add the Firebase service account file to the `server/` folder, or update the path in `server/.env`.

4. For a fresh Firebase project or emulator database, seed the required demo/setup data from the `server/` folder.

```bash
cd server
npm run seed:demo
npm run seed:alert-config
npm run seed:company-admin
```

Seeding overwrites demo records, so never run it against a database you want to keep. See [`server/src/db/SEEDING.md`](server/src/db/SEEDING.md).

5. Start the backend first, then the frontend.

```bash
cd server
npm run dev

cd ../client
npm run dev
```

Open `http://localhost:5000/api/health` (it should return `{"status":"ok"}`), then open `http://localhost:5173` and sign in with one of the demo accounts.

### Using the Firestore emulator for day-to-day work

The server `.env` points at the real production database. For everyday development, run against the local Firestore emulator so real incidents are never created or deleted, and leave the Brevo and ClickSend keys blank so no real email or SMS is sent. Full steps are in [`FIRESTORE_EMULATOR_SETUP.md`](FIRESTORE_EMULATOR_SETUP.md).

```powershell
firebase emulators:start                          # from the repository root
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"     # PowerShell, in server/
npm run dev                                       # seeds demo data on start
npm run seed:alert-config                         # alert types and locations
```

Sign-in still uses the real Firebase Authentication project, so use the seeded demo accounts. Each user also needs a profile in the emulator's `users` collection with the right role and school.

### Environment variables

#### Frontend

The frontend uses:

- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_DEMO_COMPANY_ADMIN_EMAIL` and `VITE_DEMO_COMPANY_ADMIN_PASSWORD` (optional, local only: show the Company Admin quick-login button)

Recommended local value:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Backend

The backend uses:

- `PORT`
- `JWT_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_PATH`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_PROJECT_ID`
- `BACKEND_URL`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `CLICKSEND_USERNAME`
- `CLICKSEND_API_KEY`
- `SMS_DEFAULT_COUNTRY`
- `NOTIFICATION_WEBHOOK_SECRET`
- `SEED_DEMO_DATA`
- `COMPANY_ADMIN_EMAIL`, `COMPANY_ADMIN_PASSWORD`, `COMPANY_ADMIN_NAME`

Recommended local values:

```env
PORT=5000
BACKEND_URL=http://localhost:5000
JWT_SECRET=replace_with_local_secret
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_PROJECT_ID=scout-safety-prod
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender@example.com
BREVO_SENDER_NAME=SCOUT Safety System
CLICKSEND_USERNAME=your_clicksend_username
CLICKSEND_API_KEY=your_clicksend_api_key
SMS_DEFAULT_COUNTRY=AU
NOTIFICATION_WEBHOOK_SECRET=replace_with_a_long_random_string
SEED_DEMO_DATA=false
```

Use `FIREBASE_SERVICE_ACCOUNT_PATH` for local development with a JSON file in `server/`. Use `FIREBASE_SERVICE_ACCOUNT_JSON` for hosted environments such as Render where the service account JSON is stored as an environment variable.

With `FIREBASE_PROJECT_ID=scout-safety-prod`, a local backend reads and writes the **live** database. Use test recipients when sending alerts locally, or point the backend at the Firestore emulator instead.

### Important notes

- If you change the backend port, update the frontend API base URL too.
- Do not commit real secrets or real `.env` files to the repo.
- Use the `.env.example` files as the shared template for the team.
- Make sure your backend routes are enabled before testing frontend integration.
- If you see `Failed to fetch`, first check that the backend is running and that the API port matches the frontend config.

## Running the tests

Run the tests before you start changing anything. On 23 October 2026 all 393 backend and 269 frontend tests pass.

```bash
# Backend (Node test runner)
cd server
npm test
# or the same command CI uses
node --test tests/*.test.js

# Frontend (Vitest) and lint
cd client
npm run test:run
npm run lint
```

Smaller backend groups are also available: `npm run test:notifications`, `npm run test:analytics`, `npm run test:schools`, `npm run test:quick-alerts`.

Tests use mocks or the emulator, never the production database. Every story and bug fix ships with tests, and a bug fix includes a regression test that fails on the old code and passes on the fix.

## Deployment

The live system is deployed from the `main` branch, so `main` must always be deployable. All three services run under the SCOUT account owned by the Product Owner; the dashboard links are in the table at the top of this file.

### Backend on Render

- Service type: Web Service, connected to this repository
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: everything in the backend list above, with `FIREBASE_SERVICE_ACCOUNT_JSON` instead of a file path, and `BACKEND_URL=https://scout-production-deployment.onrender.com`
- Check the deploy at `https://scout-production-deployment.onrender.com/api/health`

### Frontend on Vercel

- Framework preset: Vite, root directory `client`
- Build command: `npm run build`, output directory `dist`
- Environment variables: the `VITE_FIREBASE_*` values and `VITE_API_BASE_URL=https://scout-production-deployment.onrender.com/api`
- `client/vercel.json` rewrites every path to `index.html`, so refreshing a page such as `/incidents` works

### Data and sign-in on Firebase

- Firebase project `scout-safety-prod`: the Firestore database and Firebase Authentication.
- Users are added in Authentication, each with a matching profile in the `users` collection that sets their role and school.

### Deploying a change

1. Merge the reviewed pull request into `main`.
2. Vercel and Render build the new version from `main`. Follow progress in each dashboard.
3. If you changed an environment variable, update it in the Vercel or Render settings and redeploy that service.
4. If the backend URL changes, update `VITE_API_BASE_URL` on Vercel and the CORS `origin` list in `server/src/index.js`. Do the same if the frontend moves to a new domain, and add that domain to Firebase Authentication's Authorized domains.
5. Register the delivery webhooks in Brevo and ClickSend for a new backend URL (see [Alert notifications](#alert-notifications)).

### Testing the deployed app

1. Open `https://scout-production-deployment.onrender.com/api/health`; it should return `{"status":"ok"}`.
2. Open https://scout-school-safety.vercel.app, sign in, and check the dashboard loads.
3. As a School Admin, send a quick test alert from Alert Testing. Drills are recorded and badged TEST but notify nobody, so this checks the full path safely.
4. To check real delivery, send a dashboard quick alert to a recipient set up for testing, then open the Notifications page: each channel should move from pending to sent and then delivered.

### Rolling back

Redeploy the previous successful deployment in Render and Vercel, or revert the pull request on GitHub, which deploys again.

## Alert notifications

Triggered alerts are sent by email through the Brevo API and by SMS through ClickSend. Both are called over HTTPS, so they work on Render's free tier, which blocks outbound SMTP. The old Gmail, SendGrid and Twilio variables are no longer used.

Every message is recorded in the `notifications` collection before it is sent, and each channel moves through `pending` → `sent` → `delivered`, or to `failed` with the reason in `emailError` / `smsError`. `skipped` means the recipient is not set up for that channel. The Notifications page shows these statuses, refreshes itself while recent messages are waiting for a receipt, and lets admins retry a failed channel.

One-time setup for a deployment:

1. **Brevo:** create an API key under SMTP & API, and verify the sender address under Senders & IP. Set `BREVO_API_KEY` and `BREVO_SENDER_EMAIL`.
2. **ClickSend:** set `CLICKSEND_USERNAME` and `CLICKSEND_API_KEY`. Messages are sent from ClickSend's shared numbers. Trial accounts can only text numbers verified in the ClickSend dashboard.
3. **Delivery receipts:** set `BACKEND_URL` to the public backend URL and choose a long random `NOTIFICATION_WEBHOOK_SECRET`. Then register these webhook URLs:
   - Brevo → Transactional → Settings → Webhooks, events *Delivered*, *Hard bounce*, *Blocked*, *Invalid email* and *Error*:
     `https://<backend>/api/notifications/webhooks/brevo?secret=<NOTIFICATION_WEBHOOK_SECRET>`
   - ClickSend → Messaging Settings → Delivery Reports Rules → add an SMS rule with the *URL* action:
     `https://<backend>/api/notifications/webhooks/clicksend?secret=<NOTIFICATION_WEBHOOK_SECRET>`

Without step 3, messages still send and show as `sent`, but they never move to `delivered`.

## Data management

### Where data is stored

All application data is stored in **Cloud Firestore** in the Firebase project `scout-safety-prod`. User sign-in is handled by **Firebase Authentication**; passwords are never stored by SCOUT itself. The full field list for each collection is in [`server/src/db/FIREBASE.md`](server/src/db/FIREBASE.md).

| Collection | Holds |
|---|---|
| `users` | Profile for each account: name, email, phone, role and school |
| `schools` | Schools in the network; deactivated schools are kept, never deleted |
| `incidents` | Every alert raised, with its status history, who acknowledged it and any review comments |
| `archivedIncidents` | Resolved incidents moved out of the live log after the retention period |
| `deletedIncidents` | Audit copy of incidents deleted by an admin, with the reason |
| `notifications` | One record per recipient per alert: email and SMS status, failure reason and acknowledgement |
| `notificationRouting` | Who receives each alert type at each school, and by which channel |
| `notificationRecipients` | Older role-based recipient list used by legacy routing and demo data |
| `alertTypes`, `locations` | Alert types and locations configured by the Company Admin |
| `settings`, `schoolSettings` | Company-wide and per-school settings such as the overdue timeout and retention period |
| `userPreferences` | Each staff member's saved quick alerts |
| `counters` | Sequence used to number incidents (INC001, INC002, ...) |

### Access control

Users never read Firestore directly. Every request goes through the backend, which verifies the Firebase ID token and limits data by role: Staff see their own incidents, School Admins see their own school, and Company Admins see all schools.

### Retention, archiving and deletion

- **Archiving:** the backend runs an archive job when it starts and then every 24 hours. Resolved incidents older than the retention period (30 days unless changed in Setup) are moved to `archivedIncidents`. Archived records are never deleted. A Company Admin can also run it immediately with **Archive Now** in Setup.
- **Deleting incidents:** admins can delete an incident raised by mistake. It is removed from the log, dashboards and analytics, but a copy is kept in `deletedIncidents` for audit.
- **Schools** are deactivated rather than deleted, so their incident history is kept.
- **Clean-up script:** `npm run incidents:cleanup-old` lists old incidents that have no school; `npm run incidents:delete-old` deletes them after review.

### Seeding and test data

- `npm run seed:demo`, `seed:alert-config` and `seed:company-admin` create demo schools, users, routing, alert types and the first Company Admin. See [`server/src/db/SEEDING.md`](server/src/db/SEEDING.md).
- Demo seeding on server start is off unless `SEED_DEMO_DATA=true`, and it never runs when `NODE_ENV=production`.
- For local work without touching live data, use the Firestore emulator: [`FIRESTORE_EMULATOR_SETUP.md`](FIRESTORE_EMULATOR_SETUP.md).
- Test alerts sent from Alert Testing are stored with a TEST marker, notify nobody, and are left out of analytics.

### Secrets

Service account files and `.env` files are listed in `.gitignore` and must never be committed. Hosted environments keep their keys in Render and Vercel environment variables.

## Change log

Dates are when the work was merged to `main`. Pull request numbers refer to the repository the work was merged in at the time: the original team repository (v0.1 to v0.3), the second team repository (v0.4) and this production repository (v0.5 onwards).

### v1.0.0 (18 to 23 October 2026) — production release

- Email and SMS notifications rebuilt: Brevo API for email, ClickSend REST API for SMS, per-channel delivery tracking, failure reasons, delivery-receipt webhooks and Retry (SCRUM-17, #14)
- Notifications page filtering by school, type, channel, status and date (SCRUM-32, #14), and the full school list in its school filter (SCRUM-46, #15)
- Duplicate location names prevented (SCRUM-44, #13)
- School name validation (SCRUM-45, #18) and alert type name validation (SCRUM-47, #16)
- Two alert types with the same name refused, recipient lists kept when an alert type is renamed, and the recipient preview using the same lookup as the real send (SCRUM-37 to 39, #10)
- The same alert can no longer be submitted twice, and a confirmation is shown when an incident fails to save (SCRUM-40, SCRUM-41, #9)
- Test alerts left out of dashboard counts and cards (SCRUM-42, #8, #12); decimal timeouts refused and a blank timeout uses the default (#12)
- A warning shown before deleting a live alert instead of refusing it (SCRUM-43, #11)
- Acknowledgement help banner no longer shown for resolved incidents (SCRUM-48, #17)
- The 000 confirmation code removed from quick alerts, with improved tests (SCRUM-21, #21)
- Tests for dashboard data sources (SCRUM-25, #20) and School Management (#22)
- Simplified Staff dashboard UI and more accessible quick alerts (SCRUM-49, #23)
- Wider two-column Submit Alert form (SCRUM-50) and a mobile navigation drawer (SCRUM-51)
- Production deployment on Vercel, Render and Firebase (SCRUM-23)

### v0.5.0 (10 to 12 October 2026) — move to the production repository

- CORS configured for the production frontend (#1)
- Test setup fix for browser storage (#2)
- A confirmation shown after every way of submitting an alert (SCRUM-11, #3)
- Delete an incident raised by mistake: overdue unacknowledged alerts can be deleted, School Admins can only delete their own test alerts, and a confirmation is shown afterwards (SCRUM-36, #4)
- Simplified Staff Incidents page (SCRUM-34, #5)
- School filtering, alphabetical sorting and incident counts (SCRUM-28, #6)
- Dashboard data sources, metric explanations and legends (SCRUM-25, #7)

### v0.4.0 (24 August to 29 September 2026)

- Schools loaded from the database instead of being hard-coded (SCRUM-14, #82)
- Emergency type dropdown showing all types (SCRUM-10, #83), system-wide input validation (SCRUM-24, #84) and incident numbers (SCRUM-29, #85)
- Submit Alert setup (SCRUM-30, #86) and a preview of the alert before submitting (SCRUM-31, #6)
- Overdue timeout set per school by the School Admin (SCRUM-9, #1) and the retention setting moved to School Admin setup (SCRUM-19, #8)
- Quick emergency alert submission (SCRUM-21, #2)
- Dashboard school filter and sorting (SCRUM-27, #3, #4) and Analytics accuracy fixes with a school filter (SCRUM-15, #89)
- Validation tests (#5) and tests for SCRUM-27 and SCRUM-29 (#7)
- Quick test alert buttons in Alert Testing, a preview of routed recipients and a TEST badge on test incidents (SCRUM-12, #9)
- School Management page (SCRUM-20, #10)
- Incident status kept visible on the Staff dashboard (SCRUM-33, #11)
- Personal quick alert shortcuts for staff (SCRUM-18, #91)

### v0.3.0 (28 May to 5 June 2026)

- Role dashboards and the Staff and School Admin UI aligned with the client's requirements (#71, #72)
- New UI styling, role-based routing and Staff dashboard clean-up (#74, #75)
- Email moved from SendGrid/Twilio to Gmail SMTP (#73), with updated setup and Firebase documentation (#76, #77)
- Incident list caching to reduce Firestore reads (#79, #80) and Analytics test fixes (#78)
- Failed alerts shown on Analytics for School Admins (#81)

### v0.2.0 (1 to 27 May 2026)

- Unit and integration tests for incidents (#29, #30)
- School Admin role and role-based access for Analytics and the dashboard (#32, #33)
- Admin summary email for each alert (#39, #41)
- Dashboard UI changes (#45) and auto-refresh fix (#46)
- Role-based incident workflow that records who progressed each incident (#48, #50)
- Analytics enhancements, location charts and incident status tracking with actor details (#47, #51, #53)
- Authentication required for emergency sends, Sydney timezone for timestamps and staff incident access fixes (#54, #55)
- Analytics and dashboard bug fixes (#57 to #62)
- Settings route and demo users (#63)
- Alert configuration (Company Admin) and email routing (School Admin) in Setup, and notifications scoped by role (#65 to #67)
- Archiving, date range filters and trends, and incident review flags with comments (#69)
- Final unit tests and the GitHub Actions CI pipeline (#49)

### v0.1.0 (27 March to 30 April 2026) — first prototype

- Frontend prototype, role-based access, and the project split into `client/` and `server/`
- Firestore database and server routes (#3)
- Alert history from the database (#5), emergency and alert flow (#6) and backend stability fixes (#7)
- First email and SMS sending (#8)
- Backend authentication with Firestore and frontend login (#10), and demo data with roles and routing (#11)
- API integration across the frontend (#13)
- Acknowledge an alert from an email link, with a live banner and automatic status update (#16 to #24)
- Analytics cache to reduce Firebase reads (#23), incident progression detail and alert categories (#26)
- Firestore emulator setup, seeding and database scripts (#27, #28)

## Git workflow

This is the team's version control policy (see also the Development Guide). `main` is always deployable, because merging to `main` deploys the live system.

1. Start from the latest `main`.

```bash
git checkout main
git pull
```

2. Create a branch for one story or bug, named after its owner or type and the ticket, for example `Rinad/fix-alert-confirmation`, `bugfix/scrum-45-school-name-validation` or `test/scrum-25-dashboard-data-sources`.

```bash
git checkout -b yourname/scrum-xx-short-description
```

3. Commit small, focused changes. Start the message with the ticket and describe the change in plain words, for example `SCRUM-42: Leave test alerts out of the School Admin dashboard cards`.

4. Before opening a pull request, merge the latest `main` into your branch and fix any conflicts there.

```bash
git checkout main
git pull
git checkout your-branch-name
git merge main
```

5. Open a pull request to `main`. A teammate reviews it, and the GitHub Actions pipeline (`.github/workflows/ci.yml`) runs the client and server test suites. Both must pass before merging.

6. Merge, then delete the branch. Check the live site after the deployment finishes.

### Rules

- Never commit `.env` files, service account JSON or any password or API key.
- Do not change or revert a teammate's work without talking to them first.
- Push your branch at least once a day while you work, so nothing is lost.
- Run `npm run lint` in `client/` and the tests in both apps before committing.
