import { parseAIResponse } from '../src/services/ai.service';

describe('AI Service', () => {
  describe('parseAIResponse', () => {
    it('should parse valid JSON response correctly', () => {
      const mockResponse = JSON.stringify({
        extracted: [{ name: 'Test User', email: 'test@example.com' }],
        skipped: []
      });

      const result = parseAIResponse(mockResponse);

      expect(result.extracted).toHaveLength(1);
      expect(result.extracted[0].name).toBe('Test User');
      expect(result.skipped).toHaveLength(0);
    });

    it('should strip markdown codeblocks before parsing', () => {
      const mockResponse = `\`\`\`json
{
  "extracted": [],
  "skipped": [{"row": 1, "reason": "No email"}]
}
\`\`\``;

      const result = parseAIResponse(mockResponse);
      expect(result.skipped).toHaveLength(1);
      expect(result.skipped[0].reason).toBe('No email');
    });

    it('should throw an error for invalid JSON', () => {
      const invalidResponse = `{ "extracted": [ }`;
      expect(() => parseAIResponse(invalidResponse)).toThrow();
    });
  });
});
