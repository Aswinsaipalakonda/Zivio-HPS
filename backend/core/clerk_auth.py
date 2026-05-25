import time
import requests
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

# In-memory cache for JWKS
_jwks_cache = {
    "keys": None,
    "expires_at": 0
}

def get_jwks():
    global _jwks_cache
    now = time.time()
    
    # Cache JWKS for 1 hour (3600 seconds)
    if _jwks_cache["keys"] is None or now >= _jwks_cache["expires_at"]:
        jwks_url = getattr(settings, "CLERK_JWKS_URL", None)
        if not jwks_url:
            raise AuthenticationFailed("CLERK_JWKS_URL is not configured in Django settings.")
        
        try:
            response = requests.get(jwks_url, timeout=10)
            response.raise_for_status()
            _jwks_cache["keys"] = response.json().get("keys", [])
            _jwks_cache["expires_at"] = now + 3600
        except Exception as e:
            # If the fetch fails, raise authentication error
            raise AuthenticationFailed(f"Failed to fetch Clerk JWKS from URL: {e}")
            
    return _jwks_cache["keys"]

def verify_clerk_token(token: str) -> dict:
    if token.startswith("Bearer "):
        token = token[7:]
        
    keys = get_jwks()
    
    try:
        # Get the unverified header to locate the kid (key id)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
    except Exception as e:
        raise AuthenticationFailed(f"Invalid token format: {e}")
        
    # Find matching key in JWKS
    jwk_key = None
    for key in keys:
        if key.get("kid") == kid:
            jwk_key = key
            break
            
    if not jwk_key:
        raise AuthenticationFailed("No matching key found in Clerk JWKS.")
        
    try:
        # Convert JWK to PEM format using PyJWT public key loader
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwk_key)
        
        # Decode and verify token
        # We don't verify audience (aud) unless explicitly required
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired.")
    except jwt.InvalidTokenError as e:
        raise AuthenticationFailed(f"Invalid token verification: {e}")

class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
            
        if not auth_header.startswith("Bearer "):
            return None
            
        # Verify Clerk token
        payload = verify_clerk_token(auth_header)
        
        clerk_user_id = payload.get("sub")
        email = payload.get("email")
        
        if not email:
            email = request.headers.get("X-User-Email")
        
        if not clerk_user_id:
            raise AuthenticationFailed("Clerk user ID (sub claim) is missing in token.")
            
        user = None
        
        # 1. Lookup by clerk_user_id
        try:
            user = User.objects.get(clerk_user_id=clerk_user_id)
        except User.DoesNotExist:
            pass
            
        # 2. If not found, lookup by email and update clerk_user_id
        if not user and email:
            try:
                user = User.objects.get(email=email)
                user.clerk_user_id = clerk_user_id
                user.save(update_fields=["clerk_user_id"])
            except User.DoesNotExist:
                pass
                
        # 3. If user is still not found at all, raise strict authentication error
        if not user:
            raise AuthenticationFailed("User not registered in the system")
            
        # 4. Check if active
        if not user.is_active:
            raise AuthenticationFailed("User account is inactive.")
            
        return (user, payload)
