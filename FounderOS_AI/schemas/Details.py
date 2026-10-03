from pydantic import Field,BaseModel
from typing import TypedDict, Dict, Any

class details_state(TypedDict):
    # Selected feature
    feature: str  # validation | pitch | roadmap | techstack

    # Startup Context (5 common questions)
    startupContext: Dict[str, Any]

    # Feature-specific input
    featureInput: Dict[str, Any]

    # Tavily / Internet Research
    tav_prompt: str
    tav_results: Dict[str, Any]

    # Structured output (stored as dict)
    output: Dict[str, Any]

   

    
    