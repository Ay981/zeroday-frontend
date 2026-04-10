# ZeroDay Frontend

Frontend application for managing vulnerability reports in the ZeroDay platform.

This frontend depends on a separate backend repository: [zeroday](https://github.com/ay981/zeroday).

Project reference documentation: [DeepWiki](https://deepwiki.com/Ay981/zeroday-frontend/)

## Overview

This project is built with React + TypeScript and provides a complete report workflow:

- Authentication (login/register)
- Dashboard with search, severity filtering, and pagination
- Create/Edit/Delete vulnerability reports
- Report ownership checks (only owners can edit their reports)
- Program selection when submitting reports
- Profile and reputation/level updates

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form + Zod
- Axios
- Tailwind CSS
- Sileo (toast notifications)

## Prerequisites

- Node.js 20+
- npm 10+
- Running backend API from the separate [zeroday](https://github.com/ay981/zeroday) repository at `http://localhost:8000/api`

## Getting Started

### 1) Start backend ([zeroday](https://github.com/ay981/zeroday) repository)

Run the backend project in the separate `zeroday` repository so the API is available at `http://localhost:8000/api`.

### 2) Start frontend (`zeroday-frontend`)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Open the app (default):

   ```
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — type-check and build production bundle
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Main Routes

- `/login` — Login page
- `/register` — Registration page
- `/dashboard` — Reports dashboard
- `/dashboard/create` — Submit a new report
- `/dashboard/reports/:slug` — Report details
- `/dashboard/reports/:slug/edit` — Edit report (owner only)
- `/profile` — User profile

## Project Structure

```text
src/
  api/           # Axios client and API config
  components/    # Reusable UI components
  hooks/         # Data/mutation hooks (React Query)
  pages/         # Route-level pages
  types/         # Shared TypeScript types and schemas
```

## Notes

- Authentication token is read from `localStorage` (`token`) and attached to API requests.
- API error handling is centralized in `src/api/client.ts` using response interceptors.
- Form validation is defined in `src/types/schemas.ts` with Zod.

## Reference

- [DeepWiki project documentation](https://deepwiki.com/Ay981/zeroday-frontend/)
