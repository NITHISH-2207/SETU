def test_government_profile(client, create_test_government):
    govt = create_test_government()
    res = client.get("/api/v1/government/profile", headers=govt["headers"])
    assert res.status_code == 200
    data = res.json()
    assert data["designation"] == "Executive Engineer"
    assert data["organization_name"] is not None
    assert data["department_name"] == "Water Supply & Sanitation"


def test_government_role_forbidden_for_citizen(client, create_test_citizen):
    citizen = create_test_citizen()
    res = client.get("/api/v1/government/profile", headers=citizen["headers"])
    assert res.status_code == 403


def test_government_view_and_update_reports(client, create_test_citizen, create_test_government):
    citizen = create_test_citizen()
    govt = create_test_government()

    # Citizen submits report in Pune
    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Water supply outage in Pune Ward 4",
            "description": "No drinking water supply for 48 hours due to main pump failure.",
            "category": "Water Supply",
            "location": "Pune Ward 4 near water tank",
        },
        headers=citizen["headers"],
    )
    report_id = res.json()["id"]

    # Government lists reports
    list_res = client.get("/api/v1/government/reports", headers=govt["headers"])
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # Government views full detail including AI analysis
    detail_res = client.get(f"/api/v1/government/reports/{report_id}", headers=govt["headers"])
    assert detail_res.status_code == 200
    assert detail_res.json()["ai_analysis"] is not None

    # Government adds official remark
    remark_res = client.post(
        f"/api/v1/government/reports/{report_id}/update",
        json={"remark": "Replacement pump ordered; crew dispatched for emergency line hookup."},
        headers=govt["headers"],
    )
    assert remark_res.status_code == 200

    # Government proposes resolution
    resolve_res = client.post(
        f"/api/v1/government/reports/{report_id}/resolve",
        json={"solution_details": "Auxiliary pump installed and water distribution restored to normal pressure."},
        headers=govt["headers"],
    )
    assert resolve_res.status_code == 200
    assert resolve_res.json()["resolution_status"] == "PROPOSED"
