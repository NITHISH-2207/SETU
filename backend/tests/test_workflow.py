from app.models.report_workflow import ReportStatusHistory, ReportHistory, Resolution, Appeal
from app.models.report import Report


def test_status_history_and_audit_trail(client, create_test_citizen, create_test_government, db):
    citizen = create_test_citizen()
    govt = create_test_government()

    # Citizen submits report
    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Major sewer overflow on Main Street",
            "description": "Sewer pipeline burst spilling wastewater across residential street.",
            "category": "Sanitation",
        },
        headers=citizen["headers"],
    )
    report_id = res.json()["id"]

    # Government updates status to GOVERNMENT_REVIEW
    patch_res = client.patch(
        f"/api/v1/government/reports/{report_id}/status",
        json={"new_status": "GOVERNMENT_REVIEW", "comment": "Assigned to junior engineer for on-site inspection"},
        headers=govt["headers"],
    )
    assert patch_res.status_code == 200

    # Verify status history
    histories = (
        db.query(ReportStatusHistory)
        .filter(ReportStatusHistory.report_id == report_id)
        .order_by(ReportStatusHistory.created_at.asc())
        .all()
    )
    assert len(histories) >= 2
    assert histories[0].new_status == "SUBMITTED"
    assert histories[1].new_status == "GOVERNMENT_REVIEW"
    assert histories[1].comment == "Assigned to junior engineer for on-site inspection"
    assert histories[1].actor_type == "GOVERNMENT"

    # Verify audit history
    audits = (
        db.query(ReportHistory)
        .filter(ReportHistory.report_id == report_id)
        .all()
    )
    assert len(audits) >= 1
    assert audits[0].action == "STATUS_TRANSITION"


def test_resolution_and_citizen_acceptance(client, create_test_citizen, create_test_government, db):
    citizen = create_test_citizen()
    govt = create_test_government()

    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Broken water valve flooding avenue",
            "description": "Pressure valve cracked on municipal distribution line.",
            "category": "Water",
        },
        headers=citizen["headers"],
    )
    report_id = res.json()["id"]

    # Government resolves report
    res_sol = client.post(
        f"/api/v1/government/reports/{report_id}/resolve",
        json={
            "solution_details": "Replacement valve installed by municipal field maintenance crew and pressure tested.",
            "evidence": {"photos": ["valve_fixed.jpg"]},
        },
        headers=govt["headers"],
    )
    assert res_sol.status_code == 200
    assert res_sol.json()["resolution_status"] == "PROPOSED"

    # Report is now marked RESOLVED
    report_db = db.query(Report).filter(Report.id == report_id).first()
    assert report_db.status == "RESOLVED"

    # Citizen accepts resolution
    accept_res = client.post(
        f"/api/v1/citizen/reports/{report_id}/resolve/accept",
        headers=citizen["headers"],
    )
    assert accept_res.status_code == 200
    assert accept_res.json()["resolution_status"] == "ACCEPTED"

    # Report status is now ACCEPTED
    db.refresh(report_db)
    assert report_db.status == "ACCEPTED"


def test_citizen_appeal_workflow(client, create_test_citizen, create_test_government, db):
    citizen = create_test_citizen()
    govt = create_test_government()

    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Unrepaired deep trench in road",
            "description": "Excavation for optic cable left open without barricades.",
            "category": "Roads",
        },
        headers=citizen["headers"],
    )
    report_id = res.json()["id"]

    # Government resolves prematurely
    client.post(
        f"/api/v1/government/reports/{report_id}/resolve",
        json={"solution_details": "Contractor notified to fill trench."},
        headers=govt["headers"],
    )

    # Citizen appeals
    appeal_res = client.post(
        f"/api/v1/citizen/reports/{report_id}/appeal",
        json={
            "reason": "Trench is still completely open and hazard remains",
            "message": "Visited the site today; no filling work was done and warning cones are missing.",
        },
        headers=citizen["headers"],
    )
    assert appeal_res.status_code == 201
    assert appeal_res.json()["status"] == "SUBMITTED"

    # Report is now in APPEALED status
    report_db = db.query(Report).filter(Report.id == report_id).first()
    db.refresh(report_db)
    assert report_db.status == "APPEALED"


def test_reject_appeal_for_another_citizen_report(client, create_test_citizen):
    citizen_a = create_test_citizen(name="Citizen One")
    citizen_b = create_test_citizen(name="Citizen Two")

    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Report for citizen A", "description": "Problem submitted by citizen A."},
        headers=citizen_a["headers"],
    )
    report_id = res.json()["id"]

    # Citizen B tries to appeal Citizen A's report
    bad_appeal = client.post(
        f"/api/v1/citizen/reports/{report_id}/appeal",
        json={"reason": "Invalid appeal", "message": "Attempting unauthorized appeal."},
        headers=citizen_b["headers"],
    )
    assert bad_appeal.status_code == 400
