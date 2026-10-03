from tavily import TavilyClient
from dotenv import load_dotenv
from schemas.Details import details_state
import os

load_dotenv()

tool = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def tavily_search(state:details_state) -> dict:
    """
    Executes the generated search query using Tavily
    and stores the raw search results in the graph state.
    """

    try:
        print("Tavily tool executing.")
        response = tool.search(
            query=state["tav_prompt"],
            search_depth="advanced",
            max_results=6,
        )

        return {
            "tav_results": response.get("results", [])
        }

    except Exception as e:
        print(f"Tavily Search Error: {e}")
        return {
            "tav_results": []
        }