# Stillroom

A quiet little photo library built with Angular and Angular Material. Browse an infinite stream of Picsum photographs, keep favorites in local browser storage, and open any saved image in a full-screen detail view.

## Run locally

Use Node.js 22.22.3 or newer, then install dependencies and start the Angular dev server:

```sh
npm install
npm start
```

Open the local URL printed by Angular CLI. The library is entirely client-side; favorites persist in `localStorage`.

## Checks

```sh
npm test
npm run build
```

The random stream requests new batches after a 200–300 ms simulated delay and uses a native `IntersectionObserver` for infinite scrolling.
