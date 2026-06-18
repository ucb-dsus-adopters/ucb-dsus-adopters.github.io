# ucb-dsus-adopters.github.io

Central home for adopting UC Berkeley Data Science courses. Built with
[MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

## Local development

```bash
pip install -r requirements.txt
mkdocs serve          # live preview at http://127.0.0.1:8000
mkdocs build --strict # fail on broken links / missing includes
```

## How it's organized

- `docs/`: site content.
- `docs/_shared/`: canonical instruction blocks (single source of truth), pulled into
  pages with `{% include %}`. Not rendered as standalone pages.
- `main.py`: `mkdocs-macros` module defining per-course variables (repos, hub, otter
  version, interest form) that drive the shared blocks.
- Licensing is **per-course**, stated directly on each course page, never shared.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which publishes to the `gh-pages`
branch via `mkdocs gh-deploy`. Set the repo's GitHub Pages source to the `gh-pages` branch.
