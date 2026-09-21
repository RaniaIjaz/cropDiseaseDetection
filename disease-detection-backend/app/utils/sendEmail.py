from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()


def get_mail_config() -> ConnectionConfig:
    username = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_PASSWORD")
    sender = os.getenv("MAIL_FROM", username)

    if not username or not password or not sender:
        raise RuntimeError(
            "MAIL_USERNAME, MAIL_PASSWORD, and MAIL_FROM must be configured"
        )

    return ConnectionConfig(
        MAIL_USERNAME=username,
        MAIL_PASSWORD=password,
        MAIL_FROM=sender,
        MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
        MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
    )

async def send_email(subject: str, email: EmailStr, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=body,
        subtype="plain"
    )
    fm = FastMail(get_mail_config())
    await fm.send_message(message)
