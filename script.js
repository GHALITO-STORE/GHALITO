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
//------------------------------------
// FAVORIS
//------------------------------------

function toggleFavorite(el){

el.classList.toggle("active");

if(el.classList.contains("active")){

el.innerHTML="❤";

}else{

el.innerHTML="♡";

}

//------------------------------------
// Chargement des produits
//------------------------------------

const productsContainer = document.getElementById("products");

if (productsContainer) {

   let allProducts=[];

fetch("products.json")

.then(r=>r.json())

.then(products=>{

allProducts=products;

displayProducts(products);

});

function displayProducts(products){

let html="";

products.forEach(product=>{

html+=`

<div class="card">

<div class="favorite" onclick="toggleFavorite(this)">♡</div>

<img src="${product.image}">

<h3>${product.name}</h3>

<p class="price">${product.price.toFixed(2)} €</p>

<button
class="add-cart"
data-name="${product.name}"
data-price="${product.price}">

Ajouter au panier

</button>

</div>

`;

});

productsContainer.innerHTML=html;

document.querySelectorAll(".add-cart").forEach(btn=>{

btn.onclick=()=>{

ajouterProduit(

btn.dataset.name,

Number(btn.dataset.price)

);

};

});

}
//---------------------------------
// FILTRE
//---------------------------------

const categoryFilter=document.getElementById("categoryFilter");

const priceSort=document.getElementById("priceSort");

function updateProducts(){

let filtered=[...allProducts];

if(categoryFilter.value!="all"){

filtered=filtered.filter(

p=>p.category===categoryFilter.value

);

}

if(priceSort.value=="low"){

filtered.sort((a,b)=>a.price-b.price);

}

if(priceSort.value=="high"){

filtered.sort((a,b)=>b.price-a.price);

}

displayProducts(filtered);

}

categoryFilter?.addEventListener("change",updateProducts);

priceSort?.addEventListener("change",updateProducts);
//------------------------------------
// Slider automatique
//------------------------------------

const slides=document.querySelectorAll(".slide");

let currentSlide=0;

if(slides.length){

setInterval(()=>{

slides[currentSlide].classList.remove("active");

currentSlide++;

if(currentSlide>=slides.length){

currentSlide=0;

}

slides[currentSlide].classList.add("active");

},4000);

}
//------------------------------------
// Bouton Retour en haut
//------------------------------------

const topButton=document.getElementById("topButton");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topButton.style.display="block";

}else{

topButton.style.display="none";

}

});

topButton?.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});
