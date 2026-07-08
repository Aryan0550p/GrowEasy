import { describe, it, expect } from 'vitest';
import { parseCsvPreviewData, parseCsvRecords } from '../src/services/csv.service';

describe('parseCsvPreviewData', () => {
  it('parses a simple CSV and returns headers, rows, and totals', () => {
    const csv = 'name,email,phone\nJohn,john@example.com,9876543210\nJane,jane@example.com,9876543211';
    const preview = parseCsvPreviewData(Buffer.from(csv), 'test.csv');
    expect(preview.headers).toEqual(['name', 'email', 'phone']);
    expect(preview.rows).toHaveLength(2);
    expect(preview.totalRows).toBe(2);
    expect(preview.filename).toBe('test.csv');
  });

  it('handles empty cell values gracefully', () => {
    const csv = 'name,email\nJohn,\nJane,jane@example.com';
    const preview = parseCsvPreviewData(Buffer.from(csv), 'empty.csv');
    expect(preview.rows[0].email).toBe('');
    expect(preview.rows[1].email).toBe('jane@example.com');
  });

  it('handles UTF-8 BOM from Excel exports', () => {
    const csv = '\uFEFFname,email\nJohn,john@example.com';
    const preview = parseCsvPreviewData(Buffer.from(csv), 'bom.csv');
    expect(preview.headers).toEqual(['name', 'email']);
    expect(preview.rows).toHaveLength(1);
  });

  it('throws on empty CSV', () => {
    expect(() =>
      parseCsvPreviewData(Buffer.from('name,email\n'), 'empty.csv')
    ).toThrow();
  });

  it('limits preview rows to 100 for large files', () => {
    const rows = Array.from({ length: 150 }, (_, i) => `User${i},user${i}@x.com`).join('\n');
    const csv = `name,email\n${rows}`;
    const preview = parseCsvPreviewData(Buffer.from(csv), 'large.csv');
    expect(preview.rows.length).toBeLessThanOrEqual(100);
    expect(preview.totalRows).toBe(150);
  });

  it('returns correct fileSize in bytes', () => {
    const csv = 'name,email\nJohn,john@example.com';
    const buf = Buffer.from(csv);
    const preview = parseCsvPreviewData(buf, 'size.csv');
    expect(preview.fileSize).toBe(buf.length);
  });
});

describe('parseCsvRecords', () => {
  it('parses all records from buffer', () => {
    const csv = 'full_name,phone_number,email_address\nAlice,9876543210,alice@test.com\nBob,9876543211,bob@test.com';
    const records = parseCsvRecords(Buffer.from(csv));
    expect(records).toHaveLength(2);
    expect(records[0].full_name).toBe('Alice');
    expect(records[1].phone_number).toBe('9876543211');
  });

  it('handles quoted fields with commas inside', () => {
    const csv = 'name,notes\nJohn,"Call back, urgent"\nJane,Normal';
    const records = parseCsvRecords(Buffer.from(csv));
    expect(records[0].notes).toBe('Call back, urgent');
  });
});
