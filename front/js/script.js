//--------------------------------------------------------------------------
// Appel des données de l'API avec fetch (GET par défaut)
//--------------------------------------------------------------------------

fetch("http://localhost:3000/api/products")
// Fetch retourne une promese que .json va retourner en json
    .then((res) => res.json())
// Je nomme la promese en "objectProducts"
    .then((objectProducts) => {
        // je la représente avec un tableau dans la console pour mieux visualiser les products
        console.table(objectProducts);
        // J'appel ensuite ma fonction
        lesKanaps(objectProducts);
    })
    .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
      });


//--------------------------------------------------------------------------
// fonction d'affichage des produits de l'api sur la page index
//--------------------------------------------------------------------------

function lesKanaps(index) {
    // déclaration de variable de la zone d'article
    let zoneArticle = document.querySelector("#items");
    // boucle pour chaque variable (nommé 'article') dans l'objet itérable (donc ici nommé 'index')
    for (let article of index) {
      /* création et ajout des zones d'articles, insertion de l'adresse produit via chemin produit + paramètres(son id);
      la page index est http://127.0.0.1:5500/front/html/index.html donc la page du produit sera http://127.0.0.1:5500/front/html/product.html 
      (d'ou le ./product.html) pour rajouter son paramètre on met ? puis la clé (ici _id) associé (=) à sa valeur dynamique ${article._id} */
        zoneArticle.innerHTML += `<a href="./product.html?_id=${article._id}">
        <article>
            <img src="${article.imageUrl}" alt="${article.altTxt}">
            <h3 class="productName">${article.name}</h3>
            <p class="productDescription">${article.description}</p>
        </article>
    </a>`;
    }
}