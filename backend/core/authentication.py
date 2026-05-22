from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Skip CSRF enforcement on API endpoints.

    Safe because:
    - All requests come through Vite proxy (dev) or Vercel rewrites (prod)
    - Browser sees same-origin requests — CSRF isn't an attack vector here
    - This is a private internal tool, not a public API
    """
    def enforce_csrf(self, request):
        pass
