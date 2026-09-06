from datetime import datetime, timezone
import math
import re
from sqlalchemy.orm import Session

from app.models.ai_analysis import AIAnalysis
from app.models.report import Report


# Keywords associated with systemic, technical, or research-demanding challenges
RESEARCH_KEYWORDS = {
    "contamination", "arsenic", "pollutants", "toxic", "purification", "effluent",
    "filtration", "renewable", "solar", "biogas", "microgrid", "sensor",
    "algorithm", "epidemic", "outbreak", "pathogen", "soil degradation", "salinity",
    "crop disease", "pesticide residue", "water table depletion", "groundwater",
    "waste recycling", "composting innovation", "structural failure", "seismic",
    "erosion", "afforestation", "air quality index", "particulate matter",
}

# Routine municipal problems that standard local administration can handle directly
ROUTINE_MUNICIPAL_KEYWORDS = {
    "pothole", "streetlight", "street light", "garbage", "trash", "broken pipe",
    "water leak", "drain blockage", "hanging wire", "loose wire", "manhole cover",
    "illegal parking", "stray dogs", "road sweeping", "debris", "graffiti",
    "speed breaker", "water tanker", "meter repair",
}

HIGH_SEVERITY_KEYWORDS = {
    "life", "death", "casualty", "injury", "explosion", "fire", "electrocution",
    "hazard", "poison", "hospital", "flood", "collapse", "emergency", "danger",
    "toxic", "epidemic", "fatal", "gas leak", "arsenic",
}

MODERATE_SEVERITY_KEYWORDS = {
    "damage", "illness", "contamination", "overflow", "stagnant", "smell", "foul",
    "blockage", "disruption", "shortage", "cracked", "outage", "mosquito",
}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in meters between two lat/lon coordinates."""
    r = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


def tokenize(text: str) -> set[str]:
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    stop_words = {
        "the", "and", "for", "with", "this", "that", "from", "have", "been",
        "near", "area", "please", "help", "there", "road", "street",
    }
    return {w for w in words if w not in stop_words}


def calculate_severity(
    title: str,
    description: str,
    category: str | None,
) -> tuple[float, dict, float, float]:
    """Calculate 0-100 severity score across comprehensive factors."""
    combined_text = f"{title} {description} {category or ''}".lower()
    words = tokenize(combined_text)

    # Individual factor scores (0 - 10)
    life_safety = 0.0
    health_risk = 0.0
    urgency = 2.0
    infrastructure_impact = 1.0
    environmental_impact = 0.0
    escalation_risk = 1.0
    affected_population = 3.0

    # Life & safety risk
    high_matches = words.intersection(HIGH_SEVERITY_KEYWORDS)
    if high_matches:
        life_safety = min(10.0, len(high_matches) * 3.5)
        urgency += 4.0
        escalation_risk += 3.0

    # Health risk
    mod_matches = words.intersection(MODERATE_SEVERITY_KEYWORDS)
    if mod_matches:
        health_risk = min(10.0, len(mod_matches) * 2.5)
        urgency += 2.0
        escalation_risk += 1.5

    # Category heuristics
    cat_lower = (category or "").lower()
    if any(k in cat_lower for k in ["health", "safety", "disaster", "emergency", "electricity"]):
        life_safety = max(life_safety, 6.0)
        urgency = max(urgency, 6.0)
    elif any(k in cat_lower for k in ["water", "environment", "sanitation"]):
        health_risk = max(health_risk, 5.0)
        environmental_impact = max(environmental_impact, 6.0)
    elif any(k in cat_lower for k in ["road", "transport", "infrastructure"]):
        infrastructure_impact = max(infrastructure_impact, 5.0)

    # Population estimate based on keywords
    if any(k in combined_text for k in ["village", "colony", "ward", "hundreds", "thousands", "entire", "all residents"]):
        affected_population = 8.0
        escalation_risk += 2.0

    factors = {
        "life_and_safety_risk": round(life_safety, 1),
        "health_risk": round(health_risk, 1),
        "urgency_time_sensitivity": round(min(10.0, urgency), 1),
        "infrastructure_impact": round(min(10.0, infrastructure_impact), 1),
        "environmental_impact": round(min(10.0, environmental_impact), 1),
        "escalation_risk": round(min(10.0, escalation_risk), 1),
        "affected_population": round(min(10.0, affected_population), 1),
        "vulnerable_population": round(3.0 if "children" in combined_text or "elderly" in combined_text or "school" in combined_text or "hospital" in combined_text else 1.0, 1),
        "economic_impact": 2.0,
        "location_criticality": 3.0,
        "recurrence_pattern": 2.0,
        "evidence_strength": 5.0,
    }

    # Weighted aggregate score (0 - 100) reflecting all critical societal risk factors
    raw_score = (
        factors["life_and_safety_risk"] * 4.0
        + factors["health_risk"] * 2.5
        + factors["urgency_time_sensitivity"] * 2.0
        + factors["vulnerable_population"] * 1.5
        + factors["escalation_risk"] * 1.5
        + factors["location_criticality"] * 1.5
        + factors["infrastructure_impact"] * 1.0
        + factors["environmental_impact"] * 1.0
        + factors["affected_population"] * 0.8
        + factors["economic_impact"] * 0.5
    )
    severity_score = min(100.0, max(5.0, raw_score))
    urgency_score = min(10.0, max(1.0, urgency))
    confidence_score = 85.0 if len(description) > 50 else 60.0

    return round(severity_score, 1), factors, round(urgency_score, 1), round(confidence_score, 1)


def classify_research(
    title: str,
    description: str,
    category: str | None,
) -> tuple[str, float]:
    """Classify if problem needs university/research innovation vs routine municipal resolution."""
    combined_text = f"{title} {description} {category or ''}".lower()
    words = tokenize(combined_text)

    research_hits = words.intersection(RESEARCH_KEYWORDS)
    routine_hits = words.intersection(ROUTINE_MUNICIPAL_KEYWORDS)

    if research_hits and not routine_hits:
        return "RESEARCH_NEEDED", 88.0
    elif routine_hits and not research_hits:
        return "RESEARCH_NOT_NEEDED", 92.0
    elif len(research_hits) > len(routine_hits):
        return "RESEARCH_NEEDED", 75.0
    elif len(description) > 200 and any(k in combined_text for k in ["innovation", "study", "redesign", "investigation", "cause unknown", "repeatedly failing"]):
        return "RESEARCH_NEEDED", 70.0
    else:
        return "RESEARCH_NOT_NEEDED", 80.0


def detect_duplicates(
    db: Session,
    current_report_id: int,
    title: str,
    description: str,
    category: str | None,
    latitude: float | None,
    longitude: float | None,
) -> tuple[bool, list[int], bool]:
    """Find nearby or similar reports in database."""
    query = db.query(Report).filter(Report.id != current_report_id)
    if category:
        query = query.filter(Report.category == category)

    potential_matches = query.order_by(Report.created_at.desc()).limit(50).all()
    current_tokens = tokenize(f"{title} {description}")

    duplicate_ids: list[int] = []
    verification_required = False

    for other in potential_matches:
        is_geo_near = False
        if latitude is not None and longitude is not None and other.latitude is not None and other.longitude is not None:
            dist = haversine_distance(latitude, longitude, other.latitude, other.longitude)
            if dist <= 500:  # within 500 meters
                is_geo_near = True

        other_tokens = tokenize(f"{other.title} {other.description}")
        if not current_tokens or not other_tokens:
            continue

        overlap = len(current_tokens.intersection(other_tokens))
        union = len(current_tokens.union(other_tokens))
        jaccard = overlap / union if union > 0 else 0.0

        if is_geo_near and jaccard >= 0.25:
            duplicate_ids.append(other.id)
            verification_required = True
        elif jaccard >= 0.45:
            duplicate_ids.append(other.id)
            verification_required = True

    return bool(duplicate_ids), duplicate_ids, verification_required


def analyze_report(db: Session, report: Report) -> AIAnalysis:
    """Run prototype AI analysis without modifying the original citizen report."""
    severity_score, factors, urgency_score, confidence_score = calculate_severity(
        title=report.title,
        description=report.description,
        category=report.category,
    )

    research_class, research_conf = classify_research(
        title=report.title,
        description=report.description,
        category=report.category,
    )

    is_dup, dup_ids, verif_req = detect_duplicates(
        db=db,
        current_report_id=report.id,
        title=report.title,
        description=report.description,
        category=report.category,
        latitude=report.latitude,
        longitude=report.longitude,
    )

    analysis = AIAnalysis(
        report_id=report.id,
        title_generated=f"Analysis: {report.title}",
        category_predicted=report.category or "General Public Infrastructure",
        category_confidence=85.0,
        severity_score=severity_score,
        severity_factors=factors,
        urgency_score=urgency_score,
        confidence_score=confidence_score,
        duplicate_detected=is_dup,
        duplicate_report_ids=dup_ids,
        research_classification=research_class,
        research_confidence=research_conf,
        location_interpretation=report.location or "Location reported by citizen",
        verification_required=verif_req or (severity_score >= 80.0),
        model_version="v1-rule-engine",
        created_at=datetime.now(timezone.utc),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis
