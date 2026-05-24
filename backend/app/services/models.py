from typing import List, Dict

MODELS: List[Dict[str, str]] = [
    {"id": "openai/gpt-4o",                      "name": "GPT-4o",              "provider": "OpenAI"},
    {"id": "openai/gpt-4o-mini",                 "name": "GPT-4o Mini",         "provider": "OpenAI"},
    {"id": "google/gemini-2.0-flash-001",        "name": "Gemini 2.0 Flash",    "provider": "Google"},
    {"id": "meta-llama/llama-3.1-70b-instruct",  "name": "Llama 3.1 70B",      "provider": "Meta"},
    {"id": "mistralai/mistral-large",            "name": "Mistral Large",        "provider": "Mistral"},
    {"id": "deepseek/deepseek-chat",             "name": "DeepSeek Chat",        "provider": "DeepSeek"},
    {"id": "qwen/qwen-2.5-72b-instruct",         "name": "Qwen 2.5 72B",        "provider": "Alibaba"},
]

DEFAULT_MODEL = "openai/gpt-4o-mini"
