# A EVITER - Garde-fous execution

Ce document sert de filet de securite pour eviter les erreurs classiques en mode livraison rapide.

## 1) Erreurs de scope
- Ajouter une feature hors MVP.
- Changer l'architecture en cours de route.
- Passer trop de temps sur UI au lieu du flux principal.

## 2) Erreurs techniques
- Hardcoder des secrets/token/password.
- Oublier la validation des inputs.
- Laisser des endpoints admin/public sans protection.
- Ignorer les erreurs reseau/DB sans message utile.
- Introduire une dependance lourde a 10 min de la deadline.

## 3) Erreurs de demo
- Lancer une demo sans donnees pre-remplies.
- Improviser la navigation en live.
- Montrer des ecrans non stables.
- Parler de features non fonctionnelles comme si elles etaient finies.

## 4) Erreurs de communication
- Dire "c'est presque fini" sans preuve.
- Cacher les limites au lieu de cadrer la roadmap.
- Oublier d'annoncer les risques restants.

## 5) Checklist anti-deconvenue (avant livraison)
- [ ] Le flux principal marche de bout en bout.
- [ ] Les 3 mentors de demo sont visibles.
- [ ] Une conversation mentor/mentee est prete.
- [ ] Le script `security_smoke_test.py` a ete lance.
- [ ] Aucun secret en clair dans les fichiers.
- [ ] Pitch 60-90 sec repete 2 fois.
- [ ] Plan B (captures ecran) pret.

## 6) Regle de decision rapide
Si une tache n'augmente pas directement:
1) la stabilite demo, ou
2) la credibilite securite, ou
3) la clarte du pitch,
alors reporter apres la presentation.
