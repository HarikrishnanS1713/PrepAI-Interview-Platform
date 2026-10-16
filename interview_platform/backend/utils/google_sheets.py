
"""Best-effort Google Sheets login logging."""

import json
import os
import urllib.request


def log_successful_login(email):
    """Send a successful login event to Google Sheets."""
    url = os.environ.get("GOOGLE_SHEETS_WEB_APP_URL")
    secret = os.environ.get("PREPAI_LOG_SECRET")

    if not url or not secret:
        print("Google Sheets logging is not configured.")
        return False

    payload = {
        "secret": secret,
        "email": email,
        "event": "login",
        "status": "success",
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            result = json.loads(response.read().decode("utf-8"))
            if result.get("success") is True:
                return True

            print("Google Sheets did not confirm the log.")
            return False

    except Exception as error:
        # Logging errors must not block a valid login.
        print(f"Google Sheets logging failed: {type(error).__name__}")
        return False
