# Playful Avatars

Playful avatars is a zero-dependency SVG-based avatar generator, distributed as a custom element (web component). It is a fork/rewrite of the popular [Boring avatars](https://github.com/boringdesigners/boring-avatars) library, but without React.

**Features:**

* Generates a custom avatar for any username
* Bring your own color palette
* Zero-dependencies
* No build step
* Generated SVGs are exactly the same as Boring avatars to serve as a drop-in replacement if you want to ditch React

[Demo](https://cmaas.github.io/playful-avatars/demo/)

## Usage

Via npm:

```sh
npm install playful-avatars
```

```js
import 'playful-avatars';
```

Or as a `<script>` tag:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/playful-avatars/index.js"></script>
```

Then use the HTML:

```html
<playful-avatar name="Maria Mitchell"></playful-avatar>
```

Including the script automatically defines the custom element.

### Props & Attributes

Props are reflected as attributes. `colors` as prop is an array of hex colors. `colors` as attribute is a string of hex colors separated by commas.

| Prop    | Type                                                         | Default                                                   |
|---------|--------------------------------------------------------------|-----------------------------------------------------------|
| size    | number or string                                             | *depends on variant, make sure to specify size in CSS*    |
| square  | boolean                                                      | `false`                                                   |
| title   | boolean                                                      | `false`                                                   |
| name    | string                                                       | `Clara Barton`                                            |
| variant | oneOf: `beam`, `marble`, `pixel`,`sunset`, `ring`, `bauhaus` | `beam`                                                    |
| colors (prop)  | array                                                 | `['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']` |
| colors (attribute)  | string                                           | `#92A1C6,#146A7C,#F0AB3D,#C271B4,#C20D90`                 |

#### Name
The `name` prop is mandatory and is used to generate the avatar. It can be the username, email or any random string.

```html
<playful-avatar name="Maria Mitchell"></playful-avatar>
```

#### Variant
The `variant` prop is used to change the theme of the avatar. The available variants are: `beam`, `marble`, `pixel`, `sunset`, `ring` and `bauhaus`.

```html
<playful-avatar name="Alice Paul" variant="marble"></playful-avatar>
```

#### Colors
The `colors` prop is used to change the color palette of the avatar:

```html
<playful-avatar name="Grace Hopper" colors="#fb6900,#f63700,#004853,#007e80,#00b9bd"></playful-avatar>
```

The `#` is optional:

```html
<playful-avatar name="Grace Hopper" colors="fb6900,f63700,004853,007e80,00b9bd"></playful-avatar>
```

Set the colors prop in JavaScript:

```js
const el = document.getElementsByTagName('playful-avatar')[0];
el.colors = ['#fb6900', '#f63700', '#004853', '#007e80', '#00b9bd'];
el.colors = '#fb6900,#f63700,#004853,#007e80,#00b9bd'; // works too
```

### Differences from Boring avatars

* Removed prop `size` in favor of setting width and height in CSS
* Removed prop `square` in favor of using CSS to create many more border shapes, styles, shadows, etc.
* Default avatar shape is a square, because the SVG is always square
* Set default variant to `beam` instead of `marble`
* Single file, no build step, less complexity

### CSS Styling

Playful avatars uses the shadow DOM, but the SVG is exposed as `part="svg"`.

#### Avatar size

```css
playful-avatar {
	width: 80px;
	height: 80px;
}
```

Or

```css
playful-avatar::part(svg) {
	width: 80px;
	height: 80px;
}
```

#### Border shapes

Make the avatar a circle with CSS:

```css
playful-avatar::part(svg) {
	border-radius: 50%;
}
```

A rounded rectangle with a black border and a box shadow:

```css
playful-avatar::part(svg) {
	border-radius: 10px;
	border: 2px black;
	box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 12px 0px;
}
```

## Additional notes

* Forked from v1.11.2 on 2025-01-29
* Why did I fork? A small self-contained element like this is the perfect candidate for a custom element. I don't use React and it's unfortunate that the original library is React-only.
* Thanks to [boringdesigners](https://github.com/boringdesigners) and contributors for the great work on the original library