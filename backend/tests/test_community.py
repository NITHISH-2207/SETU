from app.models.ai_analysis import AIAnalysis


def test_community_support_and_uniqueness(client, create_test_citizen):
    citizen1 = create_test_citizen(name="Supporter 1")
    citizen2 = create_test_citizen(name="Supporter 2")

    # Create report
    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Community Park Maintenance", "description": "Playground equipment broken and grass overgrown."},
        headers=citizen1["headers"],
    )
    report_id = res.json()["id"]

    # Citizen 1 supports
    sup1 = client.post(f"/api/v1/citizen/reports/{report_id}/support", headers=citizen1["headers"])
    assert sup1.status_code == 200
    assert sup1.json()["supported"] is True
    assert sup1.json()["total_supports"] == 1

    # Citizen 1 supports again (duplicate check - idempotent, no duplication)
    sup1_repeat = client.post(f"/api/v1/citizen/reports/{report_id}/support", headers=citizen1["headers"])
    assert sup1_repeat.status_code == 200
    assert sup1_repeat.json()["total_supports"] == 1

    # Citizen 2 supports
    sup2 = client.post(f"/api/v1/citizen/reports/{report_id}/support", headers=citizen2["headers"])
    assert sup2.status_code == 200
    assert sup2.json()["total_supports"] == 2

    # Citizen 1 removes support
    unsup1 = client.delete(f"/api/v1/citizen/reports/{report_id}/support", headers=citizen1["headers"])
    assert unsup1.status_code == 200
    assert unsup1.json()["supported"] is False
    assert unsup1.json()["total_supports"] == 1


def test_community_support_independent_from_severity(client, create_test_citizen, db):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Overgrown hedge blocking sidewalk", "description": "Routine vegetation pruning needed along pedestrian path."},
        headers=headers,
    )
    report_id = res.json()["id"]

    ai_before = db.query(AIAnalysis).filter(AIAnalysis.report_id == report_id).first()
    severity_before = ai_before.severity_score

    # Add community supports
    for i in range(5):
        other = create_test_citizen(name=f"Voter {i}")
        client.post(f"/api/v1/citizen/reports/{report_id}/support", headers=other["headers"])

    # Verify severity score did not change
    db.refresh(ai_before)
    assert ai_before.severity_score == severity_before
