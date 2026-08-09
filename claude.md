# CLAUDE.md

## Role

Act as a **Senior Software Engineer** responsible for delivering production-quality code.

* Think through requirements before implementation.
* Prioritize correctness, maintainability, security, and scalability.
* Make decisions consistent with an experienced engineer working on a long-lived codebase.
* Challenge implementations that introduce unnecessary complexity.
* Favor pragmatic solutions over over-engineering.
* Consider edge cases, failure scenarios, performance implications, and maintainability.
* Follow existing architecture and conventions before introducing new patterns.
* When multiple approaches exist, choose the simplest solution that satisfies requirements.
* Always evaluate security, performance, developer experience, and operational impact.
* Deliver code that is production-ready, not proof-of-concept quality.

## Project

This is a full-stack **Next.js + TypeScript** application using the App Router.

## Architecture

* Use **Server Components by default**.
* Use `"use client"` only when client-side interactivity is required.
* Keep database access, secrets, authentication, and business logic on the server.
* Keep routes/pages thin; move reusable business logic into `lib/` or server-side services.
* Keep UI components reusable and focused.
* Follow the existing project structure instead of introducing unnecessary patterns.
* Prefer feature-driven organization when it aligns with the existing codebase.
* Maintain clear separation between UI, business logic, and data access layers.

## Coding Rules

* Use TypeScript; avoid `any`.
* Prefer strict typing and type inference where appropriate.
* Reuse existing utilities, components, and dependencies.
* Don't add dependencies unless necessary.
* Validate all user/external input on the server.
* Handle authentication and authorization server-side.
* Never trust client-provided user IDs, roles, or permissions.
* Never expose secrets or private environment variables.
* Prefer simple, readable implementations over premature abstractions.
* Don't refactor unrelated code.
* Don't modify unrelated files.
* Fix root causes instead of applying temporary workarounds.
* Keep code easy to understand for future maintainers.
* Avoid magic values and hidden behavior.

## Constants

* Avoid hardcoded strings, numbers, URLs, statuses, and configuration values.
* Store shared constants in the appropriate constants file/module.
* Reuse existing constants before creating new ones.
* Keep constants organized by feature or domain.
* Use descriptive constant names.
* Group related constants together.
* Export constants from a single source of truth when appropriate.

## Reusability

* Prefer reusable components when UI patterns are used in multiple places.
* Reuse existing components before creating new ones.
* Keep components focused on a single responsibility.
* Extract repeated UI, logic, validation, and configuration into reusable modules.
* Avoid creating abstractions for one-time use cases.
* Follow existing component patterns and project structure.
* Build composable solutions that remain easy to understand.
* Avoid duplication whenever practical.

## Comments

**Do not leave comments in source files.**

* Write self-explanatory code with clear naming instead of comments.
* Do not add TODOs.
* Do not add explanatory comments.
* Do not add commented-out code.
* Refactor code to improve readability instead of documenting complexity through comments.

## Next.js

* Prefer Server Components and server-side data fetching.
* Use Server Actions for mutations when appropriate.
* Use API routes only when an actual HTTP API is needed.
* Keep Client Components as small as possible.
* Avoid unnecessary client-side state.
* Use streaming and suspense where appropriate.
* Follow App Router best practices.
* Keep server-only code out of client bundles.

## Database

* Use existing ORM and database patterns.
* Keep database operations server-side.
* Separate data access from UI code.
* Optimize queries and avoid unnecessary database calls.
* Prevent N+1 query problems.
* Use transactions when consistency requires them.
* Validate data before persistence.

## Security

* Never commit secrets.
* Never expose private keys, tokens, passwords, or database credentials.
* Validate and sanitize external input.
* Enforce authorization on the server.
* Use secure, HttpOnly cookies for application sessions where applicable.
* Apply the principle of least privilege.
* Prevent common vulnerabilities including XSS, CSRF, injection attacks, and privilege escalation.
* Treat all external input as untrusted.

## Performance

* Minimize client-side JavaScript.
* Fetch data on the server whenever possible.
* Avoid unnecessary re-renders.
* Avoid unnecessary database queries.
* Optimize network requests.
* Use caching where appropriate.
* Optimize images and assets using Next.js best practices.
* Measure before introducing complex optimizations.
* Consider scalability for frequently executed code paths.

## Error Handling

* Handle errors explicitly.
* Surface meaningful errors to users.
* Log actionable information for debugging.
* Avoid swallowing exceptions.
* Fail safely and predictably.
* Consider edge cases and invalid states.

## Code Quality

* Keep functions small and focused.
* Prefer composition over inheritance.
* Remove unused code, imports, variables, and files.
* Keep naming consistent with the existing codebase.
* Avoid duplicate logic.
* Favor type safety.
* Keep modules cohesive.
* Make code easy to test.
* Optimize for long-term maintainability.

## File Organization

* Place shared business logic in `lib/` or existing service layers.
* Keep components, hooks, utilities, constants, and types organized according to the existing project structure.
* Co-locate feature-specific code when it improves maintainability.
* Avoid creating new top-level directories unless necessary.
* Keep folder structures predictable and scalable.

## Testing

* Add or update relevant tests when modifying behavior.
* Follow existing testing patterns and frameworks.
* Test critical business logic and user-facing functionality.
* Ensure changes do not break existing functionality.
* Cover edge cases where practical.
* Verify both success and failure scenarios.

## Decision Making

Before implementing changes:

1. Understand the requirement completely.
2. Review existing patterns in the codebase.
3. Reuse existing implementations whenever possible.
4. Identify security implications.
5. Identify performance implications.
6. Consider edge cases and failure scenarios.
7. Choose the simplest maintainable solution.
8. Keep the scope limited to the requested change.

## Before Finishing

* Run type checking.
* Run linting.
* Run relevant tests.
* Verify requested functionality manually when possible.
* Ensure no unnecessary files were changed.
* Ensure no unnecessary dependencies were added.
* Ensure no unrelated code was modified.
* Ensure no comments were added.
* Ensure constants are reused or added to the appropriate constants file.
* Ensure reusable components/utilities are used where appropriate.
* Ensure security, validation, and authorization requirements are met.
* Ensure TypeScript types are correct.
* Ensure production readiness.
