from agents.Validate_agent import Validate_fun
from agents.Tech_agent import TechStack
from agents.Prompt_generator import tavily_prompt
from agents.Pitch_agent import Pitch
from agents.Roadmap_agent import Roadmap
from tool.tavily import tavily_search

from langgraph.graph import StateGraph, START, END
from schemas.Details import details_state

builder = StateGraph(details_state)

# Nodes
builder.add_node("prompt", tavily_prompt)
builder.add_node("tavily", tavily_search)

builder.add_node("validate", Validate_fun)
builder.add_node("pitch", Pitch)
builder.add_node("roadmap", Roadmap)
builder.add_node("techstack", TechStack)

def feature_route(state: details_state):
    return state.get("feature")



builder.add_edge("prompt","tavily")    

# ---------- END ----------
builder.add_edge("validate", END)
builder.add_edge("pitch", END)
builder.add_edge("roadmap", END)
builder.add_edge("techstack", END)
builder.add_edge("tavily",  END)

builder.add_conditional_edges(
    START,
    feature_route,
    {
        "validation":"validate",
        "pitch":"pitch",
        "roadmap":"roadmap",
        "techstack":"techstack",
        "prompt":"prompt"
    }
)


graph = builder.compile()

