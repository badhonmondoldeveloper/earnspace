import fs from 'fs/promises';
import path from 'path';

export interface StorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(this.uploadDir, cleanFileName);
      await fs.writeFile(filePath, fileBuffer);
      return `/uploads/${cleanFileName}`;
    } catch (err) {
      console.warn('Filesystem upload failed or filesystem is read-only. Falling back to Base64 Data URI:', err);
      const base64 = fileBuffer.toString('base64');
      return `data:${mimeType};base64,${base64}`;
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService: StorageProvider = new LocalStorageProvider();

