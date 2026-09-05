import sanitizeHtml from 'sanitize-html';

export function sanitizeContent(html: string): string {
  if (!html) return '';
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'br', 'img', 'hr', 'span', 'div'
    ],
    allowedAttributes: {
      'a': ['href', 'name', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
      '*': ['class', 'style']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' })
    }
  });
}

