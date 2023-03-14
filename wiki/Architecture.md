This project uses Next.js with React to make the magic ✨ happen. Everything is
done client-side, so there's no server-side rendering. We even get to deploy the
static site to GitHub Pages!

## Components

If we look at the homepage, you can clearly break it up into components:

![](https://user-images.githubusercontent.com/61068799/224442046-9aaf6a52-12d2-436d-bab1-c2cecbc3fe6d.png)

- Header
- RegExpForm
- Footer
- EnginePreview
- MatchList
- MatchDAG

Each of these components (along with a few others) are in the `src/components/`
directory. If you're looking for the actual page markup, it's in `src/pages/`.

## State

We manage state using the React hooks API. There are two primary states that we
need to manage:

- How the user is interacting with the input form
- The current state of the engine

In particular, the current state of the engine is what we use to render the
MatchDAG, the EnginePreview, and the MatchList.
