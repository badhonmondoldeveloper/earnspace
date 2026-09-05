/**
 * File Upload Security & Magic Bytes Verification Module
 * Validates file headers, extensions, size limits, and prevents path traversal / script execution.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: string;
}

const MAGIC_NUMBERS: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
  'video/mp4': [0x00, 0x00, 0x00], // ftyp box
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
};

const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'pdf', 'txt'
]);

export function validateFileUpload(
  buffer: Buffer,
  filename: string,
  declaredMimeType: string,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10 MB default
): ValidationResult {
  // 1. File Size Guard
  if (buffer.length > maxSizeBytes) {
    return { valid: false, error: `File size exceeds limit of ${maxSizeBytes / (1024 * 1024)}MB` };
  }

  // 2. Path Traversal & Safe Filename Check
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { valid: false, error: 'Invalid filename containing directory traversal sequences' };
  }

  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File extension '.${ext}' is not permitted` };
  }

  // 3. Executable / Script File Extension Exclusion
  const DANGEROUS_EXTS = ['html', 'htm', 'js', 'php', 'exe', 'sh', 'bat', 'svg', 'cgi', 'pl'];
  if (DANGEROUS_EXTS.includes(ext)) {
    return { valid: false, error: 'Executable or script file types are strictly prohibited' };
  }

  // 4. Magic Bytes Inspection
  const expectedMagic = MAGIC_NUMBERS[declaredMimeType];
  if (expectedMagic) {
    for (let i = 0; i < expectedMagic.length; i++) {
      if (buffer[i] !== expectedMagic[i]) {
        return {
          valid: false,
          error: `File signature mismatch for declared type ${declaredMimeType}`,
        };
      }
    }
  }

  return { valid: true, detectedMime: declaredMimeType };
}

