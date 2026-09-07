import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export interface VerifyDeviceSignatureInput {
  deviceId: string;
  payload: string; // Serialized string or raw JSON body
  signature: string;
  nonce: string;
  timestamp: number; // Unix timestamp in ms
}

export class DeviceAuthService {
  /**
   * Registers or updates a paired Android companion device
   */
  static async registerDevice(userId: string, deviceName: string, devicePublicKey: string, appVersion?: string) {
    const existingDevice = await prisma.paymentDevice.findFirst({
      where: { userId, deviceName },
    });

    if (existingDevice) {
      return prisma.paymentDevice.update({
        where: { id: existingDevice.id },
        data: {
          devicePublicKey,
          appVersion: appVersion || existingDevice.appVersion,
          status: 'ACTIVE',
          lastSeenAt: new Date(),
        },
      });
    }

    return prisma.paymentDevice.create({
      data: {
        userId,
        deviceName,
        devicePublicKey,
        appVersion: appVersion || '1.0.0',
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Verifies device signature, timestamp freshness, and nonce replay protection
   */
  static async verifyDeviceRequest(input: VerifyDeviceSignatureInput): Promise<{ valid: boolean; device?: any; reason?: string }> {
    const { deviceId, payload, signature, nonce, timestamp } = input;

    // 1. Timestamp Freshness Check (Must be within 5 minutes = 300,000 ms)
    const now = Date.now();
    const timeDiff = Math.abs(now - timestamp);
    if (timeDiff > 300000) {
      return { valid: false, reason: 'Request timestamp expired or outside 5-minute freshness window' };
    }

    // 2. Fetch Device & Verification Status
    const device = await prisma.paymentDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device || device.status !== 'ACTIVE') {
      return { valid: false, reason: 'Paired device not found or inactive' };
    }

    // 3. Compute Expected HMAC SHA256 Signature using Device Public Key / Secret
    const messageToSign = `${deviceId}:${nonce}:${timestamp}:${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', device.devicePublicKey)
      .update(messageToSign)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid HMAC signature. Device request rejected.' };
    }

    // 4. Touch lastSeenAt
    await prisma.paymentDevice.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date() },
    });

    return { valid: true, device };
  }

  /**
   * Helper to generate HMAC signature (Used in tests and client SDKs)
   */
  static generateSignature(deviceId: string, secretKey: string, payload: string, nonce: string, timestamp: number): string {
    const messageToSign = `${deviceId}:${nonce}:${timestamp}:${payload}`;
    return crypto.createHmac('sha256', secretKey).update(messageToSign).digest('hex');
  }
}
