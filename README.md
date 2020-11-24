<h1 align="center">Indigo</h1>
<p>
  <a href="https://www.npmjs.com/package/@tidle-groupe/indigo" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/indigo.svg">
  </a>
  <img src="https://img.shields.io/badge/npm-%3E%3D6.5.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D10.0.0-blue.svg" />
  <a href="https://github.com/Tidle-Groupe/indigo/wiki" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/Tidle-Groupe/indigo/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/Tidle-Groupe/indigo/blob/master/LICENSE" target="_blank">
    <img alt="License: GPL--3.0" src="https://img.shields.io/github/license/Tidle-Groupe/indigo" />
  </a>
</p>

> Un framework de programmation léger avec rendu local du site, assets, api, bases de données et construction des fichiers pour la production.

## Prérequis

- npm >=6.5.0
- node >=10.0.0
- Docker >=19.03.00

## Installation

```sh
npm i -g @tidle-groupe/indigo
```

## Utilisation

### Créer un nouveau projet

```sh
indigo new <nom du projet>
```

### Lancer le serveur local de développement

```sh
cd <nom du projet>
indigo run
```

### Lancer le build de production

```sh
cd <nom du projet>
indigo build
```

### Gérer les conteneurs docker d'un projet

```sh
cd <nom du projet>
indigo docker <start|stop|install|uninstall>
```

## Auteur

👤 **Théo Laubezout**

* Twitter: [@TheoLOFF](https://twitter.com/TheoLOFF)
* Github: [@laubezout-theo](https://github.com/laubezout-theo)

## 🤝 Contribuer

Les contributions, issues et demandes de fonctionnalités sont les bienvenus ! <br /> N'hésitez pas à consulter la page des [issues](https://github.com/Tidle-Groupe/indigo/issues). Vous pouvez également consulter le [guide de contribution](https://github.com/Tidle-Groupe/indigo/blob/master/CONTRIBUTING.md).

## Montrez votre soutien

Donnez une ⭐️ si ce projet vous a aidé!

***
Ce projet est sous license [GPL-3.0](https://github.com/Tidle-Groupe/indigo/blob/master/LICENSE).