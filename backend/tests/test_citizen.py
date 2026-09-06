def test_create_report_success(client, create_test_citizen):
    citizen_ctx = create_test_citizen()
    headers = citizen_ctx["headers"]

    payload = {
        "title": "Severe drinking water arsenic contamination",
        "description": "High arsenic levels detected in the local community borewell affecting over 500 families.",
        "category": "Water & Sanitation",
        "location": "Ward 4, Shivajinagar, Pune",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "location_source": "GPS_CONFIRMED",
        "submission_source": "WEB",
    }

    res = client.post("/api/v1/citizen/reports", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "SUBMITTED"
    assert data["citizen_id"] == citizen_ctx["citizen"].id


def test_create_report_validation_errors(client, create_test_citizen):
    citizen_ctx = create_test_citizen()
    headers = citizen_ctx["headers"]

    # Title too short
    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "No", "description": "Valid description of problem"},
        headers=headers,
    )
    assert res.status_code == 422

    # Description too short
    res2 = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Valid Title", "description": "Short"},
        headers=headers,
    )
    assert res2.status_code == 422


def test_citizen_report_isolation(client, create_test_citizen):
    citizen_a = create_test_citizen(name="Citizen Alpha")
    citizen_b = create_test_citizen(name="Citizen Beta")

    # Citizen A creates report
    res_a = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Broken transformer sparking near school",
            "description": "Exposed high-voltage wire hanging near school gate poses severe electrocution risk.",
            "category": "Electricity",
            "location": "Civil Lines",
            "latitude": 18.5300,
            "longitude": 73.8500,
        },
        headers=citizen_a["headers"],
    )
    assert res_a.status_code == 201
    report_a_id = res_a.json()["id"]

    # Citizen A can access their own report
    get_a = client.get(f"/api/v1/citizen/reports/{report_a_id}", headers=citizen_a["headers"])
    assert get_a.status_code == 200
    assert get_a.json()["id"] == report_a_id

    # Citizen B CANNOT access Citizen A's report (isolation check)
    get_b = client.get(f"/api/v1/citizen/reports/{report_a_id}", headers=citizen_b["headers"])
    assert get_b.status_code == 404


def test_list_citizen_reports_and_pagination(client, create_test_citizen):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    # Create 3 reports
    for i in range(3):
        client.post(
            "/api/v1/citizen/reports",
            json={
                "title": f"Community challenge #{i+1}",
                "description": f"Detailed description for challenge number {i+1} in the locality.",
                "category": "Infrastructure" if i % 2 == 0 else "Health",
            },
            headers=headers,
        )

    # List all
    list_res = client.get("/api/v1/citizen/reports?page=1&limit=2", headers=headers)
    assert list_res.status_code == 200
    data = list_res.json()
    assert len(data["reports"]) == 2
    assert data["total"] == 3
    assert data["page"] == 1
    assert data["limit"] == 2

    # Filter by category
    filter_res = client.get("/api/v1/citizen/reports?category=Health", headers=headers)
    assert filter_res.status_code == 200
    assert filter_res.json()["total"] == 1
