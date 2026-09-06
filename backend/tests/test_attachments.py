import io


def test_upload_valid_attachment(client, create_test_citizen):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Road pothole with evidence", "description": "Large pothole causing vehicle tire damage."},
        headers=headers,
    )
    report_id = res.json()["id"]

    # Upload mock image
    image_content = b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"fake image bytes" * 100
    files = {"file": ("pothole.jpg", io.BytesIO(image_content), "image/jpeg")}

    upload_res = client.post(
        f"/api/v1/citizen/reports/{report_id}/attachments",
        files=files,
        headers=headers,
    )
    assert upload_res.status_code == 201
    data = upload_res.json()
    assert data["type"] == "IMAGE"
    assert data["file_url"] is not None
    assert data["cloudinary_public_id"] is not None
    assert data["report_id"] == report_id


def test_reject_invalid_attachment_type(client, create_test_citizen):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Illegal dumping", "description": "Waste dumped behind market."},
        headers=headers,
    )
    report_id = res.json()["id"]

    # Attempt uploading an unsupported executable
    exe_content = b"MZ\x90\x00\x03"
    files = {"file": ("malicious.exe", io.BytesIO(exe_content), "application/octet-stream")}

    bad_upload = client.post(
        f"/api/v1/citizen/reports/{report_id}/attachments",
        files=files,
        headers=headers,
    )
    assert bad_upload.status_code == 400
    assert "Unsupported file format" in bad_upload.json()["detail"]


def test_reject_oversized_attachment(client, create_test_citizen):
    citizen = create_test_citizen()
    headers = citizen["headers"]

    res = client.post(
        "/api/v1/citizen/reports",
        json={"title": "Drain issue", "description": "Drain overflowing on street."},
        headers=headers,
    )
    report_id = res.json()["id"]

    # Oversized image (> 10MB limit)
    oversized = b"a" * (11 * 1024 * 1024)
    files = {"file": ("large_photo.jpg", io.BytesIO(oversized), "image/jpeg")}

    bad_size = client.post(
        f"/api/v1/citizen/reports/{report_id}/attachments",
        files=files,
        headers=headers,
    )
    assert bad_size.status_code == 400
    assert "exceeds limit" in bad_size.json()["detail"].lower()
