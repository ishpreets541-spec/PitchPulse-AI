# AI Voice Agent - Talk to Founder

LiveKit voice agent + Next.js frontend with real-time visual orchestration.

## What this project does

- Runs a LiveKit voice AI agent (`my-agent`) for founder-style discovery calls.
- Frontend renders live UI from agent tool calls:
  - Services view
  - Service detail focus
  - Process diagram
  - Live lead capture fields
- Synchronizes state over LiveKit during the call.

## Local setup

### 1. Clone

```bash
git clone https://github.com/lakshya-vipassana/AI-Voice-Agent-Talk-to-Founder.git
cd AI-Voice-Agent-Talk-to-Founder
```

### 2. Agent setup

```bash
cd agent
uv sync
cp .env.example .env.local
```

Set these in `agent/.env.local`:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `GROQ_API_KEY` (if your current pipeline needs it)

Optional TTS voice settings:

- `TTS_MODEL` (default: `cartesia/sonic-3`)
- `TTS_VOICE_ID` (default is current project voice)

Download model assets once:

```bash
uv run python src/agent.py download-files
```

Run the agent:

```bash
uv run python src/agent.py dev
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Set these in `frontend/.env.local`:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `AGENT_NAME=my-agent`

Run frontend:

```bash
npm run dev
```

Open:

- `http://localhost:3000`

## Male voice

Yes, you can use a male voice.

In `agent/.env.local`, set:

```bash
TTS_MODEL=cartesia/sonic-3
TTS_VOICE_ID=<male_voice_id_from_your_provider>
```

Then restart the agent:

```bash
cd agent
uv run python src/agent.py dev
```

Note: voice IDs are provider-specific. Pick a male voice ID from your TTS provider dashboard/docs and paste it into `TTS_VOICE_ID`.

