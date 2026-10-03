from llm.llm import llm1, llm2

from schemas.Details import details_state

from pydantic import BaseModel, Field

from typing import List


class Milestone(BaseModel):

    phase: str = Field(
        description="Phase name"
    )

    duration: str = Field(
        description="Estimated duration of this phase"
    )

    objective: str = Field(
        description="Primary objective of this phase"
    )

    tasks: List[str] = Field(
        description="Detailed list of tasks"
    )

    deliverables: List[str] = Field(
        description="Expected deliverables"
    )


class TeamRecommendation(BaseModel):

    role: str = Field(
        description="Recommended role"
    )

    responsibility: str = Field(
        description="Primary responsibility"
    )


class RoadmapFormat(BaseModel):

    title: str = Field(
        description="Roadmap title"
    )

    overview: str = Field(
        description="Executive summary of the roadmap"
    )

    estimatedDuration: str = Field(
        description="Estimated total project duration"
    )

    milestones: List[Milestone] = Field(
        description="Project phases"
    )

    recommendedTeam: List[TeamRecommendation] = Field(
        description="Recommended team composition"
    )

    estimatedCost: str = Field(
        description="Estimated development cost"
    )

    tools: List[str] = Field(
        description="Recommended technologies and tools"
    )

    risks: List[str] = Field(
        description="Execution risks"
    )

    successMetrics: List[str] = Field(
        description="KPIs to measure success"
    )

    nextSteps: List[str] = Field(
        description="Immediate next actions"
    )


# --------------------------------
# LLMs
# --------------------------------

# Primary → Groq
groq_output = llm1.with_structured_output(RoadmapFormat)

# Fallback → Gemini
gemini_output = llm2.with_structured_output(RoadmapFormat)


def Roadmap(state: details_state):

    print("Roadmap tool running.")

    prompt = f"""
You are a Senior Product Manager, Startup CTO,
Technical Program Manager, and Startup Advisor.

Your job is to generate a practical execution roadmap.

==================================
STARTUP CONTEXT
==================================

{state["startupContext"]}

==================================
INTERNET RESEARCH
==================================

{state["tav_results"]}

==================================
ROADMAP INPUT
==================================

{state["featureInput"]}

--------------------------------------------------
Instructions
--------------------------------------------------

Use:

• Startup Context
• Internet Research
• User Inputs

Generate a realistic roadmap.

Do NOT invent unsupported facts.

The roadmap should prioritize delivering customer value quickly while remaining scalable.

Generate the following:

1. title

- Professional roadmap title.

2. overview

- Brief executive summary.

3. estimatedDuration

- Overall project duration.

4. milestones

Create multiple phases.

Each phase must contain:

- phase
- duration
- objective
- tasks
- deliverables

Typical phases include (adapt if appropriate):

• Discovery & Planning
• UI/UX Design
• MVP Development
• Backend & APIs
• AI Integration
• Testing & QA
• Beta Launch
• Public Launch
• Growth & Scaling

5. recommendedTeam

Recommend required roles.

Examples:

- Product Manager
- UI/UX Designer
- Frontend Engineer
- Backend Engineer
- AI Engineer
- DevOps Engineer
- QA Engineer

For each role explain its responsibility.

6. estimatedCost

Estimate development cost based on:

- Team size
- Timeline
- Complexity

Use the user's roadmap input where applicable.

7. tools

Recommend technologies, frameworks,
cloud platforms, APIs, databases,
monitoring tools, and project management tools.

8. risks

Identify execution risks such as:

- Technical
- Hiring
- Budget
- Timeline
- Product
- Security
- Compliance

9. successMetrics

Define measurable KPIs.

Examples:

- MVP completion
- Active users
- Retention
- Revenue
- Conversion
- Performance

10. nextSteps

Provide immediate actionable next steps after receiving this roadmap.

The roadmap must be practical, investor-ready,
engineering-focused, and suitable for startup execution.
"""

    # --------------------------------
    # Try Groq first
    # --------------------------------

    try:

        print("Trying Groq for Roadmap...")

        response = groq_output.invoke(prompt)

        print("Groq Roadmap succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as groq_error:

        print("Groq Roadmap failed:")
        print(groq_error)

    # --------------------------------
    # Groq failed → Gemini
    # --------------------------------

    try:

        print("Switching Roadmap to Gemini...")

        response = gemini_output.invoke(prompt)

        print("Gemini Roadmap succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as gemini_error:

        print("Gemini Roadmap also failed:")
        print(gemini_error)

        raise