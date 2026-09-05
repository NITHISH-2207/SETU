def test_university_profiles(client, create_test_university):
    uni = create_test_university()

    # Mentor profile
    mentor_res = client.get("/api/v1/university/profile", headers=uni["mentor_headers"])
    assert mentor_res.status_code == 200
    assert mentor_res.json()["role"] == "UNIVERSITY_MENTOR"
    assert "water" in mentor_res.json()["domains"]

    # Student profile
    student_res = client.get("/api/v1/university/profile", headers=uni["student_headers"])
    assert student_res.status_code == 200
    assert student_res.json()["role"] == "UNIVERSITY_STUDENT"


def test_university_problem_matching_and_interest(client, create_test_citizen, create_test_university):
    citizen = create_test_citizen()
    uni = create_test_university()

    # Citizen submits research-needed problem matching mentor's domains (water, arsenic, contamination)
    res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Severe groundwater arsenic contamination and toxic chemical study",
            "description": "Groundwater contamination with arsenic pollutants requiring innovative filtration technology.",
            "category": "Water Management",
        },
        headers=citizen["headers"],
    )
    report_id = res.json()["id"]

    # Mentor gets recommended matches
    rec_res = client.get("/api/v1/university/problems/recommended", headers=uni["mentor_headers"])
    assert rec_res.status_code == 200
    matches = rec_res.json()
    assert any(m["report_id"] == report_id for m in matches)

    # Mentor expresses interest
    interest_res = client.post(
        f"/api/v1/university/problems/{report_id}/interest",
        json={"comment": "Our laboratory has a working prototype membrane suitable for arsenic filtration."},
        headers=uni["mentor_headers"],
    )
    assert interest_res.status_code == 200
    assert interest_res.json()["status"] == "ACCEPTED"


def test_university_team_formation_and_assignment(client, create_test_citizen, create_test_university):
    citizen = create_test_citizen()
    uni = create_test_university()

    # Create team
    team_res = client.post(
        "/api/v1/university/teams",
        json={"name": "CleanWater Innovators", "description": "Student research group on membrane technology."},
        headers=uni["mentor_headers"],
    )
    assert team_res.status_code == 201
    team_id = team_res.json()["id"]

    # Add student to team
    add_member_res = client.post(
        f"/api/v1/university/teams/{team_id}/members",
        json={"student_id": uni["student"].id, "role": "Lead Student Researcher"},
        headers=uni["mentor_headers"],
    )
    assert add_member_res.status_code == 201

    # Submit problem
    rep_res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Heavy metals in village well", "description": "Need university prototype for water testing."},
        headers=citizen["headers"],
    )
    report_id = rep_res.json()["id"]

    # Assign team to problem
    assign_res = client.post(
        f"/api/v1/university/problems/{report_id}/assign",
        json={"team_id": team_id},
        headers=uni["mentor_headers"],
    )
    assert assign_res.status_code == 200
