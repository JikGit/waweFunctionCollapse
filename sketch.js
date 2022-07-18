const WIN_WIDTH = window.innerWidth;
const WIN_HEIGHT = window.innerHeight;

const tileImages = [];
let grid = [];

const DIM = 50;
const N_TILES = 5;

const RULES = [
	//up, right, bottom, left
	[0,0,0,0],
	[0,1,2,1],
	[2,0,2,1],
	[2,1,2,0],
	[2,1,0,1],
]

let nCollapsed = 0;

function preload() {
	const path = './tiles/demo';
	const ext = '.png';
	tileImages[0] = loadImage(`${path}/blank${ext}`);
	tileImages[1] = loadImage(`${path}/down${ext}`);
	tileImages[2] = loadImage(`${path}/left${ext}`);
	tileImages[3] = loadImage(`${path}/right${ext}`);
	tileImages[4] = loadImage(`${path}/up${ext}`);

	// const path = './tiles/circuit-coding-train';
	// for (let i = 0; i < 13; i++) {
	//   tileImages[i] = loadImage(`${path}/${i}.png`);
	// }

}

function setup() {
	frameRate(100)
	createCanvas(WIN_WIDTH, WIN_HEIGHT);
	for (let y = 0; y < DIM; y++) {
		for (let x = 0; x < DIM; x++) {
			grid[y * DIM + x] = {
				x: x,
				y: y,
				collapsed: false,
				options: [...Array(N_TILES).keys()],
			}
		}
	}
}

function draw(){
	// background(0);

	const lessEntropyElm = getLessEntropyElm(grid);
	lessEntropyElm.options = [lessEntropyElm.options[int(Math.random() * lessEntropyElm.options.length)]];
	lessEntropyElm.collapsed = true;
	nCollapsed++;
	if (nCollapsed == DIM*DIM) noLoop(0);


	//cambio l'entropy
	changeEntropy(grid, lessEntropyElm);

	//se c'e' un tiles collapsed lo fa vedere
	checkForCollapsed(grid);
}

function checkForCollapsed(grid){
	const tilesWidth = width/DIM;
	const tilesHeight = height/DIM;	

	const collapsedElms = grid.filter(elm => elm.collapsed);
	//per ogni collapsed lo disegno sullo schermo
	collapsedElms.forEach(cell => image(tileImages[cell.options[0]], cell.x * tilesWidth, cell.y * tilesHeight, tilesWidth, tilesHeight));

	// for (let y = 0; y < DIM; y++) {
	// 	for (let x = 0; x < DIM; x++) {
	// 		let cell = grid[y * DIM + x];
	// 		//se non c'e' solo una opzione (collapsed)
	// 		if (cell.collapsed) {
	// 			image(tileImages[cell.options[0]], x * tilesWidth, y * tilesHeight, tilesWidth, tilesHeight);
	// 		} else {
	// 			fill(0);
	// 			rect(x * tilesWidth, y * tilesHeight, tilesWidth, tilesHeight);
	// 		}
	// 	}
	// }
}

function getLessEntropyElm(grid){
	//ordino questo array avente all'inizio gli elementi con minore entropy
	let gridCopy = grid.slice();
	gridCopy.sort((elm1, elm2) => {
		return elm1.options.length - elm2.options.length;
	});

	gridCopy = gridCopy.filter(elm => elm.collapsed == false);
	//trovo lo/gli elementi con lo stesso entropy
	const lowerEntropy = gridCopy[0].options.length;
	gridCopy = gridCopy.filter(elm => elm.options.length === lowerEntropy);
	//scelgo un elemento e prendo un entropy a caso tra le opzioni
	const lessEntropyElm = gridCopy[int(Math.random() * gridCopy.length)];

	return lessEntropyElm;
}


function changeEntropy(grid, lessEntropyElm){
	let x = lessEntropyElm.x;
	let y = lessEntropyElm.y;

	//guardo sopra
	if (y != 0){
		let cell = grid[(y-1)*DIM + x];
		if (!cell.collapsed){
			let entropy = cell.options;
			let newEntropy = [];
			for (let possibleEntropy of entropy){
				// se i tiles corrispondono aggiungo quella entropy
				if (RULES[possibleEntropy][2] == RULES[lessEntropyElm.options[0]][0]) newEntropy.push(possibleEntropy);
			}
			cell.options = newEntropy;
		}
	}

	//guardo sotto 
	if (y != DIM-1){
		let cell = grid[(y+1)*DIM + x];
		if (!cell.collapsed){
			let entropy = cell.options;
			let newEntropy = [];
			for (let possibleEntropy of entropy){
				// se i tiles corrispondono aggiungo quella entropy
				if (RULES[possibleEntropy][0] == RULES[lessEntropyElm.options[0]][2]) newEntropy.push(possibleEntropy);
			}
			cell.options = newEntropy;
		}
	}

	//guardo destra 
	if (x != DIM-1){
		let cell = grid[y*DIM + x+1];
		if (!cell.collapsed){
			let entropy = cell.options;
			let newEntropy = [];
			for (let possibleEntropy of entropy){
				// se i tiles corrispondono aggiungo quella entropy
				if (RULES[possibleEntropy][3] == RULES[lessEntropyElm.options[0]][1]) newEntropy.push(possibleEntropy);
			}
			cell.options = newEntropy;
		}
	}

	//guardo sinistra 
	if (x != 0){
		let cell = grid[y*DIM + x-1];
		if (!cell.collapsed){
			let entropy = cell.options;
			let newEntropy = [];
			for (let possibleEntropy of entropy){
				// se i tiles corrispondono aggiungo quella entropy
				if (RULES[possibleEntropy][1] == RULES[lessEntropyElm.options[0]][3]) newEntropy.push(possibleEntropy);
			}
			cell.options = newEntropy;
		}
	}
} 
