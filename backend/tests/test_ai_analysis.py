from app.models.ai_analysis import AIAnalysis
from app.models.report import Report


def test_ai_analysis_preserves_original_report(client, create_test_citizen, db):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    orig_title = "Original citizen title about arsenic pollution"
    orig_desc = "Arsenic pollution in community drinking water aquifer causing skin lesions."
    orig_loc = "Borewell 3, Sector 9"

    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": orig_title,
            "description": orig_desc,
            "category": "Water",
            "location": orig_loc,
        },
        headers=headers,
    )
    assert res.status_code == 201
    report_id = res.json()["id"]

    # Verify original report is pristine
    rep_db = db.query(Report).filter(Report.id == report_id).first()
    assert rep_db.title == orig_title
    assert rep_db.description == orig_desc
    assert rep_db.location == orig_loc

    # Verify separate AIAnalysis record exists
    ai_record = db.query(AIAnalysis).filter(AIAnalysis.report_id == report_id).first()
    assert ai_record is not None
    assert ai_record.severity_score > 0
    assert ai_record.research_classification in ["RESEARCH_NEEDED", "RESEARCH_NOT_NEEDED"]
    assert isinstance(ai_record.severity_factors, dict)


def test_research_classification_distinction(client, create_test_citizen, db):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    # 1. Routine municipal issue: broken streetlight
    res_routine = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Broken streetlight on 5th cross",
            "description": "The streetlight bulb is fused and not working since 3 days on 5th cross road.",
            "category": "Streetlight",
        },
        headers=headers,
    )
    routine_id = res_routine.json()["id"]
    ai_routine = db.query(AIAnalysis).filter(AIAnalysis.report_id == routine_id).first()
    assert ai_routine.research_classification == "RESEARCH_NOT_NEEDED"

    # 2. Complex research/innovation issue: arsenic groundwater contamination
    res_complex = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Groundwater arsenic contamination and chemical filtration challenge",
            "description": "Groundwater has high arsenic and toxic chemical pollutants requiring novel low-cost membrane filtration and purification technology.",
            "category": "Water Management",
        },
        headers=headers,
    )
    complex_id = res_complex.json()["id"]
    ai_complex = db.query(AIAnalysis).filter(AIAnalysis.report_id == complex_id).first()
    assert ai_complex.research_classification == "RESEARCH_NEEDED"


def test_high_severity_calculation(client, create_test_citizen, db):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Exposed high voltage wire sparking fire near hospital",
            "description": "Danger of electrocution, fire explosion, fatal hazard affecting patients and children in ward.",
            "category": "Disaster & Emergency",
        },
        headers=headers,
    )
    report_id = res.json()["id"]
    ai_record = db.query(AIAnalysis).filter(AIAnalysis.report_id == report_id).first()

    assert ai_record.severity_score >= 60.0
    assert ai_record.severity_factors["life_and_safety_risk"] > 5.0
    assert ai_record.severity_factors["urgency_time_sensitivity"] >= 5.0


def test_duplicate_detection(client, create_test_citizen, db):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    # First report at location
    res1 = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Toxic chemical foam in Bellandur lake",
            "description": "Toxic industrial effluent foam and chemical pollution overflowing on lake bridge.",
            "category": "Environment",
            "latitude": 12.9352,
            "longitude": 77.6772,
        },
        headers=headers,
    )
    rep1_id = res1.json()["id"]

    # Second report at nearby location (approx 100 meters away) with similar keywords
    res2 = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Chemical foam and pollution on Bellandur lake",
            "description": "Heavy toxic chemical effluent foam overflowing from lake onto road.",
            "category": "Environment",
            "latitude": 12.9355,
            "longitude": 77.6775,
        },
        headers=headers,
    )
    rep2_id = res2.json()["id"]

    ai_dup = db.query(AIAnalysis).filter(AIAnalysis.report_id == rep2_id).first()
    assert ai_dup.duplicate_detected is True
    assert rep1_id in ai_dup.duplicate_report_ids
    assert ai_dup.verification_required is True
