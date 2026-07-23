# Team Workspace — Cloud Functions deploy guide

These functions are the real enforcement layer behind "Équipe" (Team) in
Mon Espace: inviting members, accepting invitations, changing roles,
removing members. The `firestore.rules` file denies direct client writes to
`companies/{id}/members` and `companies/{id}/invitations` on purpose — those
paths are Cloud-Functions-only, which is why this deploy step is required
before the Team tab does anything beyond "Activer le travail d'équipe".

## 1. Upgrade to the Blaze (pay-as-you-go) plan

Cloud Functions cannot run on Firebase's free Spark plan. In the
[Firebase Console](https://console.firebase.google.com/project/facturergratuit/usage/details) →
**Usage and billing** → **Modify plan** → choose **Blaze**. There's a
generous free tier inside Blaze (2M function invocations/month), so a
small team app like this one is very unlikely to actually cost anything —
but a billing account must be attached.

## 2. Install the Firebase CLI and log in (one-time, on your own machine)

```bash
npm install -g firebase-tools
firebase login
```

## 3. Install the "Trigger Email" extension (for invitation emails)

The functions write invitation emails to a `mail` collection using the
standard convention expected by Firebase's official **Trigger Email**
extension:

Firebase Console → **Extensions** → search **"Trigger Email"** → Install →
point it at an SMTP provider (Gmail SMTP, SendGrid, Mailgun, etc.) and set
the **Collection Path** to `mail` when configuring it.

If you'd rather not install the extension, you can instead send email
directly from `functions/index.js` (replace the two
`db.collection('mail').add(...)` calls with your own mailer, e.g.
`nodemailer` + SMTP credentials stored via `firebase functions:secrets:set`).

## 4. Install function dependencies and deploy

From the repository root:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions,firestore:rules
```

**Do not run a bare `firebase deploy`** — this repo's hosting is GitHub
Pages (see `CNAME`), not Firebase Hosting, and `firebase.json` intentionally
has no `hosting` block for that reason.

## 5. Verify

After deploy, open the site, log in, go to **Mon Compte → Équipe**, and
click **"Activer le travail d'équipe"**. If it succeeds, invitations sent
from that panel should trigger emails within a minute or two (once the
Trigger Email extension is installed and configured).

## What's already enforced server-side

- Only `admin`/`owner` can send, resend, or cancel invitations, change a
  member's role, or (de)activate/remove a member.
- A user can only accept an invitation sent to their own signed-in email.
- The last `owner` of a company can never be demoted, deactivated, or
  removed — ensuring a company can never end up ownerless.
- Company-scoped business data (`clients`, `projects`, `history`,
  `products`, `leads`, project `tasks`/`comments`/`documents`) is gated by
  the caller's role directly in `firestore.rules` — see the `companies`
  block there for exact per-resource permission levels.

## Not built yet (see the phased roadmap discussed with the team)

Task assignment UI, project comments/@mentions, the activity timeline,
workload analytics, the team calendar, and document collaboration UI are
**not** part of this phase — the underlying Firestore paths and security
rules for `projects/{id}/tasks`, `/comments`, `/documents`, `/activity`
already exist and are permission-checked, but there is no UI wired to them
yet. That's deliberate: this phase is the foundation (auth, roles,
invitations) everything else builds on.
