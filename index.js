/*
 *********** UTILS ***********
 */
const hashCode = (name) => {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		let character = name.charCodeAt(i);
		hash = ((hash << 5) - hash) + character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

const getDigit = (number, index) => {
	const d = Math.floor((number / Math.pow(10, index)) % 10);
	return d;
};

const getBoolean = (number, index) => {
	return (!((getDigit(number, index)) % 2));
};

const getUnit = (number, range, index) => {
	const value = number % range;

	if (index && ((getDigit(number, index) % 2) === 0)) {
		return -value;
	}
	return value;
};

const getRandomColor = (number, colors, range) => {
	return colors[(number) % range];
};

const getContrastColor = (hexcolor) => {
	hexcolor = hexcolor.replace('#', '');

	// Convert to RGB value
	const r = parseInt(hexcolor.substr(0, 2), 16);
	const g = parseInt(hexcolor.substr(2, 2), 16);
	const b = parseInt(hexcolor.substr(4, 2), 16);

	// Get YIQ ratio
	const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Check contrast
	return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

const sanitizeColors = (colors) => {
	if (Array.isArray(colors)) {
		return colors.map(color => '#' + color.replace(/[^0-9A-Fa-f]/g, ''));
	}
	else if (typeof colors === 'string') {
		return sanitizeColors(colors.split(','));
	}
	return [];
};

/*
 *********** BEAM ***********
 */
function generateBeamData(name, colors, size) {
	const numFromName = hashCode(name);
	const range = colors && colors.length;
	const wrapperColor = getRandomColor(numFromName, colors, range);
	const preTranslateX = getUnit(numFromName, 10, 1);
	const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + size / 9 : preTranslateX;
	const preTranslateY = getUnit(numFromName, 10, 2);
	const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + size / 9 : preTranslateY;

	const data = {
		wrapperColor: wrapperColor,
		faceColor: getContrastColor(wrapperColor),
		backgroundColor: getRandomColor(numFromName + 13, colors, range),
		wrapperTranslateX: wrapperTranslateX,
		wrapperTranslateY: wrapperTranslateY,
		wrapperRotate: getUnit(numFromName, 360),
		wrapperScale: 1 + getUnit(numFromName, size / 12) / 10,
		isMouthOpen: getBoolean(numFromName, 2),
		isCircle: getBoolean(numFromName, 1),
		eyeSpread: getUnit(numFromName, 5),
		mouthSpread: getUnit(numFromName, 3),
		faceRotate: getUnit(numFromName, 10, 3),
		faceTranslateX: wrapperTranslateX > size / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
		faceTranslateY: wrapperTranslateY > size / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2),
	};

	return data;
}

function generateBeamSVG(name, colors, useTitle) {
	const size = 36; // viewBox
	const data = generateBeamData(name, colors, size);
	return `<svg part="svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
		${useTitle ? `<title>${name}</title>` : ''}
		<g>
			<rect width="${size}" height="${size}" fill="${data.backgroundColor}" />
			<rect x="0" y="0" width="${size}" height="${size}" transform="translate(${data.wrapperTranslateX} ${data.wrapperTranslateY}) rotate(${data.wrapperRotate} ${size / 2} ${size / 2}) scale(${data.wrapperScale})" fill="${data.wrapperColor}" rx="${data.isCircle ? size : size / 6}" />
			<g transform="translate(${data.faceTranslateX} ${data.faceTranslateY}) rotate(${data.faceRotate} ${size / 2} ${size / 2})">
				${data.isMouthOpen
				? `<path d="M15 ${19 + data.mouthSpread}c2 1 4 1 6 0" stroke="${data.faceColor}" fill="none" strokeLinecap="round" />`
				: `<path d="M13,${19 + data.mouthSpread} a1,0.75 0 0,0 10,0" fill="${data.faceColor}" />`
				}
				<rect x="${14 - data.eyeSpread}" y="14" width="1.5" height="2" rx="1" stroke="none" fill="${data.faceColor}" />
				<rect x="${20 + data.eyeSpread}" y="14" width="1.5" height="2" rx="1" stroke="none" fill="${data.faceColor}" />
			</g>
		</g>
	</svg>`;
}

/*
 *********** MARBLE ***********
 */
function generateMarbleData(name, colors, elements, size) {
	const numFromName = hashCode(name);
	const range = colors && colors.length;

	const elementsProperties = Array.from({ length: elements }, (_, i) => ({
		color: getRandomColor(numFromName + i, colors, range),
		translateX: getUnit(numFromName * (i + 1), size / 10, 1),
		translateY: getUnit(numFromName * (i + 1), size / 10, 2),
		scale: 1.2 + getUnit(numFromName * (i + 1), size / 20) / 10,
		rotate: getUnit(numFromName * (i + 1), 360, 1),
	}));

	return elementsProperties;
}

function generateMarbleSVG(name, colors, useTitle) {
	const size = 80; // viewBox
	const filterID = `r${hashCode(name)}`;
	const data = generateMarbleData(name, colors, 3, size);
	return `<svg part="svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
		${useTitle ? `<title>${name}</title>` : ''}
		<g>
			<rect width="${size}" height="${size}" fill="${data[0].color}" />
			<path
				filter="url(#filter_${filterID})"
				d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
				fill="${data[1].color}"
				transform="translate(${data[1].translateX} ${data[1].translateY}) rotate(${data[1].rotate} ${size / 2} ${size / 2}) scale(${data[2].scale})"
			/>
			<path
				filter="url(#filter_${filterID})"
				style="mix-blend-mode: overlay"
				d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
				fill="${data[2].color}"
				transform="translate(${data[2].translateX} ${data[2].translateY}) rotate(${data[2].rotate} ${size / 2} ${size / 2}) scale(${data[2].scale})"
			/>
		</g>
		<defs>
			<filter id="filter_${filterID}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
			</filter>
		</defs>
	</svg>`;
}

/*
 *********** PIXEL ***********
 */
function generatePixelData(name, colors, elements) {
	const numFromName = hashCode(name);
	const range = colors && colors.length;

	const colorList = Array.from({ length: elements }, (_, i) =>
		getRandomColor(numFromName % (i + 1), colors, range),
	);

	return colorList;
}

function generatePixelSVG(name, colors, useTitle) {
	const size = 80;
	const colorsList = generatePixelData(name, colors, 64, size);
	const coordinates = [
		{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 40, y: 0 }, { x: 60, y: 0 }, { x: 10, y: 0 }, { x: 30, y: 0 }, { x: 50, y: 0 }, { x: 70, y: 0 },
		{ x: 0, y: 10 }, { x: 0, y: 20 }, { x: 0, y: 30 }, { x: 0, y: 40 }, { x: 0, y: 50 }, { x: 0, y: 60 }, { x: 0, y: 70 }, { x: 20, y: 10 },
		{ x: 20, y: 20 }, { x: 20, y: 30 }, { x: 20, y: 40 }, { x: 20, y: 50 }, { x: 20, y: 60 }, { x: 20, y: 70 }, { x: 40, y: 10 }, { x: 40, y: 20 },
		{ x: 40, y: 30 }, { x: 40, y: 40 }, { x: 40, y: 50 }, { x: 40, y: 60 }, { x: 40, y: 70 }, { x: 60, y: 10 }, { x: 60, y: 20 }, { x: 60, y: 30 },
		{ x: 60, y: 40 }, { x: 60, y: 50 }, { x: 60, y: 60 }, { x: 60, y: 70 }, { x: 10, y: 10 }, { x: 10, y: 20 }, { x: 10, y: 30 }, { x: 10, y: 40 },
		{ x: 10, y: 50 }, { x: 10, y: 60 }, { x: 10, y: 70 }, { x: 30, y: 10 }, { x: 30, y: 20 }, { x: 30, y: 30 }, { x: 30, y: 40 }, { x: 30, y: 50 },
		{ x: 30, y: 60 }, { x: 30, y: 70 }, { x: 50, y: 10 }, { x: 50, y: 20 }, { x: 50, y: 30 }, { x: 50, y: 40 }, { x: 50, y: 50 }, { x: 50, y: 60 },
		{ x: 50, y: 70 }, { x: 70, y: 10 }, { x: 70, y: 20 }, { x: 70, y: 30 }, { x: 70, y: 40 }, { x: 70, y: 50 }, { x: 70, y: 60 }, { x: 70, y: 70 }
	];
	return `<svg part="svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
		${useTitle ? `<title>${name}</title>` : ''}
		<g>
			${coordinates.map((c, i) => `<rect x="${c.x}" y="${c.y}" width="10" height="10" fill="${colorsList[i]}" />`).join('\n')}
		</g>
	</svg>`;
}

/*
 *********** SUNSET ***********
 */
function generateSunsetData(name, colors, elements) {
	const numFromName = hashCode(name);
	const range = colors && colors.length;

	const colorsList = Array.from({ length: elements }, (_, i) =>
		getRandomColor(numFromName + i, colors, range),
	);

	return colorsList;
}

function generateSunsetSVG(name, colors, useTitle) {
	const size = 80;
	const colorsList = generateSunsetData(name, colors, 4, size);
	const filterID = `r${hashCode(name)}`;
	return `<svg part="svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
		${useTitle ? `<title>${name}</title>` : ''}
		<g>
			<path fill="url(#gradient_paint0_linear_${filterID})" d="M0 0h80v40H0z" />
			<path fill="url(#gradient_paint1_linear_${filterID})" d="M0 40h80v40H0z" />
		  </g>
		  <defs>
			<linearGradient id="gradient_paint0_linear_${filterID}" x1="${size / 2}" y1="0" x2="${size / 2}" y2="${size / 2}" gradientUnits="userSpaceOnUse">
				  <stop stop-color="${colorsList[0]}" />
				  <stop offset="1" stop-color="${colorsList[1]}" />
			</linearGradient>
			<linearGradient id="gradient_paint1_linear_${filterID}" x1="${size / 2}" y1="${size / 2}" x2="${size / 2}" y2="${size}" gradientUnits="userSpaceOnUse">
				  <stop stop-color="${colorsList[2]}" />
				  <stop offset="1" stop-color="${colorsList[3]}" />
			</linearGradient>
		  </defs>
	</svg>`;
}

/*
 *********** BAUSHAUS ***********
 */
function generateBauhausData(name, colors, elements, size) {
	const numFromName = hashCode(name);
	const range = colors && colors.length;

	const elementsProperties = Array.from({ length: elements }, (_, i) => ({
		color: getRandomColor(numFromName + i, colors, range),
		translateX: getUnit(numFromName * (i + 1), size / 2 - (i + 17), 1),
		translateY: getUnit(numFromName * (i + 1), size / 2 - (i + 17), 2),
		rotate: getUnit(numFromName * (i + 1), 360),
		isSquare: getBoolean(numFromName, 2),
	}));

	return elementsProperties;
}

function generateBauhausSVG(name, colors, useTitle) {
	const size = 80;
	const data = generateBauhausData(name, colors, 4, size);
	return `<svg part="svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
		${useTitle ? `<title>${name}</title>` : ''}
		<rect width="${size}" height="${size}" fill="${data[0].color}" />
		<rect
			x="${(size - 60) / 2}"
			y="${(size - 20) / 2}"
			width="${size}"
			height="${data[1].isSquare ? size : size / 8}"
			fill="${data[1].color}"
			transform="translate(${data[1].translateX} ${data[1].translateY}) rotate(${data[1].rotate} ${size / 2} ${size / 2})"
		/>
		<circle
			cx="${size / 2}"
			cy="${size / 2}"
			fill="${data[2].color}"
			r="${size / 5}"
			transform="translate(${data[2].translateX} ${data[2].translateY})"
		/>
		<line
			x1="0"
			y1="${size / 2}"
			x2="${size}"
			y2="${size / 2}"
			stroke-width="2"
			stroke="${data[3].color}"
			transform="translate(${data[3].translateX} ${data[3].translateY}) rotate(${data[3].rotate} ${size / 2} ${size / 2})"
		/>
	</svg>`;
}

/*
 *********** RING ***********
 */
function generateRingData(name, colors, elements) {
	const numFromName = hashCode(name);
	const range = colors && colors.length;
	const colorsShuffle = Array.from({ length: elements }, (_, i) =>
		getRandomColor(numFromName + i, colors, range),
	);
	const colorsList = [];
	colorsList[0] = colorsShuffle[0];
	colorsList[1] = colorsShuffle[1];
	colorsList[2] = colorsShuffle[1];
	colorsList[3] = colorsShuffle[2];
	colorsList[4] = colorsShuffle[2];
	colorsList[5] = colorsShuffle[3];
	colorsList[6] = colorsShuffle[3];
	colorsList[7] = colorsShuffle[0];
	colorsList[8] = colorsShuffle[4];

	return colorsList;
}
function generateRingSVG(name, colors, useTitle) {
	const size = 90;
	const colorsList = generateRingData(name, colors, 8, size);
	return `<svg part="svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
		${useTitle ? `<title>${name}</title>` : ''}
		<g>
			<path d="M0 0h90v45H0z" fill="${colorsList[0]}" />
			<path d="M0 45h90v45H0z" fill="${colorsList[1]}" />
			<path d="M83 45a38 38 0 00-76 0h76z" fill="${colorsList[2]}" />
			<path d="M83 45a38 38 0 01-76 0h76z" fill="${colorsList[3]}" />
			<path d="M77 45a32 32 0 10-64 0h64z" fill="${colorsList[4]}" />
			<path d="M77 45a32 32 0 11-64 0h64z" fill="${colorsList[5]}" />
			<path d="M71 45a26 26 0 00-52 0h52z" fill="${colorsList[6]}" />
			<path d="M71 45a26 26 0 01-52 0h52z" fill="${colorsList[7]}" />
			<circle cx="45" cy="45" r="23" fill="${colorsList[8]}" />
		</g>
	</svg>`;
}

/*
 *********** CUSTOM ELEMENT ***********
 */
class PlayfulAvatar extends HTMLElement {

	static get observedAttributes() {
		return ['name', 'variant', 'title', 'colors'];
	}

	constructor() {
		super();
		this._isConnected = false;
		this.attachShadow({ mode: 'open' });
	}

	get name() { return this.getAttribute('name'); }
	set name(value) { value ? this.setAttribute('name', value) : this.removeAttribute('name'); }

	get variant() { return this.getAttribute('variant'); }
	set variant(value) { value ? this.setAttribute('variant', value) : this.removeAttribute('variant'); }

	get title() { return this.hasAttribute('title'); }
	set title(value) { value ? this.setAttribute('title', value) : this.removeAttribute('title'); }

	get colors() { return this.getAttribute('colors'); }
	set colors(value) { value ? this.setAttribute('colors', sanitizeColors(value).join(',')) : this.removeAttribute('colors'); }

	attributeChangedCallback(name, oldValue, newValue) {
		if (this._isConnected && newValue !== oldValue) {
			this.render();
		}
	}

	// see https://web.dev/articles/custom-elements-best-practices#make_properties_lazy
	_upgradeProperty(prop) {
		if (this.hasOwnProperty(prop)) {
			const value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}

	connectedCallback() {
		if (!this._isConnected) {
			this._isConnected = true;
			this._upgradeProperty('name');
			this._upgradeProperty('title');
			this._upgradeProperty('colors');
			this.render();
		}
	}

	render() {
		const name = this.getAttribute('name');
		const colors = this.hasAttribute('colors')
			? sanitizeColors(this.getAttribute('colors'))
			: ["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"];
		const variant = this.getAttribute('variant');
		const useTitle = this.hasAttribute('title');
		let svg;
		switch (variant) {
			case 'marble':
				svg = generateMarbleSVG(name, colors, useTitle);
				break;
			case 'pixel':
				svg = generatePixelSVG(name, colors, useTitle	);
				break;
			case 'sunset':
				svg = generateSunsetSVG(name, colors, useTitle);
				break;
			case 'bauhaus':
				svg = generateBauhausSVG(name, colors, useTitle);
				break;
			case 'ring':
				svg = generateRingSVG(name, colors, useTitle);
				break;
			default:
				svg = generateBeamSVG(name, colors, useTitle);
		}

		this.shadowRoot.innerHTML = `<style>
			:host { display: inline-block; line-height: 0;  }
			:host([hidden]) { display: none; }
			svg {
				width: inherit;
				height: inherit;
				border-radius: inherit;
				box-shadow: inherit;
			}
			</style>
			${svg}
		`;
	}
}

// define custom element only if it wasn't defined before
if (!customElements.get('playful-avatar')) {
	customElements.define('playful-avatar', PlayfulAvatar);
}
