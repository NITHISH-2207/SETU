def test_solution_project_lifecycle_and_participants(client, create_test_citizen, create_test_university, create_test_government, create_test_csr):
    citizen = create_test_citizen()
    uni = create_test_university()
    govt = create_test_government()
    csr = create_test_csr()

    # 1. Report submitted
    rep_res = client.post(
        "/api/v1/citizen/reports",
        json={
            "title": "Arsenic filtration for community wells",
            "description": "Comprehensive engineering project needed to develop and deploy arsenic filtration plants.",
            "category": "Water",
        },
        headers=citizen["headers"],
    )
    report_id = rep_res.json()["id"]

    # 2. Mentor creates solution project
    proj_res = client.post(
        "/api/v1/projects",
        json={
            "report_id": report_id,
            "title": "Low-Cost Arsenic Removal Filter",
            "description": "Multi-stage iron oxide adsorbent filter developed by university and funded by CSR.",
            "objective": "Provide safe drinking water to 500 families.",
        },
        headers=uni["mentor_headers"],
    )
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]
    assert proj_res.json()["stage"] == "PROBLEM_ANALYSIS"
    assert proj_res.json()["status"] == "ON_TRACK"

    # 3. Add student participant
    part_student = client.post(
        f"/api/v1/projects/{project_id}/participants",
        json={
            "user_id": uni["student_user"].id,
            "participant_type": "STUDENT",
            "role": "Field Testing Lead",
        },
        headers=uni["mentor_headers"],
    )
    assert part_student.status_code == 201

    # 4. Add government participant
    part_govt = client.post(
        f"/api/v1/projects/{project_id}/participants",
        json={
            "user_id": govt["user"].id,
            "organization_id": govt["org"].id,
            "participant_type": "GOVERNMENT",
            "role": "Municipal Oversight & Permitting",
        },
        headers=govt["headers"],
    )
    assert part_govt.status_code == 201

    # 5. Add CSR participant
    part_csr = client.post(
        f"/api/v1/projects/{project_id}/participants",
        json={
            "user_id": csr["user"].id,
            "organization_id": csr["corp"].id,
            "participant_type": "CSR",
            "role": "Hardware Grant Sponsor",
        },
        headers=csr["headers"],
    )
    assert part_csr.status_code == 201

    # 6. Add milestone
    milestone_res = client.post(
        f"/api/v1/projects/{project_id}/milestones",
        json={
            "title": "Laboratory Prototype Testing",
            "description": "Achieve <10 ppb arsenic concentration in water samples.",
        },
        headers=uni["mentor_headers"],
    )
    assert milestone_res.status_code == 201
    milestone_id = milestone_res.json()["id"]

    # 7. Update milestone to COMPLETED
    ms_patch = client.patch(
        f"/api/v1/projects/{project_id}/milestones/{milestone_id}",
        json={"status": "COMPLETED"},
        headers=uni["mentor_headers"],
    )
    assert ms_patch.status_code == 200
    assert ms_patch.json()["status"] == "COMPLETED"

    # 8. Advance lifecycle stage to PROTOTYPE
    stage_res = client.patch(
        f"/api/v1/projects/{project_id}/stage",
        json={"stage": "PROTOTYPE"},
        headers=uni["mentor_headers"],
    )
    assert stage_res.status_code == 200
    assert stage_res.json()["stage"] == "PROTOTYPE"

    # 9. Update health status to ON_TRACK
    status_res = client.patch(
        f"/api/v1/projects/{project_id}/status",
        json={"status": "ON_TRACK"},
        headers=uni["mentor_headers"],
    )
    assert status_res.status_code == 200

    # 10. Verify complete project details
    detail_res = client.get(f"/api/v1/projects/{project_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert len(detail["participants"]) >= 4
    assert len(detail["milestones"]) >= 1
