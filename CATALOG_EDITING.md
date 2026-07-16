# Editing the MMF Extension Archive

The published GitHub Pages site reads directly from `docs/data/extensions.json`. That means ordinary catalog edits need no build tools and can be made in GitHub's website.

## Replace a temporary download filename

1. Open `docs/data/extensions.json` in the repository and choose **Edit**.
2. Find the extension by its name.
3. Change its `filename` from a temporary value such as `temp-168.cox` to the real filename, preserving capitalization.
4. Upload that same file to `docs/downloads/`.
5. Commit both changes.

The red filename link in the catalog will then download the uploaded file. Leave `downloadUrl` as `null` for files stored in the repository.

## Link a download to another website

Downloads can point anywhere, including a GitHub Release, another archive, or an information page. Set `downloadUrl` to the complete address:

```json
"filename": "example.cox",
"downloadUrl": "https://example.com/downloads/example.cox"
```

An external link opens in a new tab. To switch the entry back to a file in `docs/downloads/`, use `"downloadUrl": null`.

## Add an author link

Most entries have this:

```json
"author": "Jamie Beatson",
"authorUrl": null
```

When a Wayback URL is available, change only `authorUrl`:

```json
"author": "Jamie Beatson",
"authorUrl": "https://web.archive.org/web/20060201000000/http://example.com/"
```

The author's name automatically becomes a link. Leave `authorUrl` as `null` when there is no link.

## Add a new extension

Add a new object inside the outer `[` and `]` in `docs/data/extensions.json`:

```json
{
  "id": 1001,
  "name": "Example Object",
  "version": "1.0",
  "author": "Example Author",
  "authorUrl": null,
  "category": "System",
  "description": "A short description of what the extension does.",
  "filename": "example.cox",
  "downloadUrl": null,
  "icon": "example.gif",
  "sourceUrl": "https://web.archive.org/"
}
```

Then:

1. Give the entry a unique number in `id`.
2. Use one of the existing category names exactly as written.
3. Upload its icon to `docs/assets/extension-icons/`, or use `"icon": null` for the built-in placeholder.
4. Upload the `.cox` or `.zip` file to `docs/downloads/` and make `filename` match it exactly, or provide an external `downloadUrl`.
5. Put a comma between entries, but not after the final entry.
6. Commit the changes. The live site updates after GitHub Pages republishes it.

## Available categories

- Data Storage
- Date/Time
- Function/Looping
- Game objects
- Graphical
- Input
- Internet/Communication
- Maths
- Misc.
- Sound & Music
- System
- Text manipulation
- Transitions
- Windows controls/dialogues

