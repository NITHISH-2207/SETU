def test_notification_lifecycle(client, create_test_citizen, create_test_government):
    citizen = create_test_citizen()
    govt = create_test_government()

    # Citizen submits report -> receives notification
    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Broken bench in park", "description": "Park bench broken and dangerous to sit on."},
        headers=citizen["headers"],
    )
    report_id = res.json()["id"]

    # Government updates report status -> citizen receives another notification
    client.patch(
        f"/api/v1/government/reports/{report_id}/status",
        json={"new_status": "VALIDATION", "comment": "Field inspector verified report."},
        headers=govt["headers"],
    )

    # Citizen lists notifications
    notif_res = client.get("/api/v1/notifications", headers=citizen["headers"])
    assert notif_res.status_code == 200
    data = notif_res.json()
    assert data["total"] >= 2
    assert data["unread_count"] >= 2

    first_notif = data["notifications"][0]
    notif_id = first_notif["id"]

    # Mark single notification as read
    read_res = client.patch(f"/api/v1/notifications/{notif_id}/read", headers=citizen["headers"])
    assert read_res.status_code == 200
    assert read_res.json()["read_at"] is not None

    # Mark all read
    all_res = client.post("/api/v1/notifications/read-all", headers=citizen["headers"])
    assert all_res.status_code == 200

    # Verify unread count is 0
    unread_res = client.get("/api/v1/notifications?unread_only=true", headers=citizen["headers"])
    assert unread_res.status_code == 200
    assert unread_res.json()["unread_count"] == 0
