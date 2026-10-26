import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import '../setup.js';
import {
  normalizeStatus,
  resolvePaymentStatus,
  verifyWebhookSignature
} from '../../services/payment.service.js';

describe('Payment Status Normalization & Webhook Verification', () => {
  it('should normalize status strings cleanly', () => {
    assert.strictEqual(normalizeStatus('  SUCCESS  '), 'success');
    assert.strictEqual(normalizeStatus('Completed'), 'completed');
    assert.strictEqual(normalizeStatus(null), '');
    assert.strictEqual(normalizeStatus(undefined), '');
  });

  it('should resolve success statuses accurately from payload', () => {
    assert.strictEqual(resolvePaymentStatus({ status: 'success' }), 'success');
    assert.strictEqual(resolvePaymentStatus({ data: { status: 'successful' } }), 'success');
    assert.strictEqual(resolvePaymentStatus({ data: { status: 'paid' } }), 'success');
    assert.strictEqual(resolvePaymentStatus({ data: { status: 'completed' } }), 'success');
  });

  it('should resolve failure statuses accurately from payload', () => {
    assert.strictEqual(resolvePaymentStatus({ status: 'failed' }), 'failed');
    assert.strictEqual(resolvePaymentStatus({ data: { status: 'cancelled' } }), 'failed');
    assert.strictEqual(resolvePaymentStatus({ data: { status: 'expired' } }), 'failed');
  });

  it('should resolve pending or ambiguous statuses to pending', () => {
    assert.strictEqual(resolvePaymentStatus({ status: 'pending' }), 'pending');
    assert.strictEqual(resolvePaymentStatus({}), 'pending');
    assert.strictEqual(resolvePaymentStatus(null), 'pending');
  });

  it('should verify valid HMAC-SHA256 webhook signatures', () => {
    const payload = { tx_ref: 'TX-12345', amount: 500, status: 'success' };
    const secret = 'test-webhook-secret-key';
    const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

    const isValid = verifyWebhookSignature(payload, signature, secret);
    assert.strictEqual(isValid, true);
  });

  it('should reject tampered or invalid webhook signatures', () => {
    const payload = { tx_ref: 'TX-12345', amount: 500, status: 'success' };
    const secret = 'test-webhook-secret-key';

    const isValid = verifyWebhookSignature(payload, 'forged-signature-string', secret);
    assert.strictEqual(isValid, false);
  });
});
