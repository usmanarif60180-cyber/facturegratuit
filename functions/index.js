// FacturePro — Team / Company Cloud Functions
//
// These are the ONLY place team-management writes to companies/{id}/members
// and companies/{id}/invitations happen: the Admin SDK bypasses Firestore
// security rules entirely, so every permission check that matters for these
// collections lives here, not in firestore.rules (rules still lock direct
// client access to these paths to read-only / deny — see firestore.rules).
//
// Email sending uses the "Trigger Email" Firebase Extension convention:
// writing a doc to the top-level `mail` collection. Install the extension
// (Firebase Console > Extensions > "Trigger Email from Firestore") and point
// it at your SMTP provider, or swap the db.collection('mail').add(...) calls
// below for your own mailer if you'd rather not use the extension.

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

const ROLES = ['viewer', 'employee', 'accountant', 'manager', 'admin', 'owner'];
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SITE_URL = 'https://facturergratuit.com';

function roleWeight(role) {
  const idx = ROLES.indexOf(role);
  return idx === -1 ? -1 : idx;
}

function isValidRole(role) {
  return ROLES.includes(role);
}

function requireAuth(request) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Connexion requise.');
  return request.auth;
}

async function getMembership(companyId, uid) {
  const snap = await db.doc(`companies/${companyId}/members/${uid}`).get();
  return snap.exists ? snap.data() : null;
}

async function requireMinRole(companyId, uid, minRole) {
  const membership = await getMembership(companyId, uid);
  if (!membership || membership.status !== 'active') {
    throw new HttpsError('permission-denied', "Vous n'êtes pas membre actif de cette société.");
  }
  if (roleWeight(membership.role) < roleWeight(minRole)) {
    throw new HttpsError('permission-denied', 'Permissions insuffisantes pour cette action.');
  }
  return membership;
}

async function setIndexRole(uid, companyId, role) {
  await db.doc(`userCompanyIndex/${uid}`).set(
    { companies: { [companyId]: role } },
    { merge: true }
  );
}

async function clearIndexRole(uid, companyId) {
  await db.doc(`userCompanyIndex/${uid}`)
    .update({ [`companies.${companyId}`]: admin.firestore.FieldValue.delete() })
    .catch(() => {});
}

// ═══════════════════════════════════════════════
// createCompany
// ═══════════════════════════════════════════════
exports.createCompany = onCall(async (request) => {
  const auth = requireAuth(request);
  const name = String(request.data?.name || '').trim();
  if (!name) throw new HttpsError('invalid-argument', 'Nom de société requis.');
  if (name.length > 120) throw new HttpsError('invalid-argument', 'Nom trop long.');

  const companyRef = db.collection('companies').doc();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const batch = db.batch();
  batch.set(companyRef, { name, ownerId: auth.uid, createdAt: now, updatedAt: now });
  batch.set(companyRef.collection('members').doc(auth.uid), {
    uid: auth.uid,
    email: (auth.token.email || '').toLowerCase(),
    name: auth.token.name || auth.token.email || 'Owner',
    role: 'owner',
    status: 'active',
    joinedAt: now,
    invitedBy: auth.uid
  });
  await batch.commit();
  await setIndexRole(auth.uid, companyRef.id, 'owner');

  return { companyId: companyRef.id };
});

// ═══════════════════════════════════════════════
// sendInvitation
// ═══════════════════════════════════════════════
exports.sendInvitation = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, email, role } = request.data || {};
  if (!companyId) throw new HttpsError('invalid-argument', 'companyId requis.');
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new HttpsError('invalid-argument', 'Email invalide.');
  }
  if (!isValidRole(role) || role === 'owner') {
    throw new HttpsError('invalid-argument', 'Rôle invalide.');
  }
  const inviter = await requireMinRole(companyId, auth.uid, 'admin');

  const existingMembers = await db.collection(`companies/${companyId}/members`)
    .where('email', '==', cleanEmail).limit(1).get();
  if (!existingMembers.empty) {
    throw new HttpsError('already-exists', 'Cette personne est déjà membre de la société.');
  }
  const existingInvites = await db.collection(`companies/${companyId}/invitations`)
    .where('email', '==', cleanEmail).where('status', '==', 'pending').limit(1).get();
  if (!existingInvites.empty) {
    throw new HttpsError('already-exists', 'Une invitation est déjà en attente pour cet email.');
  }

  const token = crypto.randomBytes(24).toString('hex');
  const now = admin.firestore.FieldValue.serverTimestamp();
  const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + INVITE_TTL_MS);
  const companySnap = await db.doc(`companies/${companyId}`).get();
  const companyName = companySnap.data()?.name || 'FacturePro';

  const inviteRef = db.collection(`companies/${companyId}/invitations`).doc();
  await inviteRef.set({
    email: cleanEmail,
    role,
    token,
    status: 'pending',
    invitedBy: auth.uid,
    invitedByName: inviter.name || auth.token.email || '',
    invitedAt: now,
    expiresAt
  });

  await sendInviteEmail({ companyId, inviteId: inviteRef.id, token, email: cleanEmail, companyName, role, inviterName: inviter.name });

  return { invitationId: inviteRef.id };
});

// ═══════════════════════════════════════════════
// resendInvitation
// ═══════════════════════════════════════════════
exports.resendInvitation = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, invitationId } = request.data || {};
  if (!companyId || !invitationId) throw new HttpsError('invalid-argument', 'Paramètres requis.');
  await requireMinRole(companyId, auth.uid, 'admin');

  const inviteRef = db.doc(`companies/${companyId}/invitations/${invitationId}`);
  const inviteSnap = await inviteRef.get();
  if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invitation introuvable.');
  const invite = inviteSnap.data();
  if (invite.status !== 'pending') throw new HttpsError('failed-precondition', "Cette invitation n'est plus en attente.");

  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + INVITE_TTL_MS);
  await inviteRef.update({ token, expiresAt, resentAt: admin.firestore.FieldValue.serverTimestamp() });

  const companySnap = await db.doc(`companies/${companyId}`).get();
  const companyName = companySnap.data()?.name || 'FacturePro';
  await sendInviteEmail({ companyId, inviteId: invitationId, token, email: invite.email, companyName, role: invite.role, inviterName: invite.invitedByName, reminder: true });

  return { ok: true };
});

async function sendInviteEmail({ companyId, inviteId, token, email, companyName, role, inviterName, reminder }) {
  const acceptUrl = `${SITE_URL}/?invite=${inviteId}&company=${companyId}&token=${token}`;
  await db.collection('mail').add({
    to: email,
    message: {
      subject: reminder
        ? `Rappel : invitation à rejoindre ${companyName} sur FacturePro`
        : `Invitation à rejoindre ${companyName} sur FacturePro`,
      html: `<p>Bonjour,</p>
        <p><strong>${inviterName || 'Un administrateur'}</strong> vous invite à rejoindre
        <strong>${companyName}</strong> sur FacturePro en tant que <strong>${role}</strong>.</p>
        <p><a href="${acceptUrl}">Accepter l'invitation</a></p>
        <p>Ce lien expire dans 7 jours. Si vous n'attendiez pas cette invitation, ignorez cet email.</p>`
    }
  });
}

// ═══════════════════════════════════════════════
// cancelInvitation
// ═══════════════════════════════════════════════
exports.cancelInvitation = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, invitationId } = request.data || {};
  if (!companyId || !invitationId) throw new HttpsError('invalid-argument', 'Paramètres requis.');
  await requireMinRole(companyId, auth.uid, 'admin');

  const inviteRef = db.doc(`companies/${companyId}/invitations/${invitationId}`);
  const inviteSnap = await inviteRef.get();
  if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invitation introuvable.');
  if (inviteSnap.data().status !== 'pending') throw new HttpsError('failed-precondition', "Cette invitation n'est plus en attente.");

  await inviteRef.update({ status: 'cancelled', cancelledAt: admin.firestore.FieldValue.serverTimestamp() });
  return { ok: true };
});

// ═══════════════════════════════════════════════
// acceptInvitation
// ═══════════════════════════════════════════════
exports.acceptInvitation = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, invitationId, token } = request.data || {};
  if (!companyId || !invitationId || !token) throw new HttpsError('invalid-argument', 'Paramètres requis.');

  const inviteRef = db.doc(`companies/${companyId}/invitations/${invitationId}`);
  const role = await db.runTransaction(async (tx) => {
    const inviteSnap = await tx.get(inviteRef);
    if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invitation introuvable.');
    const invite = inviteSnap.data();

    if (invite.status !== 'pending') throw new HttpsError('failed-precondition', "Cette invitation n'est plus valide.");
    if (invite.token !== token) throw new HttpsError('permission-denied', 'Lien invalide.');
    if (invite.expiresAt && invite.expiresAt.toMillis() < Date.now()) {
      tx.update(inviteRef, { status: 'expired' });
      throw new HttpsError('deadline-exceeded', 'Cette invitation a expiré. Demandez-en une nouvelle.');
    }
    const callerEmail = String(auth.token.email || '').toLowerCase();
    if (callerEmail !== invite.email) {
      throw new HttpsError('permission-denied', 'Cette invitation est destinée à une autre adresse email. Connectez-vous avec le bon compte.');
    }

    const memberRef = db.doc(`companies/${companyId}/members/${auth.uid}`);
    const now = admin.firestore.FieldValue.serverTimestamp();
    tx.set(memberRef, {
      uid: auth.uid,
      email: callerEmail,
      name: auth.token.name || callerEmail,
      role: invite.role,
      status: 'active',
      joinedAt: now,
      invitedBy: invite.invitedBy
    });
    tx.update(inviteRef, { status: 'accepted', acceptedAt: now, acceptedBy: auth.uid });
    return invite.role;
  });

  await setIndexRole(auth.uid, companyId, role);
  return { ok: true, role };
});

// ═══════════════════════════════════════════════
// declineInvitation
// ═══════════════════════════════════════════════
exports.declineInvitation = onCall(async (request) => {
  requireAuth(request);
  const { companyId, invitationId, token } = request.data || {};
  if (!companyId || !invitationId || !token) throw new HttpsError('invalid-argument', 'Paramètres requis.');

  const inviteRef = db.doc(`companies/${companyId}/invitations/${invitationId}`);
  const inviteSnap = await inviteRef.get();
  if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invitation introuvable.');
  const invite = inviteSnap.data();
  if (invite.token !== token) throw new HttpsError('permission-denied', 'Lien invalide.');
  if (invite.status !== 'pending') throw new HttpsError('failed-precondition', "Cette invitation n'est plus en attente.");

  await inviteRef.update({ status: 'declined', declinedAt: admin.firestore.FieldValue.serverTimestamp() });
  return { ok: true };
});

// ═══════════════════════════════════════════════
// updateMemberRole
// ═══════════════════════════════════════════════
exports.updateMemberRole = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, memberUid, role } = request.data || {};
  if (!companyId || !memberUid || !isValidRole(role)) throw new HttpsError('invalid-argument', 'Paramètres invalides.');
  const caller = await requireMinRole(companyId, auth.uid, 'admin');

  const memberRef = db.doc(`companies/${companyId}/members/${memberUid}`);
  await db.runTransaction(async (tx) => {
    const memberSnap = await tx.get(memberRef);
    if (!memberSnap.exists) throw new HttpsError('not-found', 'Membre introuvable.');
    const member = memberSnap.data();

    if (member.role === 'owner' && role !== 'owner') {
      const ownersSnap = await tx.get(db.collection(`companies/${companyId}/members`).where('role', '==', 'owner'));
      if (ownersSnap.size <= 1) {
        throw new HttpsError('failed-precondition', 'Impossible de rétrograder le dernier propriétaire.');
      }
    }
    if (role === 'owner' && caller.role !== 'owner') {
      throw new HttpsError('permission-denied', 'Seul un propriétaire peut nommer un autre propriétaire.');
    }
    tx.update(memberRef, { role, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  });

  await setIndexRole(memberUid, companyId, role);
  return { ok: true };
});

// ═══════════════════════════════════════════════
// toggleMemberStatus
// ═══════════════════════════════════════════════
exports.toggleMemberStatus = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, memberUid, status } = request.data || {};
  if (!companyId || !memberUid || !['active', 'inactive'].includes(status)) {
    throw new HttpsError('invalid-argument', 'Paramètres invalides.');
  }
  await requireMinRole(companyId, auth.uid, 'admin');
  if (memberUid === auth.uid) throw new HttpsError('failed-precondition', 'Vous ne pouvez pas vous désactiver vous-même.');

  const memberRef = db.doc(`companies/${companyId}/members/${memberUid}`);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists) throw new HttpsError('not-found', 'Membre introuvable.');
  if (memberSnap.data().role === 'owner') throw new HttpsError('failed-precondition', 'Impossible de désactiver un propriétaire.');

  await memberRef.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return { ok: true };
});

// ═══════════════════════════════════════════════
// removeMember
// ═══════════════════════════════════════════════
exports.removeMember = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId, memberUid } = request.data || {};
  if (!companyId || !memberUid) throw new HttpsError('invalid-argument', 'Paramètres requis.');
  await requireMinRole(companyId, auth.uid, 'admin');
  if (memberUid === auth.uid) {
    throw new HttpsError('failed-precondition', 'Vous ne pouvez pas vous retirer vous-même. Utilisez "Quitter la société".');
  }

  const memberRef = db.doc(`companies/${companyId}/members/${memberUid}`);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists) throw new HttpsError('not-found', 'Membre introuvable.');
  if (memberSnap.data().role === 'owner') throw new HttpsError('failed-precondition', 'Impossible de retirer un propriétaire.');

  await memberRef.delete();
  await clearIndexRole(memberUid, companyId);
  return { ok: true };
});

// ═══════════════════════════════════════════════
// leaveCompany (self-service)
// ═══════════════════════════════════════════════
exports.leaveCompany = onCall(async (request) => {
  const auth = requireAuth(request);
  const { companyId } = request.data || {};
  if (!companyId) throw new HttpsError('invalid-argument', 'companyId requis.');

  const memberRef = db.doc(`companies/${companyId}/members/${auth.uid}`);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists) throw new HttpsError('not-found', "Vous n'êtes pas membre de cette société.");
  if (memberSnap.data().role === 'owner') {
    const ownersSnap = await db.collection(`companies/${companyId}/members`).where('role', '==', 'owner').get();
    if (ownersSnap.size <= 1) {
      throw new HttpsError('failed-precondition', 'Transférez la propriété avant de quitter : vous êtes le dernier propriétaire.');
    }
  }
  await memberRef.delete();
  await clearIndexRole(auth.uid, companyId);
  return { ok: true };
});
