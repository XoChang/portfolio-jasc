# Firebase Setup — Portfolio JASC

## 1. Firestore — Reglas de seguridad
En Firebase Console → Firestore → Reglas, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/data {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 2. Storage — Reglas de seguridad
En Firebase Console → Storage → Reglas, pega esto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 3. Acceso al panel admin
- URL secreta: https://tuportfolio.netlify.app/#admin
- El botón ya NO aparece en el portfolio
- Solo tú conoces esta URL

## 4. Ventajas vs Supabase
- Sin auto-suspend (plan gratuito siempre activo)
- 1GB Firestore + 5GB Storage gratuito
- Google Infrastructure (alta disponibilidad)
