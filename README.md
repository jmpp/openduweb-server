# Serveur Open du Web
Repository du code serveur de l'API qui a été utilisé pour l'épreuve n°3 (intégration/front) du concours "Open du Web", édition 2015

------

Pour installer les dépendances : `npm install`

Pour lancer le serveur : `node app.js`

Les 2 URLs à pouvant être appelées sont :

* `http://localhost:1337/getMessages`
* `http://localhost:1337/putMessage`

/getMessages
--

* **Méthode HTTP** : GET
* **Paramètres** : Aucun
* **Valeur de retour** : Un JSON contenant la liste intégrale des messages stockés sur le serveur

/putMessage
--

* **Méthode HTTP** : PUT
* **Paramètres** : Un paramètre `name` pour le nom du posteur et `message` pour le message qui va avec
* **Valeur de retour** : Un JSON contenant la liste intégrale des messages stockés sur le serveur