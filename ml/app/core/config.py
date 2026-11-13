from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_KEY: str = "changeme"
    MODEL_NAME: str = "gemini-2.0-flash"

    class Config:
        env_file = ".env"

settings = Settings()
