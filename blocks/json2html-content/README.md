# JSON2HTML Content Block

## Overview

This block decorates content that is rendered by the [JSON2HTML overlay](https://www.aem.live/developer/json2html) for Adobe Edge Delivery Services. Use it inside BYOM (Bring Your Own Markup) Mustache templates so that JSON from a headless CMS or API is turned into EDS-friendly HTML and this block styles and structures it.

## Integration

### Block Configuration

| Configuration Key | Type | Default | Description | Required |
|-------------------|------|---------|-------------|----------|
| _(none)_ | — | — | Content is driven by the Mustache template output. | — |

### Behavior

- **First row** without an image or list is treated as a **title**.
- Rows with **images** get the `json2html-content-image` class and media styling.
- Rows with **lists** (`ul`/`ol`) get list styling.
- Rows with a **short link** (CTA) get button-style styling.
- All other rows are treated as **body** text.

No URL parameters or localStorage are used.

## JSON2HTML Setup

### 1. Add the overlay to your content source

In your [fstab](https://www.aem.live/developer/content-source) (or Admin UI content source config), add:

```json
"overlay": {
  "url": "https://json2html.adobeaem.workers.dev/<ORG>/<SITE>/<BRANCH>",
  "type": "markup"
}
```

Replace `<ORG>`, `<SITE>`, and `<BRANCH>` with your repo details.

### 2. POST the JSON2HTML config

```bash
curl -X POST \
  https://json2html.adobeaem.workers.dev/config/<ORG>/<SITE>/<BRANCH> \
  -H "Authorization: token <your-admin-token>" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "path": "/dynamic/",
      "endpoint": "https://your-api.example.com/items/{{id}}.json",
      "regex": "/[^/]+$/",
      "template": "/templates/json2html-demo/template.html",
      "headers": {
        "Accept": "application/json"
      }
    }
  ]'
```

### 3. Sample Mustache template

Create a template at e.g. **`/templates/json2html-demo/template.html`** in your repo (under the same org/site/branch). This markup is BYOM-friendly and uses the `json2html-content` block:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <meta name="description" content="{{description}}">
  {{#tags}}
  <meta name="tags" content="{{#tags}}{{.}},{{/tags}}">
  {{/tags}}
</head>
<body>
  <main>
    <div>
      <div class="block json2html-content">
        <div>
          <div>{{title}}</div>
        </div>
        {{#image}}
        <div>
          <div>
            <img src="{{image}}" alt="{{imageAlt}}">
          </div>
        </div>
        {{/image}}
        <div>
          <div>{{{body}}}</div>
        </div>
        <div>
          <div>
            <ul>
              {{#items}}
              <li>{{.}}</li>
              {{/items}}
            </ul>
          </div>
        </div>
        {{#ctaUrl}}
        <div>
          <div><a href="{{ctaUrl}}">{{ctaText}}</a></div>
        </div>
        {{/ctaUrl}}
      </div>
    </div>
  </main>
</body>
</html>
```

- Use `{{{body}}}` (triple mustache) if `body` contains HTML.
- Adjust sections (image, list, CTA) to match your JSON; the block will still decorate by detecting images, lists, and links.

### 4. Example JSON payload

Your API should return JSON that matches the template variables, for example:

```json
{
  "title": "Welcome to JSON2HTML",
  "description": "Dynamic content from your API.",
  "image": "https://example.com/photo.jpg",
  "imageAlt": "Photo",
  "body": "<p>This page was built from JSON using a Mustache template and the JSON2HTML overlay.</p>",
  "items": ["Feature one", "Feature two", "Feature three"],
  "ctaText": "Learn more",
  "ctaUrl": "/docs"
}
```

### 5. Preview

Preview a URL under the configured `path` (e.g. `/dynamic/my-item/`). The worker will fetch JSON (with `{{id}}` → `my-item`), render the template, and serve HTML. The `json2html-content` block will then run on that HTML like any other EDS block.

## References

- [JSON2HTML for Edge Delivery Services](https://www.aem.live/developer/json2html)
- [BYOM (Bring your own markup)](https://www.aem.live/developer/byom)
