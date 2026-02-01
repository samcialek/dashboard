# Vim Correspondence Summary
*Compiled Jan 31, 2026 from sam@serif.life Gmail*

## Key People

| Person | Email | Role |
|--------|-------|------|
| **Sam Cialek** | sam@serif.life | Founder/CEO of Serif. Building an "intelligence layer" / meta-model that analyzes personal device signals across data modalities. Has causal inference layer. |
| **Bob Borek** | (Shaper Capital) | Connector/advisor. Recently started at Shaper Capital (Datavant founder's family office). Previously at Datavant. Introduced Sam to Oron. |
| **Oron Afek** | oron@getvim.com | Founder & CEO of Vim. Partnered with Datavant. Exploring how Vim's data can bring wellness/longevity insights into clinical workflows. |
| **William Moschella** | bill@masheen.ai | Partner with Vim/Oron on this initiative. From masheen.ai. Added as optional guest to Feb 6 meeting. |

---

## Complete Timeline

### Jan 14, 2026 (Wednesday) — Thread: "update / intro"

**8:15 PM — Bob → Sam**
- Announces he started Monday at Shaper Capital (Datavant founder's family office)
- Met with Oron Afek (CEO of Vim, partnered with at Datavant)
- Oron is thinking about bringing wellness/longevity insights into clinical workflows leveraging Vim's network
- Asks Sam if he's open to an intro

**8:30 PM — Sam → Bob**
- Congratulates Bob on new role
- Would love to chat with Oron
- Offers Bob a quick demo next week (finally developed a demo instance for external sharing)
- No pressure given Bob's new plate

**11:39 PM — Bob → Sam**
- Happy to chat late next week
- Shares calendar link for demo scheduling

**11:43 PM — Bob → Sam & Oron** — Thread: "intro: sam <> oron"
- Formal intro email connecting Sam and Oron
- "Oron is the founder and CEO of Vim, which we partnered with at Datavant, and is currently brainstorming on how Vim's data might be used to bring [wellness/longevity insights]..."

### Jan 15, 2026 (Thursday)

**9:49 AM — Oron → Sam, Bob**
- Thanks Bob for the connection
- Suggests finding time to chat later in January

**10:44 AM — Sam → Oron, Bob**
- Glad to connect, thanks Bob for intro
- Proposes Jan 26th, shares Calendly: https://calendly.com/serif-sam/30min
- Asks Oron to send data details (e.g., data dictionary) so Sam can come with specific ideas
- Describes Serif's meta-model designed for different data modalities and cadences
- Mentions wearable devices with inter-daily cadence (continuous signal between healthcare encounters) as greenfield area

**10:50 AM — Oron → William, Sam (Bob moved to BCC)**
- Loops in **William Moschella** (bill@masheen.ai) who has partnered with them on this endeavor
- They're using **Zus** initially — shares clinical data documentation:
  - [EHR networks](https://docs.zushealth.com/docs/ehr-networks#data-from-ehr-networks)
  - [Pharmacy network FHIR resources](https://docs.zushealth.com/docs/pharmacy-network#fhir-resources)
  - [ADT networks](https://docs.zushealth.com/docs/adt-networks)
  - [Lab networks](https://docs.zushealth.com/docs/lab-networks)
- Notes: **"100% clinical data so personal devices is a greenfield"**
- Prefers **1/30** given their sales kickoff earlier that week
- Lets William comment on proposed date

### Jan 21, 2026 (Wednesday)

**8:26 AM — Sam → Oron, William**
- January 30th works great if William agrees
- Asks what time works best, offers to send calendar invite
- Thanks for Zus docs — never done this integration but FHIR R4 normalization and Zushooks model should make it straightforward
- Architecture looks well thought out
- Can show how they balance longitudinal clinical context with episodic signals from labs, then tie into wearable devices with inter-daily cadence
- **Asks: What signal do you want beyond what FitBit or Apple Watch can collect?**
- Will come to call with: concrete sketch of how it works, realistic assessment of clinical insights, and broad overview of Serif's product

**11:57 AM — Calendly notification**
- Oron booked via Sam's Calendly link
- **30 Minute Meeting: Friday, February 6, 2026 at 11:00am EST**
- Invitee: Oron Afek (oron@getvim.com)
- Additional Guest: bill@masheen.ai (William Moschella)
- ⚠️ **Gmail flagged a scheduling conflict for this time slot**

**11:58 AM — Oron → Sam, William**
- "Thanks Sam, sounds exciting and relevant"
- Confirms he booked time for **2/6** (not 1/30 as originally preferred)
- Added William as optional

### ~Jan 23-24 (Friday, implied)
- Sam and Bob had a phone/video call (referenced in Jan 26 email)

### Jan 26, 2026 (Monday) — Thread: "Thanks and a quick question"

**5:11 PM — Sam → Bob**
- Thanks Bob for chatting Friday
- Two questions before the Vim demo:
  1. **Framing:** Should he rebrand from "digital health" to "longevity"? E.g., "The Intelligence Layer for Longevity." Attached *Serif Investor Brief, Jan 2026.pdf* as starting point for a prospective partner 2-pager.
  2. **Pricing:** His PMPU pricing equation (discoverserif.com/products_page_serif.php) probably isn't right for this deal structure. What's typical from Bob's Datavant days?
- Also asks for transcript from Friday call (Sam's Gemini notetaker was down)

**10:41 PM — Bob → Sam**
- On framing: **"longevity is catchier than 'digital health.' Alternative would be 'consumer health.'"**
- On pricing: Range of outcomes — from "this close enough to Oron's imaginings that it becomes **Vim's longevity / DTP play**" to "they build a patient-facing application on top of it but you provide the **'back end' and integrations with all the relevant wearables, sensors, etc. and the causal inference layer**" (could be PMPU pricing but also could be financing, equity, etc.)
- Didn't record the transcript

---

## What's Been Discussed / Agreed

- **Vim has 100% clinical data** via Zus (EHR, pharmacy, ADT, lab networks) — FHIR R4 normalized
- **Personal devices/wearables are greenfield** for Vim — this is where Serif fits
- **Serif's meta-model** can bridge clinical data with wearable/personal device signals, providing continuous signal between healthcare encounters
- Sam is confident the Zus integration is technically feasible
- **"Longevity"** framing preferred over "digital health" (per Bob's advice)
- Deal structure TBD — could range from Serif becoming Vim's longevity play to providing backend/integrations layer, with pricing from PMPU to equity discussions

## Current Status

- **Pre-POC / exploratory stage** — introductory meeting scheduled
- Sam has a demo instance ready for external sharing
- Sam has reviewed Zus documentation and is confident integration is feasible
- No formal agreement yet — the Feb 6 meeting is the first real conversation between Sam and Oron
- Sam is preparing a partner-facing 2-pager / case study (starting from Serif Investor Brief)

## Feb 6 Meeting — What It's About

- **30 Minute Meeting** with Oron Afek (+ William Moschella optional)
- **Friday, February 6, 2026 at 11:00am - 11:30am EST**
- **Purpose:** Sam will present:
  - Demo/overview of Serif's capabilities
  - Concrete sketch of how Serif integrates with Vim's clinical data from Zus
  - How wearable/personal device data complements clinical data for longevity insights
  - Realistic assessment of the depth and type of insights possible from their data
  - Address Oron's question about what signal goes beyond FitBit/Apple Watch
- ⚠️ **Gmail flagged a scheduling conflict — Sam should verify calendar**

---

## ⚠️ Action Items / Unanswered Emails

### 1. REPLY TO ORON (High Priority)
**Thread:** "intro: sam <> oron" — Oron's last email (Jan 21, 11:58 AM)
Oron confirmed booking for 2/6 and added William as optional. **Sam has NOT replied to confirm/acknowledge.** It's been 10 days. A quick "Sounds great, see you then!" is overdue.

### 2. REPLY TO BOB (Medium Priority)  
**Thread:** "Thanks and a quick question" — Bob's last email (Jan 26, 10:41 PM)
Bob answered both questions (longevity framing + pricing range). **Sam has NOT acknowledged.** Should thank Bob for the advice. Has "suggested reply" in Gmail.

### 3. DEMO WITH BOB (Low Priority)
**Thread:** "update / intro" — Bob shared calendar link (Jan 14, 11:39 PM)
Sam offered Bob a demo. Bob shared his calendar. **It's unclear if Sam ever booked time.** May want to schedule after the Vim meeting.

### 4. CHECK CALENDAR CONFLICT
Gmail flagged a conflict for Feb 6 at 11:00am. **Resolve before the meeting.**

### 5. PREPARE FOR FEB 6 DEMO
- Finalize "longevity" framing in partner 2-pager
- Prepare concrete sketch of Zus + Serif integration
- Prepare talking points on what signal goes beyond FitBit/Apple Watch
- Have realistic assessment of insight depth from Vim's clinical data
- Consider pricing/deal structure options per Bob's range of outcomes
