#!/usr/bin/env python3
"""
Security smoke tests for a demo web app/API.

Usage:
  python3 security_smoke_test.py --base-url http://localhost:3000
  python3 security_smoke_test.py --base-url http://localhost:8000 --protected-path /api/me --login-path /api/auth/login

This script is intentionally non-destructive:
- no heavy load,
- no data deletion,
- only lightweight probes.
"""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple


TIMEOUT = 8


@dataclass
class CheckResult:
    name: str
    status: str  # PASS / WARN / FAIL / SKIP
    detail: str


def normalize_base_url(url: str) -> str:
    return url.rstrip("/")


def make_url(base_url: str, path: str) -> str:
    if path.startswith("http://") or path.startswith("https://"):
        return path
    if not path.startswith("/"):
        path = "/" + path
    return base_url + path


def request_url(
    url: str,
    method: str = "GET",
    headers: Optional[Dict[str, str]] = None,
    payload: Optional[bytes] = None,
) -> Tuple[Optional[int], Dict[str, str], str, Optional[str]]:
    req = urllib.request.Request(url=url, method=method, data=payload)
    for k, v in (headers or {}).items():
        req.add_header(k, v)

    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            body = resp.read(8000).decode("utf-8", errors="replace")
            hdrs = {k.lower(): v for k, v in resp.headers.items()}
            return resp.getcode(), hdrs, body, None
    except urllib.error.HTTPError as e:
        body = e.read(8000).decode("utf-8", errors="replace")
        hdrs = {k.lower(): v for k, v in e.headers.items()} if e.headers else {}
        return e.code, hdrs, body, None
    except ssl.SSLError as e:
        return None, {}, "", f"SSL error: {e}"
    except urllib.error.URLError as e:
        return None, {}, "", f"Network error: {e.reason}"
    except Exception as e:  # noqa: BLE001
        return None, {}, "", f"Unexpected error: {e}"


def check_https(base_url: str) -> CheckResult:
    if base_url.startswith("https://"):
        return CheckResult("Transport (HTTPS)", "PASS", "HTTPS enabled.")
    return CheckResult(
        "Transport (HTTPS)",
        "WARN",
        "Base URL is not HTTPS. Acceptable in local demo, not production.",
    )


def check_security_headers(base_url: str) -> CheckResult:
    status, headers, _body, err = request_url(base_url, method="GET")
    if err:
        return CheckResult("Security headers", "SKIP", f"Could not reach app: {err}")

    missing: List[str] = []
    wanted = [
        "content-security-policy",
        "x-content-type-options",
        "x-frame-options",
        "referrer-policy",
    ]
    if base_url.startswith("https://"):
        wanted.append("strict-transport-security")

    for h in wanted:
        if h not in headers:
            missing.append(h)

    if status is None:
        return CheckResult("Security headers", "SKIP", "No HTTP response.")
    if missing:
        return CheckResult(
            "Security headers",
            "WARN",
            f"Missing headers: {', '.join(missing)}",
        )
    return CheckResult("Security headers", "PASS", "Core security headers detected.")


def check_cors(base_url: str) -> CheckResult:
    evil = "https://evil.example.com"
    status, headers, _body, err = request_url(
        base_url,
        method="OPTIONS",
        headers={
            "Origin": evil,
            "Access-Control-Request-Method": "GET",
        },
    )
    if err:
        return CheckResult("CORS policy", "SKIP", f"Probe skipped: {err}")

    acao = headers.get("access-control-allow-origin", "")
    acc = headers.get("access-control-allow-credentials", "").lower()

    if acao == "*":
        return CheckResult("CORS policy", "FAIL", "CORS allows any origin (*).")
    if acao == evil and acc == "true":
        return CheckResult(
            "CORS policy",
            "FAIL",
            "Reflects arbitrary origin with credentials=true.",
        )
    if status in (200, 204, 405):
        return CheckResult("CORS policy", "PASS", "No dangerous CORS pattern detected.")
    return CheckResult("CORS policy", "WARN", f"Unexpected OPTIONS status: {status}")


def check_auth_guard(base_url: str, protected_path: str) -> CheckResult:
    url = make_url(base_url, protected_path)
    status, _headers, _body, err = request_url(url, method="GET")
    if err:
        return CheckResult("Auth protection", "SKIP", f"{protected_path}: {err}")
    if status in (401, 403):
        return CheckResult(
            "Auth protection",
            "PASS",
            f"{protected_path} correctly blocked without token ({status}).",
        )
    if status == 404:
        return CheckResult(
            "Auth protection",
            "SKIP",
            f"{protected_path} not found. Set --protected-path to your private endpoint.",
        )
    if status and 200 <= status < 300:
        return CheckResult(
            "Auth protection",
            "FAIL",
            f"{protected_path} is accessible without auth ({status}).",
        )
    return CheckResult("Auth protection", "WARN", f"{protected_path} returned {status}.")


def check_common_exposures(base_url: str) -> CheckResult:
    sensitive_paths = [
        "/.env",
        "/admin",
        "/api/admin",
        "/debug",
        "/actuator",
        "/openapi.json",
        "/docs",
    ]
    exposed: List[str] = []
    for p in sensitive_paths:
        status, _headers, _body, err = request_url(make_url(base_url, p))
        if err:
            continue
        if status == 200 and p in {"/.env", "/debug", "/api/admin", "/admin", "/actuator"}:
            exposed.append(f"{p} ({status})")

    if exposed:
        return CheckResult(
            "Sensitive endpoints",
            "FAIL",
            "Potentially exposed: " + ", ".join(exposed),
        )
    return CheckResult(
        "Sensitive endpoints",
        "PASS",
        "No obvious sensitive endpoint exposure found.",
    )


def check_basic_injection(base_url: str, probe_path: str) -> CheckResult:
    base_probe = make_url(base_url, probe_path)
    payloads = [
        "' OR '1'='1",
        "<script>alert(1)</script>",
        "../../../../etc/passwd",
    ]
    warnings: List[str] = []

    for p in payloads:
        q = urllib.parse.urlencode({"q": p})
        url = f"{base_probe}?{q}"
        status, _headers, body, err = request_url(url, method="GET")
        if err:
            return CheckResult(
                "Injection/XSS smoke",
                "SKIP",
                f"{probe_path} unreachable: {err}",
            )
        if status == 404:
            return CheckResult(
                "Injection/XSS smoke",
                "SKIP",
                f"{probe_path} not found. Set --probe-path to a searchable endpoint.",
            )
        if status and status >= 500:
            warnings.append(f"500 on payload: {p}")
        if "<script>alert(1)</script>" in body:
            warnings.append("reflected raw script payload in response body")

    if warnings:
        return CheckResult("Injection/XSS smoke", "WARN", "; ".join(warnings))
    return CheckResult(
        "Injection/XSS smoke",
        "PASS",
        "No obvious crash/reflection on basic payloads.",
    )


def check_rate_limit(base_url: str, login_path: str, attempts: int) -> CheckResult:
    login_url = make_url(base_url, login_path)
    got_429 = False
    non_404_seen = False

    for _ in range(attempts):
        data = json.dumps(
            {"email": "attacker@example.com", "password": "wrong-password"}
        ).encode("utf-8")
        status, _headers, _body, err = request_url(
            login_url,
            method="POST",
            headers={"Content-Type": "application/json"},
            payload=data,
        )
        if err:
            return CheckResult("Rate limiting", "SKIP", f"{login_path}: {err}")
        if status == 404:
            continue
        non_404_seen = True
        if status == 429:
            got_429 = True
            break

    if not non_404_seen:
        return CheckResult(
            "Rate limiting",
            "SKIP",
            f"{login_path} not found. Set --login-path to your auth endpoint.",
        )
    if got_429:
        return CheckResult("Rate limiting", "PASS", "429 detected after repeated attempts.")
    return CheckResult(
        "Rate limiting",
        "WARN",
        f"No 429 after {attempts} failed attempts. Add throttling/bruteforce protection.",
    )


def print_results(results: List[CheckResult]) -> int:
    score = {"PASS": 0, "WARN": 0, "FAIL": 0, "SKIP": 0}
    for r in results:
        score[r.status] = score.get(r.status, 0) + 1
        print(f"[{r.status:<4}] {r.name}: {r.detail}")

    print("\n--- Summary ---")
    print(
        f"PASS={score['PASS']} WARN={score['WARN']} FAIL={score['FAIL']} SKIP={score['SKIP']}"
    )
    if score["FAIL"] > 0:
        return 2
    if score["WARN"] > 0:
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Quick non-destructive security smoke tests."
    )
    parser.add_argument("--base-url", required=True, help="Example: http://localhost:3000")
    parser.add_argument(
        "--protected-path",
        default="/api/me",
        help="A protected endpoint that should require auth (default: /api/me)",
    )
    parser.add_argument(
        "--login-path",
        default="/api/auth/login",
        help="Login endpoint for rate-limit probe (default: /api/auth/login)",
    )
    parser.add_argument(
        "--probe-path",
        default="/api/search",
        help="GET endpoint that accepts query param q (default: /api/search)",
    )
    parser.add_argument(
        "--rate-attempts",
        type=int,
        default=12,
        help="Number of failed login attempts for rate-limit test (default: 12)",
    )
    args = parser.parse_args()

    base_url = normalize_base_url(args.base_url)

    print(f"Running security smoke tests against: {base_url}\n")
    results = [
        check_https(base_url),
        check_security_headers(base_url),
        check_cors(base_url),
        check_auth_guard(base_url, args.protected_path),
        check_common_exposures(base_url),
        check_basic_injection(base_url, args.probe_path),
        check_rate_limit(base_url, args.login_path, args.rate_attempts),
    ]

    exit_code = print_results(results)
    if exit_code == 0:
        print("\nResult: GOOD baseline for demo.")
    elif exit_code == 1:
        print("\nResult: Acceptable for demo with caveats (warnings).")
    else:
        print("\nResult: Critical issues detected (failures).")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
