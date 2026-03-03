#!/usr/bin/env node
/**
 * Run this once to generate VAPID keys for Web Push notifications.
 * Add the output values to your .env.local file.
 */

const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();

console.log('VAPID keys generated. Add these to your .env.local:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
