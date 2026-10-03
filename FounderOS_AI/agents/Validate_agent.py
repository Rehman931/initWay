from llm.llm import llm1, llm2
from schemas.Details import details_state

from pydantic import BaseModel, Field
from typing import List


class DetailsFormat(BaseModel):

    title: str = Field(
        description="A short title for this idea."
    )

    Problem: List[str] = Field(
        description="User pain points and existing problems"
    )

    Competitor: List[str] = Field(
        description="Existing competitors and alternative products"
    )

    Risk: List[str] = Field(
        description="Technical, legal, financial, and market risks"
    )

    Market_demand: List[str] = Field(
        description="Evidence of customer demand and adoption"
    )

    Market_size: List[str] = Field(
        description="Market size, TAM, SAM, SOM, and CAGR"
    )

    Market_trend: List[str] = Field(
        description="Current and future industry trends"
    )

    Monetization: List[str] = Field(
        description="Pricing models and monetization strategies"
    )

    Report: str = Field(
        description="Comprehensive startup validation report"
    )


# Gemini
gemini_output = llm2.with_structured_output(DetailsFormat)

# Groq fallback
groq_output = llm1.with_structured_output(DetailsFormat)


def Validate_fun(state: details_state):

    print("Validate tool running.")

    prompt = f"""
You are an expert startup analyst, venture capitalist, and market researcher.

Your task is to analyze the startup idea using the internet research provided.

========================
STARTUP IDEA
========================

{state["startupContext"]}

========================
INTERNET RESEARCH
========================

{state["tav_results"]}

Extra Instructions:

{state["featureInput"]}

----------------------------------------------------
Instructions
----------------------------------------------------

Analyze the research carefully.

Do NOT invent information.

Use only the available research.

If information is unavailable, return an empty list for that section.

Generate:

1. title
- A short descriptive startup title.

2. Problem
- Main customer pain points.
- Existing inefficiencies.
- Why this problem matters.

3. Competitor
- Existing competitors.
- Alternative solutions.
- Indirect competitors.

4. Risk
Include:
- Technical risks
- Legal risks
- Financial risks
- Market risks
- Operational risks

5. Market_demand
Include:
- Customer demand
- User interest
- Search trends
- Community discussions
- Evidence of adoption

6. Market_size
Include:
- TAM
- SAM
- SOM
- CAGR
- Industry valuation

7. Market_trend
Include:
- Industry trends
- AI trends
- Technology trends
- Future opportunities

8. Monetization
Include:
- Subscription
- Freemium
- Marketplace
- SaaS
- Enterprise
- Licensing
- Advertising
- Commission
- Other revenue models

9. Report

Write a comprehensive startup validation report covering:

- Problem Summary
- Target Customers
- Market Opportunity
- Competitor Analysis
- Risks
- Demand Validation
- Market Trends
- Revenue Opportunities
- Overall Feasibility
- Final Conclusion

The report should be professional, objective, and evidence-based.
"""

    # -----------------------------
    # Try Gemini first
    # -----------------------------

    try:

        print("Trying Gemini...")

        response = gemini_output.invoke(prompt)

        print("Gemini succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as gemini_error:

        print("Gemini failed:")
        print(gemini_error)

    # -----------------------------
    # Gemini failed → Groq
    # -----------------------------

    try:

        print("Gemini failed. Switching to Groq...")

        response = groq_output.invoke(prompt)

        print("Groq succeeded.")

        return {
            "output": response.model_dump()
        }

    except Exception as groq_error:

        print("Groq also failed:")
        print(groq_error)

        # Let Flask/Express know the whole AI generation failed
        raise