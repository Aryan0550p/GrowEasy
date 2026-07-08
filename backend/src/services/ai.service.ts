import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/env';
import { CrmLead } from '../../../shared/src/types';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  System Prompt — Comprehensive CRM extraction instructions                  */
/* ─────────────────────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are an expert CRM data extraction system for GrowEasy, a real estate CRM platform. Your task is to intelligently map raw CSV records from ANY source format into GrowEasy's structured CRM format.

## CSV Sources You Will Encounter

The CSV data may come from any of these sources (column names will vary wildly):

**Facebook Lead Ads** — columns like: full_name, phone_number, email_address, created_time, ad_name, campaign_name, platform
**Google Ads Lead Forms** — columns like: First Name, Last Name, Phone, Email Address, Submission Date, Campaign, Ad Group
**Real Estate CRMs** — columns like: Lead Name, Contact No, Property Interest, Lead Status, Source, Remarks, Entry Date, Agent
**Sales/Marketing CSVs** — columns like: prospect_name, contact_email, mobile, company, city, lead_stage, pipeline_status, notes, assigned_to
**Manual Spreadsheets** — ANY column names the user defined
**Excel Exports** — may have extra headers, formatting, BOM characters

## Target CRM Fields

Extract as many of these as possible from each record:

| Field | Description | Common Source Column Names |
|-------|-------------|---------------------------|
| created_at | Lead creation timestamp (JS new Date() parseable) | created_time, submission_date, date, timestamp, entry_date, created_at, Date Added |
| name | Full lead name | full_name, name, lead_name, First Name + Last Name, contact_name, prospect |
| email | Primary email | email, email_address, Email Address, contact_email, e-mail |
| country_code | Dial code with + prefix | country_code, dial_code, isd_code |
| mobile_without_country_code | Mobile number without country code or leading zeros | phone, phone_number, mobile, contact, Phone Number, contact_no, tel |
| company | Company/organization | company, company_name, organization, firm, employer |
| city | City | city, location, City, town |
| state | State or province | state, province, region, State |
| country | Country name | country, Country, nation |
| lead_owner | Assigned owner (email or name) | assigned_to, lead_owner, agent, salesperson, owner, assigned_agent |
| crm_status | Lead quality status | status, lead_status, pipeline_status, result, disposition, stage, quality |
| crm_note | Notes, extra contacts, remarks | notes, remarks, comments, description, additional_info, follow_up_notes, observation |
| data_source | Source identifier | source, utm_source, lead_source, campaign, platform, channel, ad_name |
| possession_time | Property possession timeline | possession_time, possession, timeline, when_needed, move_in |
| description | Additional description | description, details, requirements, property_type, budget, additional_notes |

## Strict Extraction Rules

### 1. CRM Status (crm_status) — ONLY use these exact values or omit
- **GOOD_LEAD_FOLLOW_UP** → Synonyms: interested, hot lead, follow up, callback needed, reschedule, wants more info, good, qualified, warm, promising, considering, call back
- **DID_NOT_CONNECT** → Synonyms: no answer, busy, not reachable, switched off, not picked up, voicemail, unreachable, ringing, no response, try again, call later
- **BAD_LEAD** → Synonyms: not interested, wrong number, duplicate, junk, spam, already purchased, not relevant, invalid, bad, disqualified, cancelled, rejected, no budget
- **SALE_DONE** → Synonyms: sold, closed, won, deal done, booked, converted, purchased, completed, onboarding, agreement signed

If status is ambiguous or missing, leave crm_status undefined.

### 2. Data Source (data_source) — ONLY use these exact values or omit
- **leads_on_demand** → source mentions: "LOD", "leads on demand", "lead_demand", "on demand"
- **meridian_tower** → source mentions: "meridian", "meridian tower", "meridian_tower"
- **eden_park** → source mentions: "eden", "eden park", "eden_park"
- **varah_swamy** → source mentions: "varah", "varah swamy", "varahswamy"
- **sarjapur_plots** → source mentions: "sarjapur", "sarjapur plots", "sarjapur_plots", "sarjapur road"

If source doesn't clearly match any of these, leave data_source undefined.

### 3. Phone Number Extraction
Parse phone numbers carefully:
- "+91 9876543210" → country_code: "+91", mobile: "9876543210"
- "91-9876543210" → country_code: "+91", mobile: "9876543210"
- "09876543210" (leading 0) → mobile: "9876543210" (strip leading 0)
- "+1 (555) 123-4567" → country_code: "+1", mobile: "5551234567" (digits only)
- "9876543210" (10 digits, likely Indian) → mobile: "9876543210", country_code: "+91" if context suggests India
- If no country code identifiable: just set mobile_without_country_code, leave country_code undefined
- Multiple phones → use first as mobile, append rest to crm_note with prefix "Additional phones: "

### 4. Email Handling
- Multiple emails → use first valid one as email, append rest to crm_note with prefix "Additional emails: "
- Validate: must contain @ and at least one dot in domain

### 5. Name Handling
- Separate first/last name columns → combine: "FirstName LastName"
- Clean extra whitespace, fix all-caps if obvious (e.g., "JOHN DOE" → keep as-is, don't transform)

### 6. Date Handling
- Convert to ISO 8601 format or any format parseable by JavaScript's new Date()
- Formats: "2024-01-15", "15/01/2024", "Jan 15 2024", "15-Jan-2024", "01/15/2024" are all valid
- If no date found, leave created_at undefined

### 7. CRM Notes (crm_note)
Concatenate into crm_note (semicolons between items):
- Original remarks/comments from CSV
- Extra phone numbers: "Additional phones: +91 9000000000"
- Extra emails: "Additional emails: other@example.com"
- Any info that doesn't fit other fields but could be useful

### 8. Skip Rule (CRITICAL)
SKIP any record where BOTH of these are true:
- No valid email found (valid = contains @ and domain)
- No valid mobile found (valid = at least 7 digits)
Include skipped records in the "skipped" array with the row number and reason.

### 9. Data Integrity
- Omit fields that are empty, null, undefined, or contain only whitespace
- Don't invent data — only extract what's present
- Row index in skipped array should match the _row field in the input records

## Output Format

Return ONLY a valid JSON object. No markdown. No explanation. No code blocks.

{
  "extracted": [
    {
      "created_at": "2024-01-15T10:30:00.000Z",
      "name": "John Doe",
      "email": "john@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      "company": "Acme Corp",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "lead_owner": "agent@groweasy.com",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Interested in 2BHK. Additional phones: +91 9000000000",
      "data_source": "sarjapur_plots",
      "possession_time": "6 months",
      "description": "Budget around 80 lakhs"
    }
  ],
  "skipped": [
    {
      "row": 3,
      "reason": "No valid email or mobile number found in record",
      "rawData": { "Name": "Unknown", "Status": "bad" }
    }
  ]
}`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface BatchResult {
  extracted: CrmLead[];
  skipped: Array<{ row: number; reason: string; rawData: Record<string, unknown> }>;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main extraction function                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

export async function extractWithAI(
  records: Record<string, unknown>[],
  startRow: number
): Promise<BatchResult> {
  const provider = ENV.AI_PROVIDER;

  // Tag each record with its row number so AI can reference it in skipped[]
  const taggedRecords = records.map((r, i) => ({ _row: startRow + i + 1, ...r }));
  const recordsJson = JSON.stringify(taggedRecords, null, 2);

  const userMessage = `Process these ${records.length} CSV records (rows ${startRow + 1}–${startRow + records.length}) and extract GrowEasy CRM data:\n\n${recordsJson}`;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      switch (provider) {
        case 'openai':
          return await extractWithOpenAI(userMessage);
        case 'gemini':
          return await extractWithGemini(userMessage);
        case 'anthropic':
          return await extractWithAnthropic(userMessage);
        default:
          throw new Error(`Unsupported AI provider: ${provider}. Set AI_PROVIDER to openai, gemini, or anthropic.`);
      }
    } catch (error) {
      attempt++;
      console.error(`AI extraction failed on attempt ${attempt}/${maxRetries}. Error:`, error);
      if (attempt >= maxRetries) {
        throw error;
      }
      // Exponential backoff: 2s, 4s, 8s
      const delayMs = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delayMs}ms...`);
      await new Promise(res => setTimeout(res, delayMs));
    }
  }

  throw new Error('AI extraction failed after all retries.');
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Provider implementations                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

async function extractWithOpenAI(userMessage: string): Promise<BatchResult> {
  if (!ENV.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured in .env');

  const client = new OpenAI({ apiKey: ENV.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: ENV.AI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 16000,
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return parseAIResponse(content);
}

async function extractWithGemini(userMessage: string): Promise<BatchResult> {
  if (!ENV.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured in .env');

  const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: ENV.AI_MODEL || 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 16000,
      responseMimeType: 'application/json',
    },
  });

  return parseAIResponse(result.response.text());
}

async function extractWithAnthropic(userMessage: string): Promise<BatchResult> {
  if (!ENV.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not configured in .env');

  const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: ENV.AI_MODEL || 'claude-3-haiku-20240307',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    temperature: 0.1,
  });

  const text = (response.content[0] as { text: string }).text ?? '{}';
  return parseAIResponse(text);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Response parsing                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

export function parseAIResponse(text: string): BatchResult {
  // Strip any markdown code fences that some models add despite instructions
  const cleaned = text
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    const extracted: CrmLead[] = Array.isArray(parsed.extracted) ? parsed.extracted : [];
    const skipped = Array.isArray(parsed.skipped) ? parsed.skipped : [];
    return { extracted, skipped };
  } catch (err) {
    console.error('Failed to parse AI response (first 1000 chars):', cleaned.substring(0, 1000));
    throw new Error(
      `AI response JSON parsing failed: ${err instanceof Error ? err.message : 'Unknown error'}. ` +
        `The model did not return valid JSON.`
    );
  }
}
