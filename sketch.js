let particles = [];
let input, speakButton;
let isSpeaking = false; // Variable pour savoir si le personnage est en train de parler
let mouthState = 0;
let chatContainer;
let currentColor;
// Variables pour suivre la position des pupilles
let leftPupilX, leftPupilY, rightPupilX, rightPupilY;

// Variable pour l'état de gêne
let isBlushing = false;
let blushAlpha = 0;
let blushTimer = 0;
let lastInteractionTime;
let isSleeping = false;
// Couleurs pour l'interpolation
let normalColor, blushColor;

const keywords = {
    "triste": ["triste", "tristesse", "déprimé", "morose", "chagriné", "malheureux"],
    "anxieux": ["anxieux", "inquiétude", "inquiet", "angoissé", "nervous", "stressé", "anxiété"],
    "déprimé": ["déprimé", "dépression", "abattu", "démoralisé", "désespéré"],
    "conseil": ["conseil", "conseiller", "astuce", "recommander", "suggestion", "suggérer"],
    "seul": ["seul", "solitude", "isolé", "solitaire", "abandonné"],
    "dormir": ["dormir", "sommeil", "endormi", "fatigue", "fatigué", "repos", "se reposer"],
    "santé mentale": ["santé mentale", "bien-être", "psychologie", "équilibre", "mental"],
    "merci": ["merci", "remerciement", "gratitude", "rembourser"],
    "bonjour": ["bonjour", "salut", "coucou", "hello", "hi"],
    "fatigue": ["fatigue", "épuisé", "lassé", "crevé", "fatigué"],
    "stress": ["stress", "stressant", "tension", "angoisse", "pression", "stressé"],
    "motivation": ["motivation", "motivé", "énergie", "dynamisme", "enthousiasme"],
    "relation": ["relation", "rapport", "liaison", "interaction", "connecter", "relations"],
    "peur": ["peur", "effrayer", "effroi", "crainte", "terreur", "craindre"],
    "colère": ["colère", "en colère", "rage", "irrité", "irritation", "mécontentement"],
    "concentration": ["concentration", "concentrer", "focus", "attention", "application"],
    "hobby": ["hobby", "loisir", "passion", "activité"],
    "activité physique": ["activité physique", "exercice", "sport", "entraînement"],
    "nourriture": ["nourriture", "alimentation", "repas", "diète", "manger", "aliments"],
    "loisirs": ["loisirs", "divertissement", "récréation", "passe-temps", "amuser"],
    "échec": ["échec", "échouer", "raté", "défaite", "insuccès", "rater"],
    "projets": ["projets", "planifier", "plans", "objectifs", "ambitions", "projet"],
    "famille": ["famille", "parents", "proches", "membre de la famille"],
    "amis": ["amis", "copains", "collègues", "compagnons", "amitié", "ami"],
    "je me sens perdu": ["je me sens perdu", "perdu", "désorienté", "confus", "déconcerté"],
    "comment rester positif": ["comment rester positif", "positif", "optimiste", "garder espoir", "espoir"],
    "j'ai besoin d'aide": ["j'ai besoin d'aide", "aide", "secours", "assistance", "aider"],
    "je suis content": ["je suis content", "heureux", "content", "joyeux", "satisfait", "comblé"],
    "suicide" : ["suicide"]
};

const responses = {
    "suicide" : "Je suis désolé, mais le suicide ne vous rapportera rien. Si vous avez des pensées suicidaires, il est important de parler à un professionnel de la santé mentale. Voici un numéro que je vous recommande d'appeler : 01 45 39 40 00, ou allez sur suicide-ecoute.fr",
    "ça va" : "Parfait ! ",
    "Qui es-tu ?": "Bonjour, je suis Elpa et je suis là pour vous écoutez ! Que puis-je faire pour vous aujourd'hui ?",
    "Que fais-tu ?" : "Je suis là pour t'aider avec ce que tu veux !",
    "Comment ça va ?":"Je vais bien, merci de demander. Et toi ?",
    "réveillé" : "Je te remercie de m'avoir réveillé !",
    "triste": "Je suis désolé de savoir que vous vous sentez triste. Parlez-moi de ce qui vous préoccupe.",
    "anxieux": "L'anxiété peut être très difficile à gérer. Avez-vous essayé des techniques de relaxation comme la respiration profonde ?",
    "déprimé": "Il est important de parler à quelqu'un de vos sentiments. Avez-vous un ami ou un membre de votre famille à qui vous pouvez parler ?",
    "conseil": "Un conseil général pour se sentir mieux est de rester actif et de maintenir une routine. L'exercice peut vraiment aider à améliorer votre humeur.",
    "seul": "La solitude peut être difficile. Essayez de vous connecter avec des amis ou de rejoindre un groupe ou une activité qui vous intéresse.",
    "dormir": "Un bon sommeil est crucial pour votre bien-être mental. Essayez de maintenir une routine de sommeil régulière et d'éviter les écrans avant de dormir.",
    "santé mentale": "Prendre soin de votre santé mentale est essentiel. Si vous vous sentez souvent déprimé ou anxieux, il peut être utile de parler à un professionnel.",
    "merci": "De rien ! Je suis toujours là pour vous aider. Y a-t-il autre chose dont vous aimeriez parler ?",
    "bonjour": "Bonjour, je suis Elpa et je suis là pour vous écoutez ! Que puis-je faire pour vous aujourd'hui ?",
    "fatigué": "La fatigue peut être due à plusieurs raisons. Assurez-vous de bien dormir et de maintenir une alimentation équilibrée.",
    "stress": "Le stress peut être très pesant. Avez-vous essayé des techniques de relaxation comme le yoga ou la méditation ?",
    "motivation": "Il est parfois difficile de rester motivé. Fixez-vous de petits objectifs réalisables pour vous aider à avancer.",
    "relation": "Les relations peuvent être compliquées. Parler de vos sentiments avec la personne concernée peut souvent aider à résoudre les conflits.",
    "peur": "La peur est une émotion naturelle. Parler de vos peurs peut souvent aider à les surmonter.",
    "colère": "Il est important de gérer sa colère de manière saine. Essayez des techniques de relaxation ou parlez-en à un ami de confiance.",
    "concentrer": "Si vous avez du mal à vous concentrer, essayez de faire des pauses régulières et de créer un environnement de travail calme.",
    "hobby": "Avoir un hobby peut être une excellente manière de se détendre. Quels sont vos intérêts ?",
    "activité physique": "L'activité physique est très bénéfique pour la santé mentale. Essayez de faire de l'exercice régulièrement.",
    "manger": "Une alimentation équilibrée peut avoir un impact positif sur votre humeur. Assurez-vous de manger des repas sains et équilibrés.",
    "divertir": "Les loisirs sont importants pour se détendre et se divertir. Que faites-vous pour vous amuser ?",
    "échec": "L'échec fait partie de la vie. Ce qui compte, c'est ce que vous en apprenez et comment vous rebondissez.",
    "projets": "Avoir des projets peut être motivant. Quels sont vos objectifs à court et à long terme ?",
    "familiales": "La famille peut être une source de soutien. Parlez-vous souvent à vos proches ?",
    "amis": "Les amis sont importants pour le soutien émotionnel. Avez-vous des amis proches avec qui parler ?",
    "je me sens perdu": "Il est normal de se sentir perdu parfois. Essayez de parler à quelqu'un en qui vous avez confiance.",
    "comment rester positif": "Pratiquez la gratitude en notant chaque jour trois choses pour lesquelles vous êtes reconnaissant.",
    "j'ai besoin d'aide": "Je suis là pour vous. Que puis-je faire pour vous aider ?",
    "je me sens seul": "Essayez de contacter un ami ou de rejoindre un groupe avec des intérêts communs.",
    "je suis content": "Je suis heureux de l'entendre ! Continuez à faire ce qui vous rend heureux."

};

function setup() {
    let canvas = createCanvas(400, 600);
    canvas.parent('faceContainer'); // Placer le canvas dans faceContainer
    colorMode(HSL, 360, 100, 100, 100);

    // Initialiser les couleurs
    normalColor = color(180, 100, 50, 100);
    blushColor = color(0, 100, 50, 100);

    // Initialiser les positions des pupilles au centre des yeux
    leftPupilX = width / 2 - 50;
    leftPupilY = height / 2 - 20;
    rightPupilX = width / 2 + 50;
    rightPupilY = height / 2 - 20;

    // Sélectionner les éléments HTML et configurer les événements
    input = select('#textInput');
    speakButton = select('#speakButton');
    speakButton.mousePressed(handleUserInput);  // Ajouter un écouteur de clic au bouton

    // Sélectionner les boutons de phrases prédéfinies et ajouter des événements
    let presetButtons = selectAll('.presetButton');
    for (let i = 0; i < presetButtons.length; i++) {
        presetButtons[i].mousePressed(() => {
            let phrase = presetButtons[i].elt.getAttribute('data-phrase');
            handlePresetInput(phrase, presetButtons[i].html());
        });
    }

    chatContainer = select('#chatContainer'); // Conteneur de discussion
    addMessage("elpa", "Bonjour, je suis Elpa et je suis là pour vous écoutez !");
    lastInteractionTime = millis();
    document.addEventListener('mousemove', resetInteractionTimer);
    document.addEventListener('keydown', resetInteractionTimer);
}

function resetInteractionTimer() {
    lastInteractionTime = millis();
    if (isSleeping) {
        isSleeping = false;
        responsiveVoice.speak("Je te remercie de m'avoir réveillé !", "French Female", {
            pitch: 1.4,
            rate: 1.2,
            onstart: startSpeaking,
            onend: endSpeaking
        });

    }
}

function draw() {
    background("#E1BEE7");
    let timeSinceLastInteraction = millis() - lastInteractionTime;
    if (timeSinceLastInteraction > 15000 && !isSleeping) {
        isSleeping = true;
    }
    let avatarPos = createVector(width / 2, height / 2);

    if (isSleeping) {
        drawSleepingMessage(avatarPos.x, avatarPos.y);
        drawAvatar(avatarPos.x, avatarPos.y);
    } else {
        checkIfBlushing(avatarPos.x, avatarPos.y);
        drawAvatar(avatarPos.x, avatarPos.y);
        updateParticles(avatarPos);
    }
}

function drawSleepingMessage(x, y) {
    textSize(22);

    textAlign(TOP);
    fill(255);
    text("Elpa s'est endormie...", x, y - 175);
    text("Bouge ta souris ", x, y - 150);
    text(" pour le réveiller.", x, y - 125);

}

function checkIfBlushing(x, y) {
    let d = dist(mouseX, mouseY, x, y);
    if (d < 120) { // Si la souris est sur le personnage
        blushTimer += deltaTime / 1000; // Incrementer le timer
        if (blushTimer >= 2) {
            isBlushing = true;
        }
    } else {
        blushTimer = 0; // Réinitialiser le timer
        isBlushing = false;
    }
}

function drawAvatar(x, y) {
    let blendFactor = constrain(blushTimer / 2, 0, 1); // Facteur de mélange basé sur le timer
    currentColor = lerpColor(normalColor, blushColor, blendFactor);

    // Mouvement mou du corps
    x += sin(frameCount * 0.02) * 15; // Mouvement horizontal doux

    // Dessiner ombre
    fill(0, 0, 0, 50);
    ellipse(x, y + 180, 200, 80);

    // Corps plus fluide et rond avec interaction de la souris
    fill(currentColor);
    noStroke();
    beginShape();
    for (let i = 0; i < TWO_PI; i += 0.05) {
        let offset = map(noise(i, frameCount * 0.01), 0, 1, -20, 20);
        let r = 120 + offset; // Rayon plus grand pour un corps plus rond
        let angle = i;
        let nx = r * cos(angle) + x;
        let ny = r * sin(angle) + y;

        // Interaction souris
        let d = dist(mouseX, mouseY, nx, ny);
        if (d < 50 && !isSpeaking) { // Rayon d'effet
            let pull = map(d, 0, 50, 15, 0); // Inverser l'effet
            nx += pull * cos(angle);
            ny += pull * sin(angle);
        }

        vertex(nx, ny);
    }
    endShape(CLOSE);

    // Yeux et bouche
    drawFace(x, y);
}

function drawFace(x, y) {
    // Yeux plus ronds et doux
    if(isSleeping)
    {
        fill(color(180, 100, 30, 100));
        ellipse(x-50, y -20, 50, 60);
        ellipse(x+50, y -20, 50, 60);

    }
    else {
        fill(255);
        ellipse(x - 50, y - 20, 50, 60); // Oeil gauche
        ellipse(x + 50, y - 20, 50, 60); // Oeil droit


        // Dessiner les joues rouges si gêné
        blushAlpha = lerp(blushAlpha, isBlushing ? 50 : 0, 0.1); // Interpolation de l'alpha
        if (blushAlpha > 0) {
            fill(0, 100, 100, blushAlpha); // Rouge HSL avec transparence
            ellipse(x - 50, y + 20, 50, 30); // Joue gauche
            ellipse(x + 50, y + 20, 50, 30); // Joue droite
            drawingContext.shadowOffsetX = 0;
            drawingContext.shadowOffsetY = 0;
            drawingContext.shadowBlur = 50;
            drawingContext.shadowColor = 'pink';
        }

        // Calculer la direction et la distance pour les pupilles
        let eyeDirection = isSpeaking ? 0 : atan2(mouseY - y, mouseX - x);
        let distMouse = isSpeaking ? 0 : min(dist(mouseX, mouseY, x, y), 80);
        let pupilDistance = map(distMouse, 0, 150, 0, 25);

        // Positions cibles des pupilles
        let targetLeftPupilX = x - 50 + pupilDistance * cos(eyeDirection);
        let targetLeftPupilY = y - 20 + pupilDistance * sin(eyeDirection);
        let targetRightPupilX = x + 50 + pupilDistance * cos(eyeDirection);
        let targetRightPupilY = y - 20 + pupilDistance * sin(eyeDirection);

        // Interpolation linéaire pour un mouvement fluide des pupilles
        if (isSpeaking) {
            leftPupilX = lerp(leftPupilX, x - 50, 0.1);
            leftPupilY = lerp(leftPupilY, y - 20, 0.1);
            rightPupilX = lerp(rightPupilX, x + 50, 0.1);
            rightPupilY = lerp(rightPupilY, y - 20, 0.1);
        } else {
            leftPupilX = lerp(leftPupilX, targetLeftPupilX, 0.1);
            leftPupilY = lerp(leftPupilY, targetLeftPupilY, 0.1);
            rightPupilX = lerp(rightPupilX, targetRightPupilX, 0.1);
            rightPupilY = lerp(rightPupilY, targetRightPupilY, 0.1);
        }

        // Dessiner les pupilles
        let pupillesize = 25;
        fill(0);
        ellipse(leftPupilX, leftPupilY, pupillesize, pupillesize + 10);
        ellipse(rightPupilX, rightPupilY, pupillesize, pupillesize + 10);

        fill(255);
        ellipse(leftPupilX - 5, leftPupilY + 12, pupillesize - 20, pupillesize - 15);
        ellipse(rightPupilX + 5, rightPupilY + 12, pupillesize - 20, pupillesize - 15);
        ellipse(leftPupilX - 5, leftPupilY - 13, pupillesize - 20, pupillesize - 15);
        ellipse(rightPupilX + 5, rightPupilY - 13, pupillesize - 20, pupillesize - 15);

        // Bouche animée
    }


    drawMouth(x, y);
}

function drawMouth(x, y) {
    stroke(0); // Contour noir
    strokeWeight(2);

    if (isSpeaking) {
        fill(0, 100, 50); // Rouge HSL pour la bouche
        switch (mouthState) {
            case 0:
                arc(x, y + 40, 40, 20, 0, PI); // Bouche fermée
                break;
            case 1:
                beginShape();
                vertex(x - 20, y + 40);
                fill(0, 100, 29);
                bezierVertex(x - 10, y + 60, x + 10, y + 60, x + 20, y + 40);
                bezierVertex(x + 10, y + 60, x - 10, y + 60, x - 20, y + 40);
                endShape(CLOSE); // Bouche ouverte avec langue
                break;
            case 2:
                arc(x, y + 40, 40, 25, 0, PI); // Bouche plus ouverte
                break;
            case 3:
                arc(x, y + 45, 50, 20, 0, PI); // Bouche très ouverte
                break;
        }
    } else {
        fill(color(180, 100, 50, 0));
        arc(x, y + 40, 40, 20, 0, PI); // Bouche fermée
    }
}

function updateParticles(avatarPos) {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].isFinished()) {
            particles.splice(i, 1);
        } else {
            particles[i].show();
        }
    }
    if (frameCount % 20 === 0 && isBlushing) {
        let angle = random(TWO_PI);
        let r = 140; // Un peu plus grand que le rayon du corps pour démarrer à l'extérieur
        let px = avatarPos.x + r * cos(angle);
        let py = avatarPos.y + r * sin(angle);
        particles.push(new Particle(px, py, color(255, 0, 0), true)); // Particules rouges en forme de coeur
    } else if (frameCount % 20 === 0) {
        let angle = random(TWO_PI);
        let r = 140;
        let px = avatarPos.x ;
        let py = avatarPos.y - 100;
        particles.push(new Particle(Math.random() * ((px+80) - (px-80)) + (px-50), py, currentColor));

    }
}

class Particle {
    constructor(x, y, color, isBlushing = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = random(40, 60);
        this.lifespan = 255;
        this.vx = random(-1, 1);
        this.vy = -random(1, 3);
        this.shrink = 0.98;
        this.isBlushing = isBlushing;
        this.content = (color === 'Z') ? 'Z' : '';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size *= this.shrink;
        this.lifespan -= 2;
    }

    show() {
        noStroke();
        fill(this.color);
        if (isSleeping) {
            fill(color(200, 100, 50, 100));
            textSize(this.size);
            text("Z", this.x, this.y);
        } else if (this.isBlushing) {
            push();
            translate(this.x, this.y);
            beginShape();
            fill(0, 100, 50);
            stroke(0);
            strokeWeight(4);
            vertex(0, 0);
            bezierVertex(-this.size / 2, -this.size / 4,
                -this.size / 2, this.size / 4,
                0, this.size);
            bezierVertex(this.size / 2, this.size / 4,
                this.size / 2, -this.size / 4,
                0, 0);
            endShape(CLOSE);
            pop();
        } else {
            ellipse(this.x, this.y, this.size);
        }
    }

    isFinished() {
        return this.lifespan < 0 || this.size < 1;
    }
}

function handleUserInput() {
    let msg = input.value();
    if (msg.length > 0) {
        addMessage('user', msg);
        respondToUser(msg);
    }
}

function handlePresetInput(phrase, buttonText) {
    addMessage('user', buttonText);
    respondToUser(phrase);
}

function respondToUser(msg) {
    isSpeaking = true;
    let response = getResponse(msg);
    responsiveVoice.speak(response, "French Female", {
        pitch: 1.4,
        rate: 1.2,
        onstart: startSpeaking,
        onend: endSpeaking
    });
    addMessage('elpa', response);
}

function getResponse(msg) {
    msg = msg.toLowerCase();
    console.log("message " + msg)
    if (msg==="je suis elpa, votre ami virtuel, j'espère qu'on va pouvoir s'amuser !") {
        return "Bonjour, je suis Elpa et je suis là pour vous écoutez ! Que puis-je faire pour vous aujourd'hui ?";
    }
    else if (msg==="je vais bien, merci de demander. et toi ?") {
        return "Je vais bien, merci de demander. Et toi ?";
    }
    else if (msg==="je suis là pour t'aider avec ce que tu veux !") {
        return "Je suis là pour t'aider avec ce que tu veux !";
    }
    else {
        console.log("aucun message correspond");
    }
    for (let key in keywords) {
        for (let synonym of keywords[key]) {
            if (msg.includes(synonym)) {
                return responses[key];
            }
        }
    }

    return "Je n'ai pas compris mais je suis là pour vous écouter. Parlez-moi de ce qui vous tracasse.";
}

function startSpeaking() {
    isSpeaking = true;
    mouthAnimation();
}

function endSpeaking() {
    isSpeaking = false;
}

function mouthAnimation() {
    if (isSpeaking) {
        mouthState = (mouthState + 1) % 4;
        setTimeout(mouthAnimation, 200);
    }
}

function addMessage(sender, message) {
    console.log(sender);
    console.log(message);
    let messageDiv = createDiv();
    messageDiv.addClass('message');
    let img = createImg(sender === 'elpa' ? 'Elpa.png' : 'profile.png', sender + ' image');
    img.parent(messageDiv);
    let textDiv = createDiv(message);
    textDiv.parent(messageDiv);
    if (sender === 'elpa') {
        messageDiv.addClass('elpa');
        img.addClass('elpa');
        textDiv.addClass('elpa');
    } else {
        messageDiv.addClass('user');
        img.addClass('user');
        textDiv.addClass('user');
    }
    chatContainer.child(messageDiv);
    scrollToBottom();
}
function scrollToBottom() {
    chatContainer.elt.scrollTo({
        top: chatContainer.elt.scrollHeight,
        behavior: 'smooth'
    });
}