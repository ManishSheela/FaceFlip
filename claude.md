# CLAUDE.md

## Project

This is a full-stack **Next.js + TypeScript** application using the App Router.

## Architecture

* Use **Server Components by default**.
* Use `"use client"` only when client-side interactivity is required.
* Keep database access, secrets, authentication, and business logic on the server.
* Keep routes/pages thin; move reusable business logic into `lib/` or server-side services.
* Keep UI components reusable and focused.
* Follow the existing project structure instead of introducing unnecessary patterns.

## Coding Rules

* Use TypeScript; avoid `any`.
* Reuse existing utilities, components, and dependencies.
* Don't add dependencies unless necessary.
* Validate all user/external input on the server.
* Handle authentication and authorization server-side.
* Never trust client-provided user IDs, roles, or permissions.
* Never expose secrets or private environment variables.
* Prefer simple, readable implementations over premature abstractions.
* Don't refactor unrelated code.
* Don't modify unrelated files.

## Comments

**Do not leave comments in source files.**

Write self-explanatory code with clear naming instead of comments. Do not add TODOs, explanatory comments, or commented-out code.

## Next.js

* Prefer Server Components and server-side data fetching.
* Use Server Actions for mutations when appropriate.
* Use API routes only when an actual HTTP API is needed.
* Keep Client Components as small as possible.

## Database

Use the existing ORM/database patterns.

Keep database operations server-side and separate from UI components.

## Security

* Never commit secrets.
* Never expose private keys, tokens, passwords, or database credentials.
* Validate and sanitize external input.
* Enforce authorization on the server.
* Use secure, HttpOnly cookies for application sessions where applicable.

## Before Finishing

* Run type checking.
* Run linting.
* Run relevant tests.
* Verify the requested functionality.
* Ensure no unnecessary files or dependencies were changed.
* Ensure no comments were added to source files.
