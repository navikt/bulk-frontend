# Bulk-frontend

Next.js frontend for bulk-uttrekk av kontaktinformasjon av KRR.
Projektet utvikles av team-bulk.

## Utvikling

### Miljøvariabler

Første gang man setter opp prosjektet, og når prod endrer seg, må man oppdatere miljøvariablene.
De lagres i `.env.local`, og kan være en kopi av .env.example, men man må fylle inn verdiene for `AZURE_APP_CLIENT_ID` og `AZURE_APP_CLIENT_SECRET`, `AZURE_APP_JWK`.

Disse kan man finne gjennom K8s clusteret i `dev-gcp` gjennom kommandoene:

```bash
gcloud auth login # Log inn med NAV kontoen din
kubectl set-context dev-gcp
kubectl get pods -n team-bulk # Hent ut navnet til bulk-frontend  K8s på formen bulk-frontend-xxxxxxxxx-xxxxx
kubectl exec -it bulk-frontend-xxxxxxxxxx-xxxxx -- env | grep AZURE_APP
```

### Oppsett

Installer de brukte pakkene med

```bash
yarn
```

### Kjøring

Kjør projektet lokalt med

```bash
yarn dev
```
