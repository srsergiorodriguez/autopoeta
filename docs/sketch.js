//Words database
let data;

//Canvas size
let cnv;
const wi = 400;
const he = 520;

//Poem variables
const sintaxSize =  11;
let lines = 5;
let poemSintax = [];
let poem = [];
let poemText;
let poemDOM = [];

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
let gs = 0;

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

	for (let i=0;i<lines;i++) {
		poemDOM[i] = createP("");
		poemDOM[i].parent('poem_div');
		poemDOM[i].class('poem_p');
	}

	newPoemBtn = createButton('nuevo poema');
	newPoemBtn.parent('buttons_div');
	newPoemBtn.mouseClicked(newPoem);

	speakPoemBtn = createButton('exclamar poema');
	speakPoemBtn.parent('buttons_div');
	speakPoemBtn.mouseClicked(speakPoem);

	savePoemTxtBtn = createButton('guardar poema');
	savePoemTxtBtn.parent('buttons_div');
	savePoemTxtBtn.mouseClicked(savePoemTxt);

	savePoemImgBtn = createButton('guardar imagen & poema');
	savePoemImgBtn.parent('buttons_div');
	savePoemImgBtn.mouseClicked(savePoemImg);

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

function randomizeSintax() {
	for (let i=0;i<sintaxSize;i++) {
		poemSintax[i] = floor(random(2));
	}
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
		randomizeSintax();
		poem[i] = makeSentence();
		poem[i] = poem[i].join(" ");
		poemDOM[i].style('font-size', floor(random(10)+20)+'px');
		poemDOM[i].style('letter-spacing', floor(random(5)+2)+'px');
		poemDOM[i].style('transform', 'rotate('+floor(random(8)-4)+'deg)');
		poemDOM[i].html(poem[i]);
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

	if (w<wi) {
		w+=10;
	} else if (w>wi) {
		w-=10;
	}

	if (h<he) {
		h+=15;
	} else if (h>he) {
		h-=15;
	}

	if (mb<1000) {
		mb++;
		mh = abs(sin(0.1*mb)*30);
	}

	gs++;
	if (gs>100000) {
		gs=0;
	}

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

function randomProb(trsh_) {
	let rnd = random(1);
	if (rnd < trsh_) {
		return true;
	} else {
		return false;
	}
}

function headMov() {
	return (abs(sin(0.005*gs)*13));
}

function makeSentence() {

	// Sintaxis ------!!!
	//0 adverbio
	//1 sing-plur #1
	//2 m-f #1
	//9 cancela sujeto
	//3 pron-sust
	//4 adj
	//5 adv
	//6 prep
	//7 sing-plur #2
	//8 m-f #2
	//10 adj #2

	let sentence = [];

	if (poemSintax[0]==1 && randomProb(0.5)) {
	//Adverbio A
		sentence.push(data.adverbios_a[floor(random(data.adverbios_a.length))]);
		
	}

	//Sujeto #1 -----------------------------!!!!

	if (poemSintax[1]==1) { 
	//Singular
		if (poemSintax[2]==1) {
		//M
			if (poemSintax[9]==1 && randomProb(0.7)) {
			} else {
				//permite sujeto
				if (poemSintax[3]==1 && randomProb(0.6)) {
				//Pronombre
					sentence.push(data.pronombres_m_s[floor(random(data.pronombres_m_s.length))]);
				} else {
				//Sustantivo
					sentence.push(data.articulos_m_s[floor(random(data.articulos_m_s.length))]);
					sentence.push(data.sustantivos_m_s[floor(random(data.sustantivos_m_s.length))]);
				}
			}
			
			//Adjetivo #1
			if (poemSintax[4]==1) {
				sentence.push(data.adjetivos_m_s[floor(random(data.adjetivos_m_s.length))]);
			}

		} else {
		//F
			if (poemSintax[9]==1 && randomProb(0.2)) {
			} else {
				//permite sujeto
				if (poemSintax[3]==1 && randomProb(0.7)) {
				//Pronombre
					sentence.push(data.pronombres_f_s[floor(random(data.pronombres_f_s.length))]);
				} else {
				//Sustantivo
					sentence.push(data.articulos_f_s[floor(random(data.articulos_f_s.length))]);
					sentence.push(data.sustantivos_f_s[floor(random(data.sustantivos_f_s.length))]);
				}
			}

			//Adjetivo #1
			if (poemSintax[4]==1) {
				sentence.push(data.adjetivos_f_s[floor(random(data.adjetivos_f_s.length))]);
			}
		}
		//VERBO!!!
		sentence.push(data.verbos_pres_s[floor(random(data.verbos_pres_s.length))]);
	} else {
	//Plural
		if (poemSintax[2]==1) {
		//M
			if (poemSintax[9]==1 && randomProb(0.7)) {
			} else {
				//permite sujeto
				if (poemSintax[3]==1 && randomProb(0.7)) {
					sentence.push(data.pronombres_m_p[floor(random(data.pronombres_m_p.length))]);
				} else {
					sentence.push(data.articulos_m_p[floor(random(data.articulos_m_p.length))]);
					sentence.push(data.sustantivos_m_p[floor(random(data.sustantivos_m_p.length))]);
				}
			}

			//Adjetivo #1
			if (poemSintax[4]==1) {
				sentence.push(data.adjetivos_m_p[floor(random(data.adjetivos_m_p.length))]);
			}
		} else {
		//F
			if (poemSintax[9]==1 && randomProb(0.2)) {
			} else {
				//permite sujeto
				if (poemSintax[3]==1 && randomProb(0.7)) {
					sentence.push(data.pronombres_f_p[floor(random(data.pronombres_f_p.length))]);
				} else {
					sentence.push(data.articulos_f_p[floor(random(data.articulos_f_p.length))]);
					sentence.push(data.sustantivos_f_p[floor(random(data.sustantivos_f_p.length))]);
				}
			}
			
			//Adjetivo #1
			if (poemSintax[4]==1) {
				sentence.push(data.adjetivos_f_p[floor(random(data.adjetivos_f_p.length))]);
			}
		}
		//VERBO!!!
		sentence.push(data.verbos_pres_p[floor(random(data.verbos_pres_p.length))]);
	}

	if (poemSintax[5]==1 && randomProb(0.5)) {
	//Adverbio B
		sentence.push(data.adverbios_b[floor(random(data.adverbios_b.length))]);
		if (poemSintax[1]==1) {
			//S
			if (poemSintax[2]==1) {
				//M
				sentence.push(data.adjetivos_m_s[floor(random(data.adjetivos_m_s.length))]);
			} else {
				//F
				sentence.push(data.adjetivos_f_s[floor(random(data.adjetivos_f_s.length))]);
			}
		} else {
			//P
			if (poemSintax[2]==1) {
				//M
				sentence.push(data.adjetivos_m_p[floor(random(data.adjetivos_m_p.length))]);
			} else {
				//F
				sentence.push(data.adjetivos_f_p[floor(random(data.adjetivos_f_p.length))]);
			}
		}
	} else {
		if (poemSintax[6]==1) {
		//Conjunción
			sentence.push(data.preposiciones[floor(random(data.preposiciones.length))]);
		}

		//Sujeto #2 -----------------------------!!!!

		if (poemSintax[7]==1) { 
		//Singular
			if (poemSintax[8]==1) {
				//M
				sentence.push(data.articulos_m_s[floor(random(data.articulos_m_s.length))]);
				sentence.push(data.sustantivos_m_s[floor(random(data.sustantivos_m_s.length))]);

				//Adjetivo #2
				if (poemSintax[10]==1) {
					sentence.push(data.adjetivos_m_s[floor(random(data.adjetivos_m_s.length))]);
				}

			} else {
				//F
				sentence.push(data.articulos_f_s[floor(random(data.articulos_f_s.length))]);
				sentence.push(data.sustantivos_f_s[floor(random(data.sustantivos_f_s.length))]);

				//Adjetivo #2
				if (poemSintax[10]==1) {
					sentence.push(data.adjetivos_f_s[floor(random(data.adjetivos_f_s.length))]);
				}
			}
		} else {
		//Plural
			if (poemSintax[8]==1) {
				//M
				sentence.push(data.articulos_m_p[floor(random(data.articulos_m_p.length))]);
				sentence.push(data.sustantivos_m_p[floor(random(data.sustantivos_m_p.length))]);

				//Adjetivo #2
				if (poemSintax[10]==1) {
					sentence.push(data.adjetivos_m_p[floor(random(data.adjetivos_m_p.length))]);
				}
			} else {
				//F
				sentence.push(data.articulos_f_p[floor(random(data.articulos_f_p.length))]);
				sentence.push(data.sustantivos_f_p[floor(random(data.sustantivos_f_p.length))]);

				//Adjetivo #2
				if (poemSintax[10]==1) {
					sentence.push(data.adjetivos_f_p[floor(random(data.adjetivos_f_p.length))]);
				}
			}
		}
	}

	return sentence;
}