// =========================
// GHALITO - V8.4
// =========================

let panier = JSON.parse(localStorage.getItem("ghalito-cart")) || [];

// Ajouter un produit
function ajouterProduit(nom, prix) {

    const produit = {
        id: Date.now(),
        nom,
        prix,
        quantite: 1
    };

    panier.push(produit);

    localStorage.setItem("ghalito-cart", JSON.stringify(panier));

    alert(nom + " ajouté au panier.");

}

// Boutons Ajouter au panier
document.querySelectorAll(".add-cart").forEach(btn => {

    btn.addEventListener("click", () => {

        ajouterProduit(

            btn.dataset.name,

            Number(btn.dataset.price)

        );

    });

});
