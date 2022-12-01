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
        .then((res) => res.json())
        .then((objectProducts) => {
            console.log(objectProducts);
            displayCart(objectProducts);
        })
        .catch((err) => {
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
          });
} else {
    console.log("page confirmation affichée")
}