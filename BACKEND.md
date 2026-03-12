# BLOOM AI Atelier — Backend Reference

**Hosted on:** https://huggingface.co/spaces/Itzadityapandey/Ceo  
**Live base URL:** `https://itzadityapandey-ceo.hf.space`  
**Stack:** Python · Flask · CrewAI · Gemini 2.5 Flash · Firebase · Tweepy · HuggingFace Hub

---

## API Routes

| Method | Route | Description | Response |
|--------|-------|-------------|----------|
| GET | `/` | Status page (HTML) | HTML with links |
| GET | `/wakeup` | Triggers a daily autonomous NFT drop in a background thread | `"✅ Wakeup signal received. Agents starting..."` (200) or `"⚠️ Company already active..."` (429) |
| GET | `/stop` | Sets the stop flag — gracefully halts all agents | `"Stopped: Stop signal sent to agents."` (200) |

> **Note:** `/wakeup` is **non-blocking** — it starts a thread and returns immediately.  
> If another crew is already running, it returns **429**.

---

## Architecture Overview

```
Flask App (app.py)
├── /wakeup  ──► run_crew(is_commission=False)  [thread]
├── /stop    ──► stop_flag.set()
└── poll_for_commissions()  [daemon thread, every 30s]
         └──► run_crew(is_commission=True, custom_prompt, buyer_address, tier, job_id)
```

### Commission Flow (Firebase-triggered)
1. Frontend (`CommissionModal.js`) sends ETH payment via `sendTransaction`
2. On tx success, frontend writes a job to Firebase: `commissions/pending/<job_id>` with `status: "queued"`
3. Backend poller (every 30s) picks up `status === "queued"` jobs
4. Marks job as `in_progress`, runs `run_crew(is_commission=True, ...)`
5. On completion, moves job to `commissions/completed/<job_id>`

---

## Agents & Their Roles

| Agent | Firebase Key | Tools Used | Role |
|-------|-------------|------------|------|
| `Creative Director` | `Creative Director` | None (LLM only) | Decides art theme |
| `Artist` | `Artist` | `GenerateArtTool` | Generates the image |
| `Manager` | `Manager` | `UploadToIPFSTool`, `UpdateDatabaseTool` | Uploads to IPFS, updates `database.json` |
| `Promoter` | `Promoter` | None (LLM only) | Writes marketing copy |
| `Publisher` | `Publisher` | `PostToTwitterTool`, `PostToMoltbookTool` | Posts to Twitter & Moltbook |
| `Analyst` | `Analyst` | None (LLM only) | Reviews the drop |

---

## Firebase Real-Time Schema

### `office_status` (read by frontend)
```json
{
  "System":           { "action": "Wakeup",  "message": "Manual wakeup signal received..." },
  "Creative Director":{ "action": "Commission", "message": "Analyzing client request..." },
  "Artist":           { "action": "working", "message": "Generating artwork for theme: ..." },
  "Manager":          { "action": "working", "message": "Uploading file.png to decentralized storage..." },
  "Promoter":         { "action": "idle",    "message": "Standing by." },
  "Publisher":        { "action": "working", "message": "Publishing tweet..." },
  "Analyst":          { "action": "idle",    "message": "Standing by." }
}
```

### `commissions/pending/<job_id>`
```json
{
  "status":       "queued | in_progress | completed",
  "prompt":       "user's custom art prompt",
  "buyerAddress": "0xWALLET_ADDRESS",
  "tier":         "standard | premium | ultra",
  "finished_at":  1234567890
}
```

---

## Tools (from `tools.py` & `firebase_setup.py`)

| Function | Description |
|----------|-------------|
| `generate_art(theme)` | Calls image generation API, saves `.png` locally |
| `upload_to_ipfs(filename)` | Uploads file to IPFS, returns `ipfs_hash` |
| `update_database(ipfs_hash, prompt, buyer_address, tier)` | Commits new entry to `database.json` on GitHub |
| `broadcast(agent, action, message)` | Writes `office_status/<agent> = {action, message}` to Firebase |
| `initialize_firebase()` | Sets up Firebase Admin SDK |

---

## Environment Variables (HF Space Secrets)

| Variable | Used By |
|----------|---------|
| `GEMINI_API_KEY` | LLM (`gemini-2.5-flash`) |
| `TWITTER_API_KEY` | Tweepy v1 auth |
| `TWITTER_API_SECRET` | Tweepy v1 auth |
| `TWITTER_ACCESS_TOKEN` | Tweepy v1 auth |
| `TWITTER_ACCESS_TOKEN_SECRET` | Tweepy v1 auth |
| `MOLTBOOK_API_KEY` | Moltbook POST API |
| Firebase credentials | `firebase_setup.py` |

---

## Frontend ↔ Backend Contract

| Frontend action | Backend effect |
|----------------|----------------|
| Click "Wake Up Company" | `GET /wakeup` → starts autonomous drop thread |
| Click "Stop All Agents" | `GET /stop` → sets stop flag |
| Commission paid (ETH tx) | Frontend writes to Firebase `commissions/pending` |
| Agent status display | Frontend reads Firebase `office_status` in real-time |
| Gallery display | Frontend fetches `database.json` from GitHub raw URL |
