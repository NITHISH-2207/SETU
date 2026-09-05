def test_csr_profile(client, create_test_csr):
    csr = create_test_csr()
    res = client.get("/api/v1/csr/profile", headers=csr["headers"])
    assert res.status_code == 200
    data = res.json()
    assert "Water" in data["focus_areas"]
    assert data["company_name"] is not None


def test_csr_problem_matching_and_interest(client, create_test_citizen, create_test_csr):
    citizen = create_test_citizen()
    csr = create_test_csr()

    # Citizen submits report in CSR focus area (Water / Rural Development)
    rep_res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Rural community clean drinking water initiative",
            "description": "Rural water supply contamination in Maharashtra village requiring community water treatment plants.",
            "category": "Water",
            "location": "Maharashtra",
        },
        headers=citizen["headers"],
    )
    report_id = rep_res.json()["id"]

    # CSR discovers recommended problems
    rec_res = client.get("/api/v1/csr/recommended", headers=csr["headers"])
    assert rec_res.status_code == 200
    matches = rec_res.json()
    assert any(m["report_id"] == report_id for m in matches)

    # CSR expresses interest
    interest_res = client.post(
        f"/api/v1/csr/problems/{report_id}/interest",
        json={"comment": "We have earmarked Rs 10 Lakhs under our rural water sustainability program."},
        headers=csr["headers"],
    )
    assert interest_res.status_code == 200
    assert interest_res.json()["status"] == "INTERESTED"


def test_csr_funding_project_allocation(client, create_test_citizen, create_test_university, create_test_csr):
    citizen = create_test_citizen()
    uni = create_test_university()
    csr = create_test_csr()

    # Report
    rep_res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Solar desalination pilot", "description": "High salinity water purification using solar thermal prototype."},
        headers=citizen["headers"],
    )
    report_id = rep_res.json()["id"]

    # University starts project
    proj_res = client.post(
        "/api/v1/projects",
        json={
            "report_id": report_id,
            "title": "Solar Desalination Implementation",
            "description": "Constructing and testing 500L/day solar desalination unit in target village.",
        },
        headers=uni["mentor_headers"],
    )
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # CSR funds project
    fund_res = client.post(
        f"/api/v1/csr/projects/{project_id}/funding",
        json={
            "amount": 500000.0,
            "currency": "INR",
            "terms": "Milestone-based disbursement for hardware and field testing.",
        },
        headers=csr["headers"],
    )
    assert fund_res.status_code == 200
    assert fund_res.json()["status"] == "COMMITTED"

    # List CSR funded projects
    list_res = client.get("/api/v1/csr/projects", headers=csr["headers"])
    assert list_res.status_code == 200
    assert any(p["id"] == project_id for p in list_res.json())

    # Check funding summary
    summary_res = client.get("/api/v1/csr/funding", headers=csr["headers"])
    assert summary_res.status_code == 200
    assert summary_res.json()["total_projects_supported"] >= 1
