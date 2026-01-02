from fastapi import APIRouter
from app.infrastructure.redis_client import redis_client, get_json, set_json
from app.services.polling_service import get_raw_live_matches, get_raw_live_match
from app.services.normalizers.match_normalizer import normalize_live_match
from app.services.normalizers.detail_normalizer import normalize_match_detail
from app.domain.models import LiveMatch
from app.infrastructure.external_api import sportmonks_api

router = APIRouter(prefix="/api/v1/matches")

# =========================
# STATIC ROUTES (FIRST)
# =========================

@router.get("/live")
async def get_live_matches():
    ids = redis_client.get("live:matches")

    if not ids:
        return {"data": []}  # valid empty state

    result = []
    for match_id in ids.split(","):
        match = get_json(f"live:match:{match_id}")
        if match:
            result.append(match)

    return {"data": result}


@router.get("/live/raw")
async def raw_live_matches():
    return await get_raw_live_matches()


@router.get("/debug/fixtures-raw")
async def debug_fixtures():
    """Temporary route to inspect raw SportMonks fixture data"""
    return await sportmonks_api.fetch_fixtures_raw()


# =========================
# DYNAMIC ROUTES (AFTER)
# =========================

@router.get("/{match_id}/raw")
async def debug_matches(match_id: str):
    """Temporary route to inspect raw SportMonks fixture data"""
    return await sportmonks_api.fetch_match_details_rich(match_id=match_id)


@router.get("/{match_id}/live", response_model=LiveMatch)
async def get_live_match(match_id: int):
    raw = await get_raw_live_match(match_id)
    return normalize_live_match(raw)


@router.get("/{match_id}")
async def get_match_detail(match_id: str):
    # Try cache
    cache_key = f"match:detail:{match_id}"
    cached = get_json(cache_key)
    if cached:
        return cached

    # Fetch fresh from provider
    raw = await sportmonks_api.fetch_match_details_rich(match_id)

    # Normalize
    normalized = normalize_match_detail(raw)
    response_data = normalized.dict()

    # Cache with TTL based on live status
    is_live = raw.get("data", {}).get("live", False)
    ttl = 60 if is_live else 86400
    set_json(cache_key, response_data, ttl=ttl)

    return response_data
