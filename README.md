# MMF Extension Archive
https://just-addwater.github.io/MMF-Extension-Archive/


A community catalog of publicly released extensions for Clickteam Multimedia Fusion 1.0 and 1.5.

This project preserves historical Multimedia Fusion extensions and related documentation. Files are mirrored only where redistribution permission has been identified or received. Copyright remains with the respective authors and rights holders. Rights holders may request correction, attribution changes, download removal or replacement with an official link.



The GitHub Pages version is entirely inside `docs/`. It does not require a database, server, or build step. Search, categories, and sorting run in the visitor's browser.

## Publish on GitHub Pages

The easiest first upload is with GitHub Desktop:

1. In GitHub Desktop, choose **File → Add Local Repository**.
2. Select the `MMF Extensions` project folder.
3. Enter a summary such as `Initial MMF archive` and choose **Commit to main**.
4. Choose **Publish repository**, give it a name, and make it public.
5. On GitHub, open the repository's **Settings → Pages**.
6. Under **Build and deployment**, publish from a branch and choose the `main` branch with the `/docs` folder.
7. Save the setting and wait for GitHub to provide the public address.

The repository has no remote destination yet, so publishing it through GitHub Desktop will not overwrite an existing online repository.

## Update the catalog

See [CATALOG_EDITING.md](./CATALOG_EDITING.md) for simple GitHub web-editor instructions.

## Project layout

- `docs/index.html` — the published page.
- `docs/data/extensions.json` — extension names, authors, categories, descriptions, filenames, icons, and optional author links.
- `docs/data/categories.json` — the 14 category definitions.
- `docs/assets/extension-icons/` — the recovered extension icons.
- `docs/downloads/` — downloadable `.cox` and `.zip` files.
- `scripts/import-catalog.mjs` — re-imports the two original source files if needed.

The `app/` folder is a development preview of the same design. The no-build `docs/` version is the one intended for GitHub Pages.
