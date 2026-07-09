# School Management System — Fee Management Module

Module-by-module build. This covers **Module 1: Student Management** and the
first slice of **Module 2: Fee Collection** (Deposit Fee), scaffolded with a
layered architecture so every future module plugs into the same pattern.

## Folder Structure

```
src/
├── config/          # env loading, DB connection — no business logic
├── controllers/      # req/res only — picks a service method, shapes ApiResponse
├── services/          # ALL business logic lives here — calls repositories
├── middlewares/         # validate.middleware (zod), errorHandler.middleware
├── routes/               # Router definitions per module + index.ts aggregator
├── models/                # Mongoose schemas/models
├── types/                  # Shared TS interfaces/enums (no runtime code)
├── repositories/            # ONLY layer that talks to Mongoose/DB
├── utils/                    # ApiError, ApiResponse, asyncHandler, helpers
├── validations/                # Zod schemas per module
├── app.ts                       # Express app wiring
└── server.ts                     # Entry point: connect DB, start server
```

## Request Flow

```
routes → middlewares(validate) → controller → service → repository → model → MongoDB
                                       ↓            ↓
                                 (thin, no      (ALL business rules,
                                  business        due/total recalculation,
                                  logic)          uniqueness checks, etc.)
                                       ↓
                              ApiResponse / ApiError
```

Rules to keep this consistent as you add modules:

1. **Controllers never contain business logic.** They parse the request,
   call exactly one service method, and shape the `ApiResponse`.
2. **Services never touch Express** (no `req`/`res`) and never touch
   Mongoose directly — they call repositories. All uniqueness checks,
   due/total recalculation, and cross-entity rules live here.
3. **Repositories never know about business rules.** Pure data access —
   `create`, `findById`, `updateById`, aggregations, etc.
4. **Validation happens in middleware**, before the controller runs.
5. **Every thrown error must be an `ApiError`**; every success response uses
   `ApiResponse`.

## Module 1 — Student Management (CRUD)

`student.routes.ts → student.controller.ts → student.service.ts → student.repository.ts → student.model.ts`

- Full CRUD + search/filter/pagination.
- Business Rule 1 & 2 enforced in `student.service.ts` (unique admission
  number; roll number unique per class).
- `totalFee`/`dueFee` are denormalized fields on the Student document.
  They're correct on creation via the schema's `default` functions, but
  **only `student.service.ts` keeps them correct after that** — whenever
  `tuitionFee`/`hostelFee`/`miscellaneousFee` change on update, the service
  recalculates `totalFee` and re-derives `dueFee` against the student's
  actual payment history (via `paymentRepository.sumByStudent`), rather than
  trusting a stale stored value.

## Module 2 (slice) — Fee Deposit

`payment.routes.ts → payment.controller.ts → payment.service.ts → payment.repository.ts / student.repository.ts`

| Method | Route                          | Description                              |
|--------|--------------------------------|--------------------------------------------|
| POST   | /api/v1/payments                | Deposit a fee payment against a student      |
| PATCH  | /api/v1/payments/:id             | Update Deposit — correct a wrong amount/mode  |
| DELETE | /api/v1/payments/:id              | Delete a deposit (Business Rule 5)              |
| GET    | /api/v1/payments/student/:studentId | Payment history for a student                    |

Key rules encoded in `payment.service.ts`:

- **Deposit cannot exceed the outstanding due** (Business Rule 3 — no
  advance payments yet).
- **Receipt numbers are atomic**, generated via a `Counter` collection
  (`counter.repository.ts`) incremented with `findByIdAndUpdate` + `$inc` +
  `upsert`, avoiding race conditions a "count and add 1" approach would have.
  Format: `RCP-2026-00001`.
- **Update Deposit recalculates `dueFee` from the full payment history**
  (total fee − sum of all other payments − new amount), not a simple delta
  adjustment — so due can never drift even across repeated corrections
  (Business Rule 6).
- **Delete Deposit** recalculates due the same way (Business Rule 5).

## Setup

```bash
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run dev                # ts-node + nodemon
```

## Adding Module 3 (e.g. Receipts / Dashboard / Reports) — pattern to follow

```
src/types/<module>.types.ts
src/validations/<module>.validation.ts
src/models/<module>.model.ts
src/repositories/<module>.repository.ts
src/services/<module>.service.ts        ← business logic goes here, not in the controller
src/controllers/<module>.controller.ts   ← thin: parse request, call service, respond
src/routes/<module>.routes.ts             → registered in src/routes/index.ts
```

