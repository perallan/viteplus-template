# AGENTS.md

## Project

Modern React 19 application built with Bun and Vite (Rolldown).

## Philosophy

Keep the code simple.

Prefer readability over cleverness.

Write code another senior frontend engineer would enjoy maintaining.

## Stack

- React 19
- TypeScript (strict)
- Bun
- Rolldown / Vite
- Zustand
- Vitest
- Testing Library

## Coding Rules

- Never use `any`.
- Prefer composition over inheritance.
- Prefer functional components.
- Keep components focused and small.
- Extract reusable logic into hooks.
- Avoid premature abstraction.
- Prefer early returns.
- Keep functions pure whenever possible.
- Use TypeScript to model the domain.
- Write self-documenting code.
- Avoid unnecessary comments.

## File Structure

Follow the existing folder structure.

Do not create new top-level folders unless clearly justified.

## State

Use Zustand for shared application state.

Avoid React Context unless required.

## Styling

Prefer clean semantic HTML.

Avoid deeply nested JSX.

## Tests

Use Vitest.

Write tests for business logic.

Avoid brittle snapshot tests.

## Architecture

Prefer feature-oriented thinking.

Avoid overengineering.

Choose the simplest solution that scales.

## AI Instructions

Before generating code:

- Think like a senior frontend engineer.
- Explain architectural decisions when they are non-obvious.
- Suggest improvements when appropriate.
- Point out trade-offs.
- Never introduce dependencies without explaining why.

## General Principles

Keep dependencies to a minimum.

Prefer browser APIs over third-party libraries.

Prefer TypeScript over runtime validation whenever possible.

Do not solve imaginary future problems.

If there are two good solutions, recommend the simpler one.

When introducing a new library, explain why the standard library is insufficient.

Optimize for maintainability over cleverness.

## Code Quality

Always keep the project buildable.

Never leave the repository in a broken state.

If introducing a dependency, explain why it is needed.

Prefer deleting code over adding code.

Keep pull requests small and focused.

