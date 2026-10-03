import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
gemini_api_key = os.getenv("GOOGLE_API_KEY")

llm1 = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.3,
    api_key=groq_api_key
)

llm2 = ChatGoogleGenerativeAI(
    model='gemini-3.5-flash-lite',
    temperature=0.3,
    api_key=gemini_api_key
)

