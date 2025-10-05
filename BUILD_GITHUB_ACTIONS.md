# 🤖 Build APK avec GitHub Actions (100% Gratuit)

## 🎯 Qu'est-ce que c'est ?

GitHub Actions permet de compiler votre APK **gratuitement sur les serveurs GitHub** sans rien installer sur votre PC !

## ✅ Avantages

- ✅ **100% Gratuit** (pas de limite)
- ✅ **Pas d'installation** (rien à installer sur votre PC)
- ✅ **Automatique** (dès que vous push sur GitHub)
- ✅ **Illimité** (autant de builds que vous voulez)

## 📋 Installation (5 minutes)

### Étape 1 : Pousser votre code sur GitHub

Si ce n'est pas déjà fait :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter vos fichiers
git add .

# Commit
git commit -m "Setup GitHub Actions build"

# Ajouter le remote (remplacez par votre repo)
git remote add origin https://github.com/RemiAsselin42/radio-alarm-app.git

# Pousser
git push -u origin main
```

### Étape 2 : C'est tout !

Le fichier `.github/workflows/build-android.yml` a déjà été créé. GitHub va automatiquement :
1. Détecter le workflow
2. Compiler l'APK
3. Le rendre téléchargeable

---

## 🚀 Utilisation

### Déclencher un Build Manuellement

1. Allez sur GitHub : https://github.com/RemiAsselin42/radio-alarm-app
2. Cliquez sur **Actions**
3. Sélectionnez **Build Android APK** dans la liste de gauche
4. Cliquez sur **Run workflow** (bouton bleu)
5. Attendez 5-10 minutes
6. Téléchargez l'APK dans les **Artifacts**

### Build Automatique

À chaque `git push` sur la branche `main`, GitHub compile automatiquement un nouvel APK.

---

## 📥 Télécharger l'APK

1. Allez dans **Actions** sur GitHub
2. Cliquez sur le dernier workflow réussi (coche verte ✅)
3. Scrollez en bas vers **Artifacts**
4. Cliquez sur **radio-alarm-app** pour télécharger
5. Décompressez le ZIP
6. Transférez l'APK sur votre téléphone et installez

---

## ⚡ Temps de Build

- **Premier build** : ~8-10 minutes (installation des dépendances)
- **Builds suivants** : ~5-7 minutes

---

## 🔍 Suivre la Progression

Dans l'onglet **Actions** de GitHub, vous verrez :
- 🟡 **Jaune** : Build en cours
- ✅ **Vert** : Build réussi
- ❌ **Rouge** : Erreur (cliquez pour voir les logs)

---

## 💡 Pourquoi c'est Gratuit ?

GitHub offre **2000 minutes gratuites** par mois pour les repos publics et **3000 minutes** pour les repos privés. Un build prend ~5-10 minutes, donc vous pouvez faire **200+ builds par mois** gratuitement !

---

## 🎯 Comparaison des Méthodes

| Méthode              | Coût       | Installation     | Temps/Build | Internet requis |
| -------------------- | ---------- | ---------------- | ----------- | --------------- |
| **GitHub Actions**   | ✅ Gratuit | ✅ Aucune        | ~7 minutes  | ✅ Oui          |
| **Build Local**      | ✅ Gratuit | ⚠️ Android Studio | ~3 minutes  | ⚠️ Première fois |
| **EAS Build**        | ❌ Crédits | ✅ Aucune        | ~15 minutes | ✅ Oui          |

---

## 🎉 Résumé

1. ✅ Le fichier `.github/workflows/build-android.yml` est déjà créé
2. ✅ Poussez votre code sur GitHub
3. ✅ Allez dans **Actions** → **Run workflow**
4. ✅ Attendez 5-10 minutes
5. ✅ Téléchargez l'APK dans **Artifacts**

**C'est la méthode la plus simple si vous ne voulez rien installer !** 🚀
