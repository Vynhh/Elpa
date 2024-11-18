// Déclarer les variables globalement
let input, speakButton;

function setup() {
    // Sélectionner les éléments HTML et configurer les événements
    input = select('#textInput');
    speakButton = select('#speakButton');
    speakButton.mousePressed(speak);  // Ajouter un écouteur de clic au bouton
}

function speak() {
    let msg = input.value();  // Utiliser la méthode value() de p5.js pour récupérer la valeur de l'input
    if (msg.length > 0) {  // Vérifier si le message n'est pas vide
        responsiveVoice.speak(msg, "Chinese Female");  // Lire le message
    }
}
