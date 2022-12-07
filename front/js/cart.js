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
        // Si le panier se retrouve vide, on créer un h1 qui va servire d'information
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
  totalProduct();
}


//--------------------------------------------------------------------------
// fonction changeQuantity on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------------------

function changeQuantity() {
  const cart = document.querySelectorAll(".cart__item");
  // Nous allons maintenant écouter ce qu'il se passe dans itemQuantity d'un article précis
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      // On vérifie la nouvelle valeur(et sa validation) après le clique ainsi que son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("storageCart"));
      // On créer ensuite une boucle afin d'appliquer la nouvelle quantité du produit au panier grâce à sa nouvele valeur validé auparavant
      for (article of panier)
      if (
        article._id === cart.dataset.id &&
        cart.dataset.color === article.color
      ) {
        article.quantity = eq.target.value;
        localStorage.storageCart = JSON.stringify(panier);
        // On appliqué ensuite le changement de quantité à la dataset qui s'en charge
        cart.dataset.quantity = eq.target.value;
        // Et enfin on joue la fonction afin d'actualiser les données
        totalProduct();
      }
    });
  });
}


//-------------------------------------------------------------------------------------------
// fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
//-------------------------------------------------------------------------------------------

function deleteProduct() {
  // On déclare la variable (ici on va viser le "supprimer" dans <article> cart__item > <p> deleteItem)
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  // On vise CHAQUE élément de cartdelete
  cartdelete.forEach((cartdelete) => {
    // Maintenant on écoute si un clic se fait sur la zone visé auparavant d'un articlé concerné
    cartdelete.addEventListener("click", () => {
      // appel de la ressource du localStorage
      let panier = JSON.parse(localStorage.getItem("storageCart"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].color === cartdelete.dataset.color
        ) {
          // on déclare une variable qui sera utile à la supréssion
          const num = [d];
          // on va ensuite créer un tableau miroir en ne contenant pas l'articlé supprimé auparavant
          let newCart = JSON.parse(localStorage.getItem("storageCart"));
          // On supprime donc 1 élement à l'indice "num" (.splice() permet cette modification de contenu directement sur le tableau)
          newCart.splice(num, 1);
          // SI le nouveau panier créer devient vide après suppréssion d'article(s)(donc un panier vide)
          if (newCart == newCart.length == 0) {
          // Si le panier se retrouve vide, on créer un h1 qui va servire d'information
          document.querySelector("#totalQuantity").innerHTML = "0";
          document.querySelector("#totalPrice").innerHTML = "0";
          document.querySelector("h1").innerHTML = 
          "Vous n'avez pas d'article dans votre panier.";
          }
          // On renvoit le nouveau panier (newcart()) converti dans le localStorage pour ensuite jouer la fonction
          localStorage.storageCart = JSON.stringify(newCart);
          totalProduct();
          // Et enfin on refresh la page afin que la page se charge sans le produit supprimé
          return location.reload();
        }
    });
  });
}