from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI(title="HireFlow Agents AI Service")

AIML_API_KEY = os.getenv("AIML_API_KEY")
FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")
BAND_API_KEY = os.getenv("BAND_API_KEY")

AIML_MODEL = os.getenv("AIML_MODEL", "gpt-4o-mini")
FEATHERLESS_MODEL = os.getenv(
    "FEATHERLESS_MODEL",
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
)

AIML_BASE_URL = os.getenv("AIML_BASE_URL", "https://api.aimlapi.com/v1")
FEATHERLESS_BASE_URL = os.getenv(
    "FEATHERLESS_BASE_URL",
    "https://api.featherless.ai/v1",
)
BAND_BASE_URL = os.getenv("BAND_BASE_URL", "https://app.band.ai/api/v1/me")


class VacancyRequest(BaseModel):
    companyName: str
    title: str
    level: str
    industry: str
    techStack: str


class InterviewRequest(BaseModel):
    title: str
    level: str
    techStack: str
    vacancyText: str


class ResumeMatchRequest(BaseModel):
    title: str
    level: str
    techStack: str
    vacancyText: str
    resumeText: str


class VacancyOptimizationRequest(BaseModel):
    vacancyText: str


class InterviewAgentRequest(BaseModel):
    conversation: str
    position: str
    level: str
    candidateName: str = "Candidate"


class HiringWorkflowRequest(BaseModel):
    companyName: str
    position: str
    level: str
    industry: str
    techStack: str
    candidateName: str
    resumeText: str


def call_openai_compatible(
    base_url: str,
    api_key: str,
    model: str,
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 900,
    temperature: float = 0.4,
) -> str:
    if not api_key:
        return "DEMO RESPONSE: API key is missing. Add it to your .env file."

    response = requests.post(
        f"{base_url}/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        },
        timeout=60,
    )

    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def call_aiml(system_prompt: str, user_prompt: str, max_tokens: int = 900) -> str:
    return call_openai_compatible(
        base_url=AIML_BASE_URL,
        api_key=AIML_API_KEY,
        model=AIML_MODEL,
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        max_tokens=max_tokens,
        temperature=0.35,
    )


def call_featherless(system_prompt: str, user_prompt: str, max_tokens: int = 900) -> str:
    return call_openai_compatible(
        base_url=FEATHERLESS_BASE_URL,
        api_key=FEATHERLESS_API_KEY,
        model=FEATHERLESS_MODEL,
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        max_tokens=max_tokens,
        temperature=0.5,
    )


def create_band_chat():
    if not BAND_API_KEY:
        return None

    try:
        response = requests.post(
            f"{BAND_BASE_URL}/chats",
            headers={
                "X-API-Key": BAND_API_KEY,
                "Content-Type": "application/json",
            },
            json={"chat": {}},
            timeout=30,
        )

        response.raise_for_status()
        return response.json()["data"]["id"]

    except Exception as error:
        print("Band chat creation failed:", error)
        return None


def send_band_message(message: str, chat_id=None):
    if not BAND_API_KEY:
        return {
            "status": "local_demo_log",
            "error": "BAND_API_KEY missing",
        }

    active_chat_id = chat_id

    if not active_chat_id:
        active_chat_id = create_band_chat()

    if not active_chat_id:
        return {
            "status": "chat_creation_failed",
        }

    try:
        response = requests.post(
            f"{BAND_BASE_URL}/chats/{active_chat_id}/messages",
            headers={
                "X-API-Key": BAND_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "message": {
                    "content": message,
                    "mentions": [],
                }
            },
            timeout=30,
        )

        return {
            "status": "sent_to_band",
            "chatId": active_chat_id,
            "code": response.status_code,
            "response": response.text[:500],
        }

    except Exception as error:
        return {
            "status": "band_request_failed",
            "chatId": active_chat_id,
            "error": str(error),
        }


def band_log(agent_name: str, message: str):
    result = send_band_message(f"[{agent_name}] {message}")

    return {
        "agent": agent_name,
        "provider": "Band.ai",
        "status": result.get("status"),
        "message": message,
        "bandResponse": result,
    }


@app.get("/")
def root():
    return {
        "message": "HireFlow Agents AI Service Running",
        "providers": {
            "Band.ai": "real REST API handoff layer",
            "AI/ML API": "Hiring Manager Agent, Resume Screening Agent, Decision Agent",
            "Featherless AI": "Recruiter Agent, Interview Agent",
        },
    }


@app.post("/generate-vacancy")
async def generate_vacancy(data: VacancyRequest):
    prompt = f"""
Create a professional job vacancy in English.

Company: {data.companyName}
Position: {data.title}
Level: {data.level}
Industry: {data.industry}
Tech Stack: {data.techStack}

Important:
- Use the company name "{data.companyName}".
- Do not use placeholders such as [Company Name], [City], [Email], [Website], or similar.
- The entire response must be in English.
- Use professional HR language.
- Use clear markdown formatting.

Generate:
1. Job Description
2. Key Responsibilities
3. Requirements
4. Hard Skills
5. Soft Skills
6. KPIs
"""

    text = call_featherless(
        "You are a professional Recruiter Agent. Always respond in English.",
        prompt,
    )

    return {
        "generated_vacancy": text,
        "provider": "Featherless AI",
        "bandLog": band_log(
            "Recruiter Agent",
            "Recruiter Agent generated an English vacancy and passed it to Resume Screening Agent.",
        ),
    }


@app.post("/generate-interview-questions")
async def generate_interview_questions(data: InterviewRequest):
    prompt = f"""
Create interview questions in English.

Position: {data.title}
Level: {data.level}
Tech Stack: {data.techStack}

Vacancy:
{data.vacancyText}

Generate:
1. Technical Questions
2. Behavioral Questions
3. Practical Task
4. Expected Answers

Important:
- The entire response must be in English.
- Do not use placeholders.
- Use professional technical recruiting language.
"""

    text = call_featherless(
        "You are an Interview Agent. Always respond in English.",
        prompt,
    )

    return {
        "interview_questions": text,
        "provider": "Featherless AI",
        "bandLog": band_log(
            "Interview Agent",
            "Interview Agent generated English interview questions and passed them to Decision Agent.",
        ),
    }


@app.post("/match-resume")
async def match_resume(data: ResumeMatchRequest):
    prompt = f"""
You are a Resume Screening Agent in a multi-agent hiring workflow.

Compare the candidate resume with the vacancy.

Position: {data.title}
Level: {data.level}
Required Tech Stack: {data.techStack}

Vacancy:
{data.vacancyText}

Candidate Resume:
{data.resumeText}

Generate in English:
1. Match Score from 0 to 100
2. Skills Found
3. Missing Skills
4. Strengths
5. Risks
6. Recommendation: Reject / Hold / Invite to Interview
7. Short Explanation

Important:
- The entire response must be in English.
- Be objective and structured.
- Do not use placeholders.
"""

    text = call_aiml(
        "You are a Resume Screening Agent. Be objective, structured, and always respond in English.",
        prompt,
    )

    return {
        "resume_match": text,
        "provider": "AI/ML API",
        "bandLog": band_log(
            "Resume Screening Agent",
            "Resume Screening Agent evaluated the candidate and passed the result to Interview Agent.",
        ),
    }


@app.post("/optimize-vacancy")
async def optimize_vacancy(data: VacancyOptimizationRequest):
    prompt = f"""
You are an HR recruitment expert.

Vacancy:
{data.vacancyText}

The entire response must be in English.

Generate:
1. LinkedIn Version
2. HeadHunter Version
3. Telegram Version
4. Instagram Version
5. Corporate Website Version

A/B Testing:
Version A — Formal Corporate
Version B — Candidate Friendly
Version C — Short High Conversion

Recommendations:
- How to improve application conversion
- What information is missing
- How competitive the vacancy is in the market
- What benefits should be added
- How to improve the vacancy description

Important:
- Do not use templates or placeholders.
- Use professional HR and recruitment language.
"""

    text = call_featherless(
        "You are a Recruiter Agent and vacancy optimization expert. Always respond in English.",
        prompt,
    )

    return {
        "optimized_vacancy": text,
        "provider": "Featherless AI",
        "bandLog": band_log(
            "Recruiter Agent",
            "Recruiter Agent optimized English vacancy versions and passed them through Band.",
        ),
    }


@app.post("/interview-agent")
async def interview_agent(data: InterviewAgentRequest):
    prompt = f"""
You are an Interview Agent in a multi-agent hiring workflow.

Candidate: {data.candidateName}
Position: {data.position}
Level: {data.level}

Interview history:
{data.conversation}

Task:
- Ask only the next interview question.
- Do not repeat previous questions.
- One response must contain exactly one question.
- The question must be in English.
- Behave like a professional senior technical recruiter.
- Ask relevant follow-up questions based on the candidate's previous answer.
- If enough information has already been collected, ask a deeper technical or problem-solving question.

Return only the next question. Do not include explanations.
"""

    text = call_featherless(
        "You are an Interview Agent in a Band.ai multi-agent hiring workflow. Always respond in English.",
        prompt,
        max_tokens=250,
    )

    return {
        "nextQuestion": text,
        "provider": "Featherless AI",
        "bandLog": band_log(
            "Interview Agent",
            "Interview Agent generated the next English conversational question and handed context to Decision Agent.",
        ),
    }


@app.post("/hiring-workflow")
async def hiring_workflow(data: HiringWorkflowRequest):
    band_logs = []

    requirements_prompt = f"""
Create role requirements in English.

Company: {data.companyName}
Position: {data.position}
Level: {data.level}
Industry: {data.industry}
Tech Stack: {data.techStack}

Generate:
1. Business Need
2. Must-Have Skills
3. Nice-to-Have Skills
4. Success Criteria
5. Candidate Profile

Important:
- The entire response must be in English.
- Use professional hiring manager language.
- Be concise and structured.
"""

    requirements = call_aiml(
        "You are a Hiring Manager Agent. Always respond in English.",
        requirements_prompt,
    )

    band_logs.append(
        band_log(
            "Hiring Manager Agent",
            "Hiring Manager Agent created English role requirements and handed them to Recruiter Agent.",
        )
    )

    vacancy_prompt = f"""
Using these role requirements, create a professional job vacancy in English.

Role Requirements:
{requirements}

Generate:
1. Job Description
2. Responsibilities
3. Requirements
4. Hard Skills
5. Soft Skills
6. Short Posting Version

Important:
- The entire response must be in English.
- Do not use placeholders.
- Use clear, professional recruitment language.
"""

    vacancy = call_featherless(
        "You are a Recruiter Agent. Always respond in English.",
        vacancy_prompt,
    )

    band_logs.append(
        band_log(
            "Recruiter Agent",
            "Recruiter Agent created an English vacancy and handed it to Resume Screening Agent.",
        )
    )

    screening_prompt = f"""
Compare the candidate resume with the vacancy in English.

Candidate: {data.candidateName}

Vacancy:
{vacancy}

Resume:
{data.resumeText}

Generate:
1. Match Score 0-100
2. Skills Found
3. Missing Skills
4. Strengths
5. Risks
6. Recommendation: Reject / Hold / Invite to Interview

Important:
- The entire response must be in English.
- Be objective and concise.
"""

    screening = call_aiml(
        "You are a Resume Screening Agent. Always respond in English.",
        screening_prompt,
    )

    band_logs.append(
        band_log(
            "Resume Screening Agent",
            "Resume Screening Agent scored the candidate and handed the result to Interview Agent.",
        )
    )

    interview_prompt = f"""
Create a structured interview plan in English.

Position: {data.position}
Level: {data.level}

Vacancy:
{vacancy}

Screening:
{screening}

Generate:
1. Opening Question
2. 5 Technical Questions
3. 3 Behavioral Questions
4. Practical Task
5. Evaluation Criteria

Important:
- The entire response must be in English.
- Use professional technical recruiting language.
"""

    interview_plan = call_featherless(
        "You are an Interview Agent. Always respond in English.",
        interview_prompt,
    )

    band_logs.append(
        band_log(
            "Interview Agent",
            "Interview Agent created an English interview plan and handed it to Decision Agent.",
        )
    )

    decision_prompt = f"""
Make a final hiring recommendation in English.

Role Requirements:
{requirements}

Vacancy:
{vacancy}

Screening:
{screening}

Interview Plan:
{interview_plan}

Generate:
1. Final Decision: Hire / Hold / Reject
2. Match Score from 0 to 100
3. Reason
4. Strengths
5. Risks
6. Next Action

Important:
- The entire response must be in English.
- Use professional executive-level HR language.
- Be concise and decision-oriented.
- Do not use placeholders.
"""

    decision = call_aiml(
        "You are a Decision Agent. Always respond in English.",
        decision_prompt,
    )

    band_logs.append(
        band_log(
            "Decision Agent",
            "Decision Agent produced the final English recommendation and handed it to Hiring Manager.",
        )
    )

    return {
        "workflowName": "HireFlow Agents",
        "providersUsed": {
            "Band.ai": "real REST API handoff layer",
            "AI/ML API": "Hiring Manager Agent, Resume Screening Agent, Decision Agent",
            "Featherless AI": "Recruiter Agent, Interview Agent",
        },
        "requirements": requirements,
        "vacancy": vacancy,
        "screening": screening,
        "interviewPlan": interview_plan,
        "decision": decision,
        "bandLogs": band_logs,
    }