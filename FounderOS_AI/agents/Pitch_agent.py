from llm.llm import llm1, llm2

from schemas.Details import details_state

from pydantic import BaseModel, Field


class PitchFormat(BaseModel):

    title: str = Field(
        description="Startup title"
    )

    oneLiner: str = Field(
        description="One sentence startup summary"
    )

    elevatorPitch: str = Field(
        description="30-60 second investor pitch"
    )

    problem: str = Field(
        description="Customer problem being solved"
    )

    solution: str = Field(
        description="How the startup solves the problem"
    )

    targetCustomer: str = Field(
        description="Ideal customer"
    )

    marketOpportunity: str = Field(
        description="Market opportunity"
    )

    valueProposition: str = Field(
        description="Unique value proposition"
    )

    businessModel: str = Field(
        description="Revenue model"
    )

    competitiveAdvantage: str = Field(
        description="Competitive advantage"
    )

    whyNow: str = Field(
        description="Why this startup is relevant now"
    )

    goToMarket: str = Field(
        description="Go-to-market strategy"
    )

    traction: str = Field(
        description="Current traction or expected early traction"
    )

    vision: str = Field(
        description="Long-term vision"
    )

    callToAction: str = Field(
        description="Investor or customer call to action"
    )

    investorSummary: str = Field(
        description="Professional investor summary"
    )


# --------------------------------
# LLMs
# --------------------------------

# Primary → Gemini
gemini_output = llm2.with_structured_output(PitchFormat)

# Fallback → Groq
groq_output = llm1.with_structured_output(PitchFormat)


def Pitch(state: details_state):

    print("Pitch tool running.")

    prompt = f"""
You are an expert startup strategist, startup founder, venture capitalist,
and pitch deck consultant.

========================
STARTUP CONTEXT
========================

{state["startupContext"]}

========================
INTERNET RESEARCH
========================

{state["tav_results"]}

========================
PITCH INPUT
========================

{state["featureInput"]}

-------------------------------------
Instructions
-------------------------------------

Use both the startup context and internet research.

Do NOT invent facts.

Generate a compelling investor-ready pitch.

Return:

1. title

- Startup title.

2. oneLiner

- One sentence describing the startup.

3. elevatorPitch

- 30–60 second startup pitch.

4. problem

- Customer pain point.

5. solution

- Startup solution.

6. targetCustomer

- Primary target audience.

7. marketOpportunity

- Market opportunity using research.

8. valueProposition

- Why customers choose this solution.

9. businessModel

- Revenue generation model.

10. competitiveAdvantage

- Main competitive advantages.

11. whyNow

- Why this is the right time to build it.

12. goToMarket

- Initial customer acquisition strategy.

13. traction

- Existing traction if available.
- Otherwise suggest realistic early milestones.

14. vision

- Long-term company vision.

15. callToAction

- Short investor/customer CTA.

16. investorSummary

- Professional summary suitable for investors.
"""

    # --------------------------------
    # Try Gemini first
    # --------------------------------

    try:

        print("Trying Gemini for Pitch...")

        response = gemini_output.invoke(prompt)

        print("Gemini Pitch succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as gemini_error:

        print("Gemini Pitch failed:")
        print(gemini_error)

    # --------------------------------
    # Gemini failed → Groq
    # --------------------------------

    try:

        print("Switching Pitch to Groq...")

        response = groq_output.invoke(prompt)

        print("Groq Pitch succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as groq_error:

        print("Groq Pitch also failed:")
        print(groq_error)

        raise