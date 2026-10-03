from llm.llm import llm1, llm2

from schemas.Details import details_state

from pydantic import BaseModel, Field

from typing import List


# -----------------------------
# Nested Models
# -----------------------------

class Frontend(BaseModel):

    framework: str = Field(
        description="Recommended frontend framework"
    )

    styling: str = Field(
        description="CSS framework or styling library"
    )

    stateManagement: str = Field(
        description="State management solution"
    )


class Backend(BaseModel):

    language: str = Field(
        description="Backend programming language"
    )

    framework: str = Field(
        description="Backend framework"
    )

    api: str = Field(
        description="API architecture"
    )


class Database(BaseModel):

    primary: str = Field(
        description="Primary database"
    )

    cache: str = Field(
        description="Caching solution"
    )


class AIStack(BaseModel):

    llm: str = Field(
        description="Recommended LLM"
    )

    framework: str = Field(
        description="AI framework"
    )

    vectorDatabase: str = Field(
        description="Vector database if required"
    )


class Deployment(BaseModel):

    frontend: str = Field(
        description="Frontend hosting"
    )

    backend: str = Field(
        description="Backend hosting"
    )

    database: str = Field(
        description="Database hosting"
    )


class DevOps(BaseModel):

    ciCd: str = Field(
        description="CI/CD platform"
    )

    monitoring: str = Field(
        description="Monitoring & logging tools"
    )


# -----------------------------
# Final Output
# -----------------------------

class TechStackFormat(BaseModel):

    title: str = Field(
        description="Technology stack title"
    )

    architecture: str = Field(
        description="Overall system architecture"
    )

    frontend: Frontend

    backend: Backend

    database: Database

    aiStack: AIStack

    authentication: str = Field(
        description="Authentication strategy"
    )

    storage: str = Field(
        description="File storage solution"
    )

    deployment: Deployment

    devOps: DevOps

    thirdPartyServices: List[str] = Field(
        description="External APIs and services"
    )

    scalabilityPlan: str = Field(
        description="Scalability strategy"
    )

    estimatedCost: str = Field(
        description="Estimated monthly infrastructure cost"
    )

    reasoning: str = Field(
        description="Reasoning behind technology choices"
    )


# -----------------------------
# LLMs
# -----------------------------

# Primary → Groq
groq_output = llm1.with_structured_output(TechStackFormat)

# Fallback → Gemini
gemini_output = llm2.with_structured_output(TechStackFormat)


# -----------------------------
# Tech Stack Agent
# -----------------------------

def TechStack(state: details_state):

    print("Tech Stack tool running.")

    prompt = f"""
You are a Senior Software Architect, Staff Engineer,
Cloud Architect, AI Engineer, and Startup CTO.

Generate the best technology stack for this startup.

==================================
STARTUP CONTEXT
==================================

{state["startupContext"]}

==================================
INTERNET RESEARCH
==================================

{state["tav_results"]}

==================================
TECH STACK INPUT
==================================

{state["featureInput"]}

--------------------------------------------------
Instructions
--------------------------------------------------

Use:

• Startup Context
• Internet Research
• User Preferences

Recommend a production-ready technology stack.

The recommendation should balance:

- Development speed
- Scalability
- Maintainability
- Security
- Cost
- Developer experience

Return:

1. title

A professional title.

2. architecture

Describe the overall architecture.

3. frontend

Recommend:

- Framework
- Styling
- State Management

4. backend

Recommend:

- Language
- Framework
- API Architecture

5. database

Recommend:

- Primary Database
- Cache

6. aiStack

If AI is required recommend:

- LLM
- AI Framework
- Vector Database

If AI is not needed, explain why.

7. authentication

Recommend an authentication solution.

8. storage

Recommend file/object storage.

9. deployment

Recommend hosting for:

- Frontend
- Backend
- Database

10. devOps

Recommend:

- CI/CD
- Monitoring

11. thirdPartyServices

Recommend useful external services and APIs.

12. scalabilityPlan

Explain how the system can scale from MVP to millions of users.

13. estimatedCost

Estimate monthly infrastructure cost for MVP.

14. reasoning

Explain why these technologies were selected over alternatives.

Recommendations should be practical,
modern,
industry-standard,
startup-friendly,
and suitable for production.
"""

    # --------------------------------
    # Try Groq first
    # --------------------------------

    try:

        print("Trying Groq for Tech Stack...")

        response = groq_output.invoke(prompt)

        print("Groq Tech Stack succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as groq_error:

        print("Groq Tech Stack failed:")
        print(groq_error)

    # --------------------------------
    # Groq failed → Gemini
    # --------------------------------

    try:

        print("Switching to Gemini...")

        response = gemini_output.invoke(prompt)

        print("Gemini Tech Stack succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as gemini_error:

        print("Gemini Tech Stack also failed:")
        print(gemini_error)

        raise