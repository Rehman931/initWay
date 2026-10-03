# agents/Prompt_generator.py

from llm.llm import llm1
from schemas.Details import details_state
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate

class OutputNeed(BaseModel):
    query: str

# 1. Force json_mode so Groq returns valid JSON without requiring a tool call
structured_llm = llm1.with_structured_output(OutputNeed, method="json_mode")

def tavily_prompt(state: details_state):
    print("Prompt generator execute.")

    # 2. Simplified prompt structured for JSON output
    response = structured_llm.invoke(
        f"""You are an expert search engineer.

Startup Idea:
{state["startupContext"]}

Generate ONE optimized Google/Tavily search query that retrieves information about competitors, pricing, market size, industry trends, customer demand, and risks.

Rule: Respond with a single JSON object matching this key: "query".
"""
    )

    return {
        "tav_prompt": response.query
    }