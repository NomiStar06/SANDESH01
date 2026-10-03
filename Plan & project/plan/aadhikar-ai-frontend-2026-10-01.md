# Aadhikar.ai frontend

## Goal
Build a complete, mobile-first public-service guidance website for rural Indian users, following the uploaded accessibility brief.

## Pages and flow
- Replace the placeholder home page with an immediate action hub.
- Add a shared high-contrast header with Aadhikar.ai branding, the supplied tagline, and a cycling English/मराठी/हिन्दी language beacon.
- Add six large, tactile scheme categories. Selecting one opens the chat page with that request pre-filled.
- Add a dedicated chat page with readable high-contrast messages, a fixed composer, a large microphone control, and audio playback controls on assistant replies.
- Keep this frontend-only: responses will be a polished local demonstration rather than a live AI service.

## Visual and accessibility direction
- Use the specified cream, deep forest green, dark slate, and saffron palette through semantic design tokens.
- Use large type, thick borders, restrained shadows, 48px minimum targets, strong keyboard focus states, and no heavy animation.
- Preserve a compact first screen on phones while expanding to a two-column action grid on larger screens.
- Include clear labels and ARIA support for all interactive controls.

## Technical details
- Implement shared navigation in the TanStack root layout and separate `/` and `/chat` routes.
- Use React state/effects for language cycling, prompt handoff, local chat interaction, microphone status, and browser speech synthesis where supported.
- Add unique metadata for both routes.
- Verify the finished pages in desktop and mobile-sized browser views and resolve preview errors.
