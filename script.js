let panier = JSON.parse(localStorage.getItem("ghalito-cart")) || [];

const cart = document.getElementById("cart");

function sauvegarder() {

localStorage.setItem(

"ghalito-cart",

JSON.stringify(panier)

);

}

function afficherPanier(){

if(!cart) return;

let html="";

let total=0;

panier.forEach((p,index)=>{

total+=p.prix*p.quantite;

html+=`

<div class="cart-item">

<h3>${p.nom}</h3>

<p>${p.prix.toFixed(2)} €</p>

<div class="qty">

<button onclick="moins(${index})">-</button>

<span>${p.quantite}</span>

<button onclick="plus(${index})">+</button>

</div>

<button onclick="supprimer(${index})">

Supprimer

</button>

</div>

`;

});

cart.innerHTML=html;

document.getElementById("total").innerHTML=

"Total : "+total.toFixed(2)+" €";

}

function plus(i){

panier[i].quantite++;

sauvegarder();

afficherPanier();

}

function moins(i){

if(panier[i].quantite>1)

panier[i].quantite--;

sauvegarder();

afficherPanier();

}

function supprimer(i){

panier.splice(i,1);

sauvegarder();

afficherPanier();

}

document.getElementById("clear-cart")?.addEventListener("click",()=>{

if(confirm("Vider le panier ?")){

panier=[];

sauvegarder();

afficherPanier();

}

});

document.getElementById("checkout")?.addEventListener("click",()=>{

alert("Paiement bientôt disponible.");

});

afficherPanier();
//------------------------------------
// RECHERCHE PRODUITS
//------------------------------------

const search = document.getElementById("search");

if(search){

search.addEventListener("keyup", ()=>{

let value = search.value.toLowerCase();

document.querySelectorAll(".card").forEach(card=>{

let titre = card.querySelector("h3").innerText.toLowerCase();

card.style.display =

titre.includes(value)

? "block"

: "none";

});

});

}

//------------------------------------
// COMPTEUR PANIER
//------------------------------------

const compteur=document.getElementById("cart-count");

if(compteur){

let panier=

JSON.parse(localStorage.getItem("ghalito-cart"))||[];

compteur.innerHTML=panier.length;

}
