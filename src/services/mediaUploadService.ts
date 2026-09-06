import { MEDIA_CONFIG } from '@/config/media';

export interface UploadResult {
  url: string;
  mimeType: string;
  size: number;
  purpose: string;
}

export async function uploadMedia(
  file: File,
  purpose: 'avatar' | 'cover' | 'post-image' | 'story-image' | 'thumbnail' | 'video' | 'reel',
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const policy = MEDIA_CONFIG.policies[purpose];
  if (policy) {
    if (file.size > policy.maxBytes) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${(policy.maxBytes / (1024 * 1024)).toFixed(0)}MB`);
    }
    if (!policy.mimeTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Allowed: ${policy.mimeTypes.join(', ')}`);
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', purpose);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/v1/uploads', true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          resolve(data.data);
        } else {
          reject(new Error(data.error?.message || data.message || 'Upload failed'));
        }
      } catch (err) {
        reject(new Error('Invalid response from upload server'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file upload'));
    };

    xhr.send(formData);
  });
}

