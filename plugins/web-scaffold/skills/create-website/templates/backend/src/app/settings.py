from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    cors_origins: str = "http://localhost:3000"
    contact_inbox_email: str = "{{contact_email}}"
    resend_api_key: str | None = None
    resend_from_email: str | None = None
    contact_rate_limit: str = "5/minute"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
