# DEV15 – mobile WebView central Question Bank preview (staging only)

This is a separate **inactive-by-default** integration seam for MINDli. The new
`central-question-bank-preview.js` script is loaded by `index.html` but
**does not automatically fetch, replace QuizCore questions, or modify gameplay**.
The currently bundled quiz, multiplayer, purchases, and minigames behave as before.

## Manual staging exercise (developer console / test build only)

```js
const client = MindliCentralQuestionBankPreview.createPreview();
const result = await client.sync();
console.log(result);
const sk = await client.loadCached('sk');
console.log(sk.version, sk.rows.length);
```

It checks a full 10-language published release from the read-only staging API:
SK, CS, EN, DE, PL, FR, IT, ES, PT, JA (4,380 questions each, on current release).

A single IndexedDB read-write transaction commits all ten banks and the active
release pointer together. A request aborted or corrupted before commit leaves
the last complete version in place. The caller must explicitly invoke `sync()`.
Storage quota errors reject a cold sync, or return a fallback when the old
release exists. No administrative token or write API is used.

The main native application MUST NOT activate central questions in gameplay
until a separate migration validates that the central `category`,
`difficultyLevel`, and localized answer fields map correctly to existing
`QuizCore` question formats, and ensures that no active quiz/duel mutates.

## Testing

The Node.js fake-network suite is located at
`test/dev15-question-bank-preview.test.mjs`.
CI validates the JavaScript file and runs all tests without a paid macOS build.
Physical WebView IndexedDB persistence and TestFlight / Android installation
remain mandatory pre-release checks.

### Current non-goals

- No production Google Cloud modification or published app update.
- No automatic background syncing while a quiz is running.
- No HU/TR language invented; bank release currently supplies JA as its tenth language.
- This is a preview transport/cache implementation, not yet a playable central-bank release.
