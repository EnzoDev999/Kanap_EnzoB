// Nous voulons différencier la page cart et la page confirmation grace à location.href
const page = document.location.href;

//--------------------------------------------------------------------------
// Appel des données de l'API avec fetch (GET par défaut)
//--------------------------------------------------------------------------
// SI on se situe bien sur la page panier, alors on fait appel aux ressources de l'api product
/* page.match("cart") va permettre de comprendre si on est sur la page panier en analysant l'URL et en vérifiant s'il y a bien la string "cart",
si c'est confirmé alors on est bien dans la page panier */
if (page.match("cart")) {
    fetch("http://localhost:3000/api/products")
        // Fetch retourne une promese que .json va retourner en json
        .then((res) => res.json())
        // Je nomme la promese en "objectProducts"
        .then((objectProducts) => {
            // Vérification que tout est bien affiché
            console.log(objectProducts);
             // J'appel ensuite ma fonction
            displayCart(objectProducts);
        })
        .catch((err) => {
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
          });
} else {
    console.log("page confirmation affichée")
}

//---------------------------------------------------------------------------------------------------------
// Création de la fonction displayCart qui va déterminer les conditions d'affichage des produits du panier
//---------------------------------------------------------------------------------------------------------

function displayCart(products) {
    // on récupère le panier (qui est en string car provient du localStorage) qu'on convertit en object JS
    let cart = JSON.parse(localStorage.getItem("storageCart"));
    // S'il y a un panier avec une taille differante de 0 (donc supérieure à 0)
    if (cart && cart.length != 0) {
     // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
     for (let choice of cart) {
        console.log(choice);
        products.forEach(element => {
            if (choice._id === element._id) {
                    choice.name = element.name;
                    choice.price = element.price;
                    choice.image = element.imageUrl;
                    choice.description = element.description;
                    choice.alt = element.altTxt;
            }
        });
     }
     // On appel la fonction display() qui va utiliser les données de cart(définies juste au dessus)
    display(cart);
    } else {
        // Si le panier se retrouve vide, on créer un h1 qui va servire d'inforamation
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML = 
        "Vous n'avez pas d'article dans votre panier.";
    }
    // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage au besoin
    //changeQuantity();
    //deleteProduct();
}

//--------------------------------------------------------------
// Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------

// on créer la fonction display() avec un params qui va permettre l'appel de données à appliqué à cette fonction (donc utilisera les données de "cart")
function display(indexé) {
    // on déclare et on pointe la zone d'affichage
    let zoneCart = document.querySelector("#cart__items");
    // on créer l'affichage des produits du panier via un map et on introduit les dataset(défini plus tôt) dans le code
    zoneCart.innerHTML += indexé.map((choice) => 
    `<article class="cart__item" data-id="${choice._id}" data-color="${choice.color}" data-quantity="${choice.quantity}" data-price="${choice.price}"> 
    <div class="cart__item__img">
      <img src="${choice.image}" alt="${choice.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choice.name}</h2>
        <span>couleur : ${choice.color}</span>
        <p data-price="${choice.price}">${choice.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choice.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choice._id}" data-couleur="${choice.color}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide

  // reste à l'écoute grâce à la fonction suivante pour modifier l'affichage au besoin
  //totalProduct();
}