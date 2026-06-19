# HireFlow AI – Multi-Agent Hiring Platform

## Overview

HireFlow AI is an enterprise-grade multi-agent hiring platform built for the Band.ai Multi-Agent Challenge.

The platform demonstrates how specialized AI agents collaborate through Band.ai to automate the hiring lifecycle, from job creation to candidate evaluation and interview recommendations.

Instead of relying on a single AI model, HireFlow AI uses multiple autonomous agents that coordinate tasks, exchange context, and generate hiring decisions.

---

## Problem

Modern hiring workflows are fragmented.

Recruiters, hiring managers, interviewers, and HR teams often work across disconnected tools and processes.

This leads to:

* Slow hiring decisions
* Manual candidate screening
* Inconsistent interview evaluation
* Lack of collaboration visibility
* Poor workflow traceability

---

## Solution

HireFlow AI introduces a collaborative multi-agent architecture where specialized agents work together through Band.ai.

### Agent Workflow

Hiring Manager Agent
↓
Recruiter Agent
↓
Resume Screening Agent
↓
Interview Agent
↓
Decision Agent

Each agent has a dedicated responsibility and passes structured context to the next agent.

Band.ai acts as the collaboration layer connecting all agents.

---

## Multi-Agent Architecture

### Hiring Manager Agent (AI/ML API)

Responsibilities:

* Generate role requirements
* Define candidate expectations
* Create hiring criteria

### Recruiter Agent (Featherless AI)

Responsibilities:

* Generate job descriptions
* Prepare recruiting workflows
* Coordinate candidate intake

### Resume Screening Agent (AI/ML API)

Responsibilities:

* Analyze candidate resumes
* Calculate match scores
* Identify skill gaps

### Interview Agent (Featherless AI)

Responsibilities:

* Conduct conversational interviews
* Generate adaptive questions
* Evaluate candidate responses

### Decision Agent (AI/ML API)

Responsibilities:

* Aggregate context from previous agents
* Generate hiring recommendations
* Produce final evaluation reports

---

## Band.ai Integration

Band.ai serves as the collaboration and coordination layer.

Agents exchange:

* Context
* Decisions
* Recommendations
* Workflow handoffs
* Hiring events

Band.ai enables:

* Agent-to-agent communication
* Workflow orchestration
* Enterprise collaboration visibility
* Traceable decision making

---

## Features

### Enterprise Command Center

* Agent workflow visualization
* Real-time execution timeline
* Multi-agent orchestration dashboard

### Agent Control Center

* Agent network monitoring
* Workflow metrics
* Agent health visibility
* Collaboration analytics

### AI Interview Room

* Conversational interview experience
* Candidate Intelligence Dashboard
* Live agent consultation
* Decision Agent recommendations

### Candidate Pipeline

* Resume scoring
* Candidate ranking
* Interview readiness tracking

### Dashboard Analytics

* Vacancy statistics
* Hiring metrics
* Candidate insights

## Test Login

You can test the deployed application using the following demo account:

---
### Demo Credentials

Email:
```text
diana@test.com
Password:
```text
$1$7$492
---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication

### AI Layer

* AI/ML API
* Featherless AI
* Band.ai

### Additional Tools

* FastAPI
* Axios

## Local Development

### Clone Repository

```bash
git clone https://github.com/diana15ka/hireflow-multi-agent-system.git

cd hireflow-multi-agent-system
```

---

### AI Service

```bash
cd ai-service

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload --port 8000
```

Runs on:

```text
http://localhost:8000
```

---

### Backend

```bash
cd backend

npm install

npm run dev
```

Runs on:

```text
http://localhost:5000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```text
http://localhost:3000
```

---

### Environment Variables

#### AI Service

Create:

```text
ai-service/.env
```

Required variables:

```env
AIML_API_KEY=your_key
FEATHERLESS_API_KEY=your_key
BAND_API_KEY=your_key

AIML_MODEL=gpt-4o-mini
FEATHERLESS_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct

AIML_BASE_URL=https://api.aimlapi.com/v1
FEATHERLESS_BASE_URL=https://api.featherless.ai/v1

BAND_BASE_URL=https://app.band.ai/api/v1/me
```

#### Backend

Create:

```text
backend/.env
```

Required variables:

```env
DATABASE_URL=your_postgresql_url

JWT_SECRET=your_secret

AI_SERVICE_URL=http://localhost:8000

PORT=5000
```


---

## Why Multiple Agents?

A single LLM can generate content.

Enterprise hiring requires:

* Planning
* Screening
* Interviewing
* Evaluation
* Decision-making

Specialized agents provide:

* Better separation of responsibilities
* Improved traceability
* Easier workflow management
* Enterprise-grade collaboration

---

## Future Roadmap

* Real-time Band.ai chat rooms
* Google Sign-In
* Microsoft Sign-In
* GitHub Sign-In
* Chrome Extension
* Enterprise HR integrations
* ATS integrations
* Advanced analytics

---

Built for the Band.ai Multi-Agent Challenge.
