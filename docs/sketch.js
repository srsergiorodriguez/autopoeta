//Words database
let data;

//Canvas size
let cnv;
const wi = 400;
const he = 520;

//Poem variables
const aventura = new Aventura('es'); // Initialize the text generator;
let grammar; // The grammar structure
let lines = 5;
let poem = []; // Each sentence of the actual poem
let poemText; // The whole poem in a string
let poemDOM = []; // Each dom element that will display the lines of the poem

// DOM Buttons
let newPoemBtn;
let speakPoemBtn;
let savePoemImgBtn;
let savePoemTxtBtn

//Poet proportions
let posw = wi;
let posh = he;

let w = 0;
let h = 1000;
let gs = 0; // Time counter for animation

let mw = 300;
let mh = 10;
let mb = 10000;

let lb = 20;
let rb = 0;

//Speech synthesis
const poetSpeech = window.speechSynthesis;
let poetUtterance;
let voice;
let speaking;

//Visual variables
const mainColor = '#edeeef';

function preload() {
	data = loadJSON('assets/autopoetadb.json');
}

function setup() {
	poetUtterance = new SpeechSynthesisUtterance();
	poetUtterance.lang = 'es-419';
  	poetVolume = poetUtterance.volume;

	voicesPromise = new Promise((resolve, reject) => {
		let v = poetSpeech.getVoices()[16];
		if (v) {
			resolve(v);
		} else {
			reject("No se pudo cargar la voz");
		}
	});

	voicesPromise.then((voice) => {
		poetUtterance.voice = voice;
	}).catch((emsg) => {
		console.log(emsg);
	});

	cnv = createCanvas(wi,he);
	cnv.parent('poet_div');
	background(mainColor);

	// Create poem lines paragraphs;
	for (let i=0;i<lines;i++) {
		poemDOM[i] = createP("").parent('poem_div').class('poem_p');
	}

	newPoemBtn = createButton('nuevo poema').parent('buttons_div').mouseClicked(newPoem);
	speakPoemBtn = createButton('recitar poema').parent('buttons_div').mouseClicked(speakPoem);
	savePoemTxtBtn = createButton('guardar poema').parent('buttons_div').mouseClicked(savePoemTxt);
	savePoemImgBtn = createButton('guardar imagen & poema').parent('buttons_div').mouseClicked(savePoemImg);

	grammar = data;
	aventura.setGrammar(grammar);
	newPoem();
}

function draw() {
	makePoet();
}

function gotData() {
	console.log("got it");
}

function speakPoem() {
	mb=0;
	poetUtterance.text = poemText;
	poetSpeech.speak(poetUtterance);
}

function savePoemImg() {
	html2canvas(document.querySelector("#container")).then(poemCanvas => {
    	saveCanvas(poemCanvas, 'autopoema', 'jpg');
	});
}

function savePoemTxt() {
	save(poem, 'autopoema.txt');
}

function randomNumArray() {
	let nasize = floor(random(10)+15);
	let numarr = [];
	for (let i=0;i<nasize;i++) {
		numarr[i] = floor(random(2));
	}
	return numarr;
}

function newPoem() {
	w = 0;
	h = 1000;

	for (let i=0;i<lines;i++) {
		poem[i] = aventura.developGrammar('base');
		poemDOM[i].style('font-size',floor(random(10)+20)+'px')
							.style('letter-spacing',floor(random(5)+2)+'px')
							.style('transform','rotate('+floor(random(8)-4)+'deg)')
							.html(poem[i]);
	}
	poemText = poem.join(",\n");
}

function makePoet() {
	background(mainColor);

	let poetFill = '#ffffff';
	let poetStroke = 0;
	fill(poetFill);
	stroke(poetStroke);
	let hm = headMov();

	w = w<wi ? w+10 : w>wi ? w-10 : w;
	h = h<he ? h+15 : h>he ? h-15 : h;
	
	if (mb<1000) {mb++;mh = abs(sin(0.1*mb)*30)}

	gs = gs<100000 ? gs+1 : 0;

	//left ear
	fill(poetFill);
	strokeWeight(10);
	ellipse(posw*0.2+hm,posh*0.6,w*0.2,h*0.2);
	strokeWeight(6);
	ellipse(posw*0.2+hm,posh*0.6,w*0.15,h*0.15);
	//right ear
	strokeWeight(10);
	ellipse(posw*0.85+hm,posh*0.5,w*0.2,h*0.2);
	strokeWeight(6);
	ellipse(posw*0.85+hm,posh*0.53,w*0.1,h*0.1);
	//head
	strokeWeight(14);
	ellipse(posw*0.5+hm,posh*0.5,w*0.6,h*0.6);
	//left eye
	strokeWeight(7);
	line(posw*0.3+hm,posh*0.4+(abs(5*sin(0.005*gs-20))),w*0.5+hm,h*0.4+(abs(cos(0.005*gs)*5)));
	strokeWeight(8);
	lb++;
	if (lb > 400) {
		ellipse(posw*0.4+hm,posh*0.45,w*0.15,(h*0.08)*(lb/2500));
		fill(poetStroke);
		ellipse(posw*0.4+hm,posh*0.45,w*0.05,(h*0.02)*(lb/2500));
		if (lb > 480) {
			lb = 0;
		}
	} else {
		ellipse(posw*0.4+hm,posh*0.45,w*0.15,h*0.08);
		fill(poetStroke);
		ellipse(posw*0.4+hm,posh*0.45,w*0.05,h*0.02);
	}
	//right eye
	strokeWeight(9);
	line(posw*0.55+hm,posh*0.4,w*0.7+hm,h*0.43+(abs(cos(0.005*gs)*10)));
	strokeWeight(1);
	rectMode(CENTER);
	rb++;
	if (rb > 400) {
		rect(posw*0.62+hm,posh*0.5,w*0.12*(rb/2500),h*0.12,10,10);
		fill(poetFill);
		ellipse(posw*0.62+hm,posh*0.5,w*0.04*(rb/2500),h*0.06);
		if (rb > 480) {
			rb = 0;
		}
	} else {
		rect(posw*0.62+hm,posh*0.5,w*0.12,h*0.12,10,10);
		fill(poetFill);
		ellipse(posw*0.62+hm,posh*0.5,w*0.04,h*0.06);
	}
	//cheeks
	strokeWeight(4);
	ellipse(posw*0.3+hm,posh*0.55,w*0.12,h*0.07);
	ellipse(posw*0.66+hm,posh*0.61,w*0.12,h*0.07);
	//nose
	strokeWeight(7);
	line(posw*0.45+hm,posh*0.5,w*0.4+hm,h*0.6);
	line(posw*0.52+hm,posh*0.6,w*0.4+hm,h*0.6);
	//mouth
	ellipse(posw*0.5+hm,posh*0.7,mw*0.2,mh);
	//hat
	fill(poetStroke);
	rect(posw*0.5+hm,posh*0.3,w*0.8,h*0.1,10,10);
	rect(posw*0.5+hm,posh*0.2,w*0.5,h*0.13,10,10);
	rect(posw*0.5+hm,posh*0.1,w*0.3,h*0.1,10,10);
	fill(poetFill);
	rect(posw*0.5+hm,posh*0.25,w*0.46,h*0.05,10,10);
	rect(posw*0.5+hm,posh*0.15,w*0.27,h*0.05,10,10);
	//body
	fill(poetStroke);
	rect(posw*0.5,posh*1.1,w*0.7+(abs(sin(0.01*gs)*10)),h*0.5,10,10);
	fill(poetFill);
	rect(posw*0.5,posh*1.1,w*0.1+(abs(sin(0.01*gs)*10)),h*0.5,10,10);

	if (w!=wi) {
		for (let i=0;i<lines;i++) {
			poemDOM[i].html(randomNumArray().join(""));
		}
	} else {
		for (let i=0;i<lines;i++) {
			poemDOM[i].html(poem[i]);
		}
	}
}

function headMov() {
	return (abs(sin(0.005*gs)*13));
}
