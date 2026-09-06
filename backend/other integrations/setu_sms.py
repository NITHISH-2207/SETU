import requests
import time
import re
import json
import io
from contextlib import redirect_stdout
from datetime import datetime, timezone, timedelta

from google import genai
from groq import Groq


# ============================================================
# SETU SMS SYSTEM
# ============================================================
#
# Architecture:
#
# SMS
#  ↓
# Android SMS Gateway
#  ↓
# Python SETU
#  ↓
# Groq AI (Primary)
#  ↓
# Gemini AI (Backup)
#  ↓
# Database
#
# Database:
#   Memory now
#   MongoDB Atlas ready for future
#
# ============================================================


# ============================================================
# AI SETTINGS
# ============================================================

# ============================================================
# GROQ - PRIMARY AI
# ============================================================

GROQ_API_KEY = "***"

GROQ_MODEL = "openai/gpt-oss-20b"


# ============================================================
# GEMINI - BACKUP AI
# ============================================================

GEMINI_API_KEY = "***"

GEMINI_MODEL = "gemini-3.7-flash"


# ============================================================
# DATABASE SETTINGS
# ============================================================

# Current:
#     memory
#
# Future:
#     mongodb
#
# Change ONLY this value when MongoDB is ready.
#
DATABASE_MODE = "memory"


# ============================================================
# MONGODB SETTINGS
# ============================================================

# Replace this with your REAL MongoDB Atlas URI later.
#
# Do NOT use this example as a real connection string.
#
MONGO_URI = (
    "mongodb+srv://setu_app:setu1234@cluster0.xxxxx.mongodb.net/"
    "?retryWrites=true&w=majority&appName=Cluster0"
)

MONGO_DATABASE_NAME = "setu"


# ============================================================
# SESSION SETTINGS
# ============================================================

# Session expires after 30 minutes of inactivity.

SESSION_TIMEOUT_MINUTES = 30

SETU_CATEGORIES = ['Roads & Potholes', 'Streetlights', 'Traffic Signals & Road Signs', 'Footpaths & Pavements', 'Public Transport & Bus Stops', 'Water Supply', 'Water Leakage', 'Drinking Water', 'Sewage & Sewerage', 'Drainage & Stormwater', 'Flooding & Waterlogging', 'Garbage Collection & Waste Management', 'Illegal Garbage Dumping', 'Public Toilets & Sanitation', 'Air Pollution', 'Water Pollution', 'Noise Pollution', 'Open Burning', 'Illegal Tree Cutting', 'Parks & Public Green Spaces', 'Stray Animals', 'Mosquito & Pest Infestation', 'Public Health Hazards', 'Government Hospitals & Health Centres', 'Government Schools & Public Education Facilities', 'Public Buildings & Facilities', 'Public Parking', 'Road & Public-Space Encroachment', 'Illegal Construction', 'Damaged Bridges & Culverts', 'Road Safety & Accident-Prone Locations', 'Electrical Hazards & Exposed Wires', 'Fire Safety Hazards', 'Building Safety Hazards', 'Disaster & Emergency Preparedness', 'Accessibility for Persons with Disabilities', 'Housing & Basic Infrastructure', 'Rural Infrastructure', 'Agricultural & Irrigation Infrastructure', 'Public Markets', 'Food Safety & Hygiene', 'Construction & Demolition Waste', 'Damaged Public Property', 'Government Service Delivery Issues', 'Corruption & Bribery Complaints']
CATEGORY_PAGE_SIZE = 5
COMMUNITY_PROBLEM_PAGE_SIZE = 3

# ============================================================
# LEGACY / UNCATEGORIZED PROBLEMS
# ============================================================
#
# Older database records created before the 45-category system
# existed may not have a "category" field at all. Those records
# must NOT silently disappear from Community Problems just
# because they don't match any of the 45 categories.
#
# get_problem_category() is the single place that decides which
# category bucket a problem belongs to for display purposes. It
# never modifies the stored record.
# ============================================================

LEGACY_CATEGORY_LABEL = "Uncategorized / Other Reports"


def get_problem_category(problem):

    category = str(problem.get("category", "") or "").strip()

    if category:

        # Category exists (whether or not it matches the current
        # 45-list, e.g. renamed category or imported data). Keep
        # it as its own visible bucket instead of hiding it.
        return category

    return LEGACY_CATEGORY_LABEL


# ============================================================
# CITIZEN-FRIENDLY STATUS LABEL
# ============================================================
#
# Only affects what is DISPLAYED to a citizen. The stored status
# value is never changed, so nothing else in the system (backend
# workflow, admin tooling) is affected.
# ============================================================

CITIZEN_STATUS_LABELS = {
    "AI Verification": "Received - Visible to Community",
}


def citizen_status_label(status):

    return CITIZEN_STATUS_LABELS.get(status, status)


# ============================================================
# SMS GATEWAY SETTINGS
# ============================================================

# IMPORTANT:
# Update this IP whenever your Android gateway IP changes.

GATEWAY_URL = "http://192.168.133.155:8080"

USERNAME = "SETU"

PASSWORD = "setu1234"


# ============================================================
# CREATE GROQ CLIENT
# ============================================================

try:

    groq_client = Groq(
        api_key=GROQ_API_KEY
    )

    print(
        "Groq AI client: READY"
    )

except Exception as e:

    print(
        "ERROR: Could not create Groq client."
    )

    print(e)

    groq_client = None


# ============================================================
# CREATE GEMINI CLIENT
# ============================================================

try:

    gemini_client = genai.Client(
        api_key=GEMINI_API_KEY
    )

    print(
        "Gemini AI client: READY"
    )

except Exception as e:

    print(
        "ERROR: Could not create Gemini client."
    )

    print(e)

    gemini_client = None


# ============================================================
# HTTP SESSION
# ============================================================

http = requests.Session()

http.auth = (
    USERNAME,
    PASSWORD
)


# ============================================================
# DATABASE ABSTRACTION
# ============================================================


class DatabaseInterface:
    """
    Common database interface.

    SETU business logic uses this interface instead of
    directly depending on Memory DB or MongoDB.

    This makes future MongoDB integration much easier.
    """

    def initialize(self):
        raise NotImplementedError

    def get_user(self, phone):
        raise NotImplementedError

    def save_user(self, phone, user):
        raise NotImplementedError

    def get_problems(self):
        raise NotImplementedError

    def get_problem(self, problem_id):
        raise NotImplementedError

    def save_problem(self, problem_id, problem):
        raise NotImplementedError

    def get_reports(self):
        raise NotImplementedError

    def get_report(self, report_id):
        raise NotImplementedError

    def save_report(self, report_id, report):
        raise NotImplementedError

    def next_report_id(self):
        raise NotImplementedError

    def next_problem_id(self):
        raise NotImplementedError

    def add_support(self, phone, problem_id):
        raise NotImplementedError


# ============================================================
# MEMORY DATABASE
# ============================================================


class MemoryDatabase(DatabaseInterface):

    def __init__(self):

        self.users = {}

        self.problems = {}

        self.reports = {}

        self.supports = set()

        self.next_report_number = 1025

        self.next_problem_number = 105


    # --------------------------------------------------------
    # INITIALIZE
    # --------------------------------------------------------

    def initialize(self):

        self.seed_demo_data()

        print(
            "Database: MEMORY"
        )

        print(
            "MongoDB is NOT required for current demo."
        )


    # --------------------------------------------------------
    # USER
    # --------------------------------------------------------

    def get_user(self, phone):

        if phone not in self.users:

            self.users[phone] = {

                "phone": phone,

                "language": "english",

                "state": "INACTIVE",

                "session_started_at": None,

                "last_activity_at": None,

                "reports": [],

                "supported_problems": [],

                "temp_problem": "",

                "temp_problem_statement": "",

                "pending_problem_statement": "",

                "temp_category": "",

                "temp_description": "",

                "temp_location": "",

                "temp_location_original": "",

                "temp_ai_data": {},

                "selected_problem": "",

                "duplicate_match": None,

                "category_page": 0,

                "community_category": "",

                "community_page": 0,
                "rights_topic": ""
            }

        return self.users[phone]


    # --------------------------------------------------------
    # SAVE USER
    # --------------------------------------------------------

    def save_user(
        self,
        phone,
        user
    ):

        self.users[phone] = user


    # --------------------------------------------------------
    # PROBLEMS
    # --------------------------------------------------------

    def get_problems(self):

        return self.problems


    def get_problem(
        self,
        problem_id
    ):

        return self.problems.get(
            problem_id
        )


    def save_problem(
        self,
        problem_id,
        problem
    ):

        self.problems[problem_id] = problem


    # --------------------------------------------------------
    # REPORTS
    # --------------------------------------------------------

    def get_reports(self):

        return self.reports


    def get_report(
        self,
        report_id
    ):

        return self.reports.get(
            report_id
        )


    def save_report(
        self,
        report_id,
        report
    ):

        self.reports[report_id] = report


    # --------------------------------------------------------
    # IDS
    # --------------------------------------------------------

    def next_report_id(self):

        report_id = (
            "SETU"
            +
            str(
                self.next_report_number
            )
        )

        self.next_report_number += 1

        return report_id


    def next_problem_id(self):

        problem_id = (
            "#"
            +
            str(
                self.next_problem_number
            )
        )

        self.next_problem_number += 1

        return problem_id


    # --------------------------------------------------------
    # SUPPORT
    # --------------------------------------------------------

    def add_support(
        self,
        phone,
        problem_id
    ):

        key = (
            phone,
            problem_id
        )

        if key in self.supports:

            return False

        self.supports.add(
            key
        )

        # Apply the upvote directly and immediately to the
        # problem's vote count (matches MongoDatabase's $inc).
        problem = self.problems.get(
            problem_id
        )

        if problem is not None:

            problem["votes"] = problem.get(
                "votes",
                0
            ) + 1

        return True


    # --------------------------------------------------------
    # DEMO DATA
    # --------------------------------------------------------

    def seed_demo_data(self):

        self.problems = {

            "#101": {

                "title": "Road Potholes",
                "category": "Roads & Potholes",

                "location": "Avinashi Road, Coimbatore",

                "issue": "Deep potholes",

                "description":
                    "Deep potholes are present on Avinashi Road.",

                "problem_type":
                    "Road Infrastructure",

                "severity": "High",

                "urgency": "High",

                "votes": 47,

                "status":
                    "Under Verification",

                "report_id":
                    "SETU1021",

                "reporter":
                    "demo",

                "created_at":
                    datetime.now(timezone.utc)
            },

            "#102": {

                "title": "Water Shortage",
                "category": "Water Supply",

                "location":
                    "M.G. Road, Tirupur",

                "issue":
                    "No water supply",

                "description":
                    "Water supply is unavailable in the reported area.",

                "problem_type":
                    "Water Supply",

                "severity": "High",

                "urgency": "High",

                "votes": 32,

                "status":
                    "Government Review",

                "report_id":
                    "SETU1022",

                "reporter":
                    "demo",

                "created_at":
                    datetime.now(timezone.utc)
            },

            "#103": {

                "title":
                    "Garbage Not Collected",

                "location":
                    "Five Roads, Salem",

                "issue":
                    "Garbage not collected",

                "description":
                    "Garbage has not been collected in the reported area.",

                "problem_type":
                    "Waste Management",

                "severity":
                    "Medium",

                "urgency":
                    "Medium",

                "votes": 61,

                "status":
                    "Solution Development",

                "report_id":
                    "SETU1023",

                "reporter":
                    "demo",

                "created_at":
                    datetime.now(timezone.utc)
            },

            "#104": {

                "title":
                    "Street Lights Not Working",

                "location":
                    "Perundurai Road, Erode",

                "issue":
                    "Street lights are not working",

                "description":
                    "Street lights are not functioning on the reported road.",

                "problem_type":
                    "Street Lighting",

                "severity":
                    "Medium",

                "urgency":
                    "Medium",

                "votes": 28,

                "status":
                    "Pilot",

                "report_id":
                    "SETU1024",

                "reporter":
                    "demo",

                "created_at":
                    datetime.now(timezone.utc)
            }
        }


        self.reports = {

            "SETU1021": {

                "problem_id":
                    "#101",

                "problem":
                    "Road Potholes",

                "description":
                    "Deep potholes are present on Avinashi Road.",

                "location":
                    "Avinashi Road, Coimbatore",

                "status":
                    "Under Verification",

                "reporter":
                    "demo",

                "severity":
                    "High",

                "urgency":
                    "High",

                "problem_type":
                    "Road Infrastructure",

                "created_at":
                    datetime.now(timezone.utc)
            },

            "SETU1022": {

                "problem_id":
                    "#102",

                "problem":
                    "Water Shortage",

                "description":
                    "Water supply is unavailable in the reported area.",

                "location":
                    "M.G. Road, Tirupur",

                "status":
                    "Government Review",

                "reporter":
                    "demo",

                "severity":
                    "High",

                "urgency":
                    "High",

                "problem_type":
                    "Water Supply",

                "created_at":
                    datetime.now(timezone.utc)
            },

            "SETU1023": {

                "problem_id":
                    "#103",

                "problem":
                    "Garbage Not Collected",

                "description":
                    "Garbage has not been collected in the reported area.",

                "location":
                    "Five Roads, Salem",

                "status":
                    "Solution Development",

                "reporter":
                    "demo",

                "severity":
                    "Medium",

                "urgency":
                    "Medium",

                "problem_type":
                    "Waste Management",

                "created_at":
                    datetime.now(timezone.utc)
            },

            "SETU1024": {

                "problem_id":
                    "#104",

                "problem":
                    "Street Lights Not Working",

                "description":
                    "Street lights are not functioning on the reported road.",

                "location":
                    "Perundurai Road, Erode",

                "status":
                    "Pilot",

                "reporter":
                    "demo",

                "severity":
                    "Medium",

                "urgency":
                    "Medium",

                "problem_type":
                    "Street Lighting",

                "created_at":
                    datetime.now(timezone.utc)
            }
        }


# ============================================================
# MONGODB DATABASE
# ============================================================


class MongoDatabase(DatabaseInterface):

    def __init__(
        self,
        uri,
        database_name
    ):

        try:

            from pymongo import MongoClient

        except ImportError:

            raise RuntimeError(
                "pymongo is not installed. "
                "Run: python -m pip install pymongo"
            )


        self.MongoClient = MongoClient

        self.client = MongoClient(
            uri,
            serverSelectionTimeoutMS=5000
        )

        self.db = self.client[
            database_name
        ]


        self.users = self.db[
            "users"
        ]

        self.problems = self.db[
            "problems"
        ]

        self.reports = self.db[
            "reports"
        ]

        self.supports = self.db[
            "supports"
        ]

        self.counters = self.db[
            "counters"
        ]


    # --------------------------------------------------------
    # INITIALIZE
    # --------------------------------------------------------

    def initialize(self):

        self.client.admin.command(
            "ping"
        )

        print(
            "Database: MONGODB ATLAS"
        )

        self.create_indexes()

        self.seed_demo_data()

        self.initialize_counters()


    # --------------------------------------------------------
    # INDEXES
    # --------------------------------------------------------

    def create_indexes(self):

        self.users.create_index(
            "phone",
            unique=True
        )

        self.problems.create_index(
            "problem_id",
            unique=True
        )

        self.reports.create_index(
            "report_id",
            unique=True
        )

        self.supports.create_index(

            [
                ("phone", 1),
                ("problem_id", 1)
            ],

            unique=True
        )

        self.problems.create_index(
            "created_at"
        )

        self.reports.create_index(
            "created_at"
        )


    # --------------------------------------------------------
    # USER
    # --------------------------------------------------------

    def get_user(self, phone):

        user = self.users.find_one(
            {
                "phone": phone
            }
        )


        if user is None:

            user = {

                "phone": phone,

                "language": "english",

                "state": "INACTIVE",

                "session_started_at":
                    None,

                "last_activity_at":
                    None,

                "reports": [],

                "supported_problems": [],

                "temp_problem": "",

                "temp_problem_statement": "",

                "pending_problem_statement": "",

                "temp_category": "",

                "temp_description": "",

                "temp_location": "",

                "temp_location_original": "",

                "temp_ai_data": {},

                "selected_problem": "",

                "duplicate_match": None,

                "category_page": 0,

                "community_category": "",

                "community_page": 0,
                "rights_topic": ""
            }


            self.users.insert_one(
                user
            )

        else:

            user.pop(
                "_id",
                None
            )

            user.setdefault("temp_problem_statement", "")
            user.setdefault("temp_category", "")
            user.setdefault("temp_location_original", "")
            user.setdefault("category_page", 0)
            user.setdefault("community_category", "")
            user.setdefault("community_page", 0)

        return user


    def save_user(
        self,
        phone,
        user
    ):

        self.users.update_one(

            {
                "phone": phone
            },

            {
                "$set": user
            },

            upsert=True
        )


    # --------------------------------------------------------
    # PROBLEMS
    # --------------------------------------------------------

    def get_problems(self):

        result = {}

        for problem in self.problems.find():

            problem.pop(
                "_id",
                None
            )

            problem_id = problem[
                "problem_id"
            ]

            result[
                problem_id
            ] = problem

        return result


    def get_problem(
        self,
        problem_id
    ):

        problem = self.problems.find_one(
            {
                "problem_id":
                    problem_id
            }
        )

        if problem:

            problem.pop(
                "_id",
                None
            )

        return problem


    def save_problem(
        self,
        problem_id,
        problem
    ):

        problem = dict(
            problem
        )

        problem[
            "problem_id"
        ] = problem_id

        self.problems.update_one(

            {
                "problem_id":
                    problem_id
            },

            {
                "$set": problem
            },

            upsert=True
        )


    # --------------------------------------------------------
    # REPORTS
    # --------------------------------------------------------

    def get_reports(self):

        result = {}

        for report in self.reports.find():

            report.pop(
                "_id",
                None
            )

            report_id = report[
                "report_id"
            ]

            result[
                report_id
            ] = report

        return result


    def get_report(
        self,
        report_id
    ):

        report = self.reports.find_one(
            {
                "report_id":
                    report_id
            }
        )

        if report:

            report.pop(
                "_id",
                None
            )

        return report


    def save_report(
        self,
        report_id,
        report
    ):

        report = dict(
            report
        )

        report[
            "report_id"
        ] = report_id

        self.reports.update_one(

            {
                "report_id":
                    report_id
            },

            {
                "$set": report
            },

            upsert=True
        )


    # --------------------------------------------------------
    # COUNTERS
    # --------------------------------------------------------

    def initialize_counters(self):

        max_problem = 104

        max_report = 1024


        for problem in self.problems.find():

            problem_id = problem.get(
                "problem_id",
                ""
            )

            match = re.search(
                r"(\d+)",
                problem_id
            )

            if match:

                max_problem = max(
                    max_problem,
                    int(match.group(1))
                )


        for report in self.reports.find():

            report_id = report.get(
                "report_id",
                ""
            )

            match = re.search(
                r"(\d+)",
                report_id
            )

            if match:

                max_report = max(
                    max_report,
                    int(match.group(1))
                )


        self.counters.update_one(

            {
                "_id": "problem"
            },

            {
                "$setOnInsert": {
                    "value":
                        max_problem
                }
            },

            upsert=True
        )


        self.counters.update_one(

            {
                "_id": "report"
            },

            {
                "$setOnInsert": {
                    "value":
                        max_report
                }
            },

            upsert=True
        )


    def next_report_id(self):

        result = self.counters.find_one_and_update(

            {
                "_id": "report"
            },

            {
                "$inc": {
                    "value": 1
                }
            },

            return_document=True
        )

        number = result[
            "value"
        ]

        return (
            "SETU"
            +
            str(number)
        )


    def next_problem_id(self):

        result = self.counters.find_one_and_update(

            {
                "_id": "problem"
            },

            {
                "$inc": {
                    "value": 1
                }
            },

            return_document=True
        )

        number = result[
            "value"
        ]

        return (
            "#"
            +
            str(number)
        )


    # --------------------------------------------------------
    # SUPPORT
    # --------------------------------------------------------

    def add_support(
        self,
        phone,
        problem_id
    ):

        try:

            self.supports.insert_one(

                {
                    "phone": phone,

                    "problem_id":
                        problem_id,

                    "created_at":
                        datetime.now(
                            timezone.utc
                        )
                }
            )

            self.problems.update_one(

                {
                    "problem_id":
                        problem_id
                },

                {
                    "$inc": {
                        "votes": 1
                    }
                }
            )

            return True

        except Exception:

            return False


    # --------------------------------------------------------
    # SEED DEMO DATA
    # --------------------------------------------------------

    def seed_demo_data(self):

        memory = MemoryDatabase()

        memory.seed_demo_data()


        for problem_id, problem in memory.problems.items():

            problem = dict(
                problem
            )

            problem[
                "problem_id"
            ] = problem_id

            self.problems.update_one(

                {
                    "problem_id":
                        problem_id
                },

                {
                    "$setOnInsert":
                        problem
                },

                upsert=True
            )


        for report_id, report in memory.reports.items():

            report = dict(
                report
            )

            report[
                "report_id"
            ] = report_id

            self.reports.update_one(

                {
                    "report_id":
                        report_id
                },

                {
                    "$setOnInsert":
                        report
                },

                upsert=True
            )


# ============================================================
# CREATE DATABASE
# ============================================================


def create_database():

    if DATABASE_MODE.lower() == "mongodb":

        try:

            database = MongoDatabase(

                MONGO_URI,

                MONGO_DATABASE_NAME
            )

            database.initialize()

            return database

        except Exception as e:

            print()
            print(
                "ERROR: MongoDB connection failed."
            )

            print(e)

            print()

            raise


    database = MemoryDatabase()

    database.initialize()

    return database


# ============================================================
# CREATE DATABASE INSTANCE
# ============================================================

db = create_database()


# ============================================================
# HELPER - CURRENT TIME
# ============================================================


def utc_now():

    return datetime.now(
        timezone.utc
    )


# ============================================================
# USER
# ============================================================


def get_user(sender):

    return db.get_user(
        sender
    )


# ============================================================
# SAVE USER
# ============================================================


def save_user(
    sender,
    user
):

    db.save_user(
        sender,
        user
    )


# ============================================================
# LANGUAGE
# ============================================================


def get_language(sender):

    return get_user(
        sender
    ).get(
        "language",
        "english"
    )


def set_language(
    sender,
    language
):

    user = get_user(
        sender
    )

    user[
        "language"
    ] = language

    save_user(
        sender,
        user
    )


# ============================================================
# SESSION
# ============================================================


def activate_session(
    sender
):

    user = get_user(
        sender
    )

    now = utc_now()

    user[
        "state"
    ] = "MAIN_MENU"

    user[
        "session_started_at"
    ] = now

    user[
        "last_activity_at"
    ] = now

    save_user(
        sender,
        user
    )


# ============================================================
# SESSION EXPIRED?
# ============================================================


def session_has_expired(
    user
):

    last_activity = user.get(
        "last_activity_at"
    )

    if last_activity is None:

        return True


    # MongoDB normally returns datetime.
    # Memory database also stores datetime.

    if isinstance(
        last_activity,
        str
    ):

        try:

            last_activity = datetime.fromisoformat(
                last_activity
            )

        except Exception:

            return True


    if last_activity.tzinfo is None:

        last_activity = last_activity.replace(
            tzinfo=timezone.utc
        )


    expiry_time = (
        last_activity
        +
        timedelta(
            minutes=SESSION_TIMEOUT_MINUTES
        )
    )


    return utc_now() > expiry_time


# ============================================================
# TOUCH SESSION
# ============================================================


def touch_session(
    sender
):

    user = get_user(
        sender
    )

    user[
        "last_activity_at"
    ] = utc_now()

    save_user(
        sender,
        user
    )


# ============================================================
# RESET REPORT FLOW
# ============================================================


def reset_report_flow(user):

    user["temp_problem"] = ""
    user["temp_problem_statement"] = ""
    user["pending_problem_statement"] = ""
    user["temp_category"] = ""
    user["temp_description"] = ""
    user["temp_location"] = ""
    user["temp_location_original"] = ""
    user["temp_ai_data"] = {}
    user["selected_problem"] = ""
    user["duplicate_match"] = None
    user["category_page"] = 0


def main_menu(sender):

    language = get_language(
        sender
    )


    if language == "tamil":

        return """SETU-க்கு வரவேற்கிறோம்.

1. பிரச்சினையைப் புகாரளிக்கவும்
2. சமூகப் பிரச்சினைகளைப் பார்க்கவும்
3. புகாரின் நிலையைப் பார்க்கவும்
4. எனது புகார்கள்
5. மொழியை மாற்றவும்
6. உங்கள் உரிமைகளை அறியவும்
7. உதவி

ஒரு எண்ணை அனுப்பவும்."""


    if language == "hindi":

        return """SETU में आपका स्वागत है।

1. समस्या की रिपोर्ट करें
2. सामुदायिक समस्याएँ देखें
3. रिपोर्ट की स्थिति देखें
4. मेरी रिपोर्ट
5. भाषा बदलें
6. अपने अधिकार जानें
7. सहायता

कोई एक नंबर भेजें।"""


    return """Welcome to SETU.

1. Report a Problem
2. Community Problems
3. Check Report Status
4. My Reports
5. Change Language
6. Know Your Rights
7. Help

Reply with a number."""


# ============================================================
# KNOW YOUR RIGHTS
# ============================================================
#
# Keep this section short and hand-picked.
# It provides simple citizen awareness, not legal advice.
# ============================================================


def know_your_rights_menu(sender):

    language = get_language(
        sender
    )

    user = get_user(
        sender
    )

    user[
        "state"
    ] = "RIGHTS_MENU"

    save_user(
        sender,
        user
    )

    if language == "tamil":

        return """உங்கள் உரிமைகளை அறியவும்

1. கருத்து தெரிவிக்கும் சுதந்திரம் - அரசியலமைப்பு பிரிவு 19
2. சுற்றுச்சூழல் பாதுகாப்பு - அரசியலமைப்பு பிரிவு 51A(g)
3. அரசுத் தகவல் பெறும் உரிமை - தகவல் அறியும் உரிமைச் சட்டம், 2005

0. பின்செல்லவும்
#. முதன்மை மெனு"""

    if language == "hindi":

        return """अपने अधिकार जानें

1. अभिव्यक्ति की स्वतंत्रता - संविधान अनुच्छेद 19
2. पर्यावरण संरक्षण - संविधान अनुच्छेद 51A(g)
3. सरकारी जानकारी का अधिकार - सूचना का अधिकार अधिनियम, 2005

0. वापस जाएँ
#. मुख्य मेनू"""

    return """Know Your Rights

1. Freedom of Speech - Article 19
2. Environmental Protection - Article 51A(g)
3. Government Information - Right to Information Act, 2005

0. Back
#. Main Menu"""


def rights_detail(sender, topic):

    language = get_language(
        sender
    )

    user = get_user(
        sender
    )

    user[
        "state"
    ] = "RIGHTS_DETAIL"

    user[
        "rights_topic"
    ] = topic

    save_user(
        sender,
        user
    )

    if topic == "1":

        if language == "tamil":

            return """கருத்து தெரிவிக்கும் சுதந்திரம்

அரசியலமைப்பு பிரிவு 19 குடிமக்களுக்கு கருத்து மற்றும் பேச்சு சுதந்திரத்தை வழங்குகிறது. ஆனால் சட்டப்படி சில நியாயமான கட்டுப்பாடுகள் உள்ளன.

0. பின்செல்லவும்
#. முதன்மை மெனு"""

        if language == "hindi":

            return """अभिव्यक्ति की स्वतंत्रता

संविधान का अनुच्छेद 19 नागरिकों को बोलने और अपने विचार व्यक्त करने की स्वतंत्रता देता है। लेकिन कानून के अनुसार कुछ उचित प्रतिबंध लागू होते हैं।

0. वापस जाएँ
#. मुख्य मेनू"""

        return """Freedom of Speech

Article 19 gives citizens freedom of speech and expression. However, this right is subject to reasonable legal restrictions.

0. Back
#. Main Menu"""

    if topic == "2":

        if language == "tamil":

            return """சுற்றுச்சூழல் பாதுகாப்பு

அரசியலமைப்பு பிரிவு 51A(g) இயற்கை சூழல், காடுகள், ஏரிகள், ஆறுகள் மற்றும் வனவிலங்குகளை பாதுகாப்பது ஒவ்வொரு குடிமகனின் அடிப்படை கடமை எனக் கூறுகிறது.

0. பின்செல்லவும்
#. முதன்மை மெனு"""

        if language == "hindi":

            return """पर्यावरण संरक्षण

संविधान का अनुच्छेद 51A(g) प्रत्येक नागरिक का कर्तव्य बताता है कि वह प्राकृतिक पर्यावरण, जंगलों, झीलों, नदियों और वन्यजीवों की रक्षा करे।

0. वापस जाएँ
#. मुख्य मेनू"""

        return """Environmental Protection

Article 51A(g) says that it is a fundamental duty of every citizen to protect and improve the natural environment, including forests, lakes, rivers and wildlife.

0. Back
#. Main Menu"""

    if topic == "3":

        if language == "tamil":

            return """அரசுத் தகவல் பெறும் உரிமை

தகவல் அறியும் உரிமைச் சட்டம், 2005ன் கீழ், சட்டத்தில் உள்ள விலக்குகளுக்கு உட்பட்டு, பொதுத் துறைகளிடமிருந்து தகவலைக் கோரலாம்.

0. பின்செல்லவும்
#. முதன்மை மெனு"""

        if language == "hindi":

            return """सरकारी जानकारी का अधिकार

सूचना का अधिकार अधिनियम, 2005 के तहत, कानून में दिए गए अपवादों के अधीन, नागरिक सार्वजनिक प्राधिकरणों से जानकारी मांग सकते हैं।

0. वापस जाएँ
#. मुख्य मेनू"""

        return """Government Information

Under the Right to Information Act, 2005, citizens can request information from public authorities, subject to legal exemptions.

0. Back
#. Main Menu"""

    return know_your_rights_menu(
        sender
    )


# ============================================================
# HELP
# ============================================================


def help_menu(sender):

    language = get_language(
        sender
    )

    user = get_user(
        sender
    )

    user[
        "state"
    ] = "HELP"

    save_user(
        sender,
        user
    )

    if language == "tamil":

        return """உதவி

அழைக்க: 9513886363
SMS: 6374070050
Instagram: setu.bot
WhatsApp: 6374070050
மின்னஞ்சல்: setu.ai_mail@gmail.com

0. பின்செல்லவும்
#. முதன்மை மெனு"""

    if language == "hindi":

        return """सहायता

कॉल करें: 9513886363
SMS: 6374070050
Instagram: setu.bot
WhatsApp: 6374070050
ईमेल: setu.ai_mail@gmail.com

0. वापस जाएँ
#. मुख्य मेनू"""

    return """Help

Call: 9513886363
SMS: 6374070050
Instagram: setu.bot
WhatsApp: 6374070050
Email: setu.ai_mail@gmail.com

0. Back
#. Main Menu"""


# ============================================================
# LANGUAGE MENU
# ============================================================


def language_menu(sender):

    language = get_language(
        sender
    )


    if language == "tamil":

        return """மொழியைத் தேர்ந்தெடுக்கவும்

1. English
2. தமிழ்
3. हिन्दी

1, 2 அல்லது 3 என அனுப்பவும்."""


    if language == "hindi":

        return """भाषा चुनें

1. English
2. தமிழ்
3. हिन्दी

1, 2 या 3 भेजें।"""


    return """Select Language

1. English
2. Tamil
3. Hindi

Reply with 1, 2, or 3."""


# ============================================================
# LANGUAGE CHANGED
# ============================================================


def language_changed(
    language
):

    if language == "tamil":

        return """மொழி தமிழ் என மாற்றப்பட்டுள்ளது.

இனி SETU தகவல்கள் தமிழில் இருக்கும்.

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


    if language == "hindi":

        return """भाषा हिन्दी में बदल दी गई है।

अब SETU की जानकारी हिन्दी में मिलेगी।

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


    return """Language changed to English.

All future SETU messages will be in English.

Reply 0 for Main Menu.
#. Main Menu"""


# ============================================================
# REPORT PROBLEM MENU
# ============================================================


def report_problem_menu(sender):
    # Category is no longer picked manually - the AI detects it
    # automatically from the citizen's own description. Go
    # straight to asking for the problem statement.
    user = get_user(sender)
    user["state"] = "REPORTING"
    user["temp_category"] = ""
    save_user(sender, user)
    return report_problem_statement_menu(sender)


def report_category_menu(sender, page=0):
    language = get_language(sender)
    total_pages = (len(SETU_CATEGORIES) + CATEGORY_PAGE_SIZE - 1) // CATEGORY_PAGE_SIZE
    page = safe_int(page, 0, 0, total_pages - 1)
    user = get_user(sender)
    user["state"] = "REPORT_CATEGORY"
    user["category_page"] = page
    save_user(sender, user)

    current = SETU_CATEGORIES[page * CATEGORY_PAGE_SIZE:(page + 1) * CATEGORY_PAGE_SIZE]
    if language == "tamil":
        out = ["பிரச்சினை வகையைத் தேர்ந்தெடுக்கவும்", "", f"பக்கம் {page + 1}/{total_pages}", ""]
    elif language == "hindi":
        out = ["समस्या की श्रेणी चुनें", "", f"पृष्ठ {page + 1}/{total_pages}", ""]
    else:
        out = ["Select Problem Category", "", f"Page {page + 1}/{total_pages}", ""]
    for n, category in enumerate(current, 1):
        out.append(f"{n}. {category}")
    out.append("")
    if page < total_pages - 1:
        out.append("9. அடுத்த பக்கம்" if language == "tamil" else "9. अगला पृष्ठ" if language == "hindi" else "9. Next Page")
    if page > 0:
        out.append("8. முந்தைய பக்கம்" if language == "tamil" else "8. पिछला पृष्ठ" if language == "hindi" else "8. Previous Page")
    out.append("0. பின்செல்லவும்" if language == "tamil" else "0. वापस जाएँ" if language == "hindi" else "0. Back")
    return "\n".join(out)


def process_report_category(sender, text):
    user = get_user(sender)
    page = safe_int(user.get("category_page", 0), 0, 0)
    total_pages = (len(SETU_CATEGORIES) + CATEGORY_PAGE_SIZE - 1) // CATEGORY_PAGE_SIZE
    page = min(page, total_pages - 1)
    current = SETU_CATEGORIES[page * CATEGORY_PAGE_SIZE:(page + 1) * CATEGORY_PAGE_SIZE]

    if text == "9" and page < total_pages - 1:
        return report_category_menu(sender, page + 1)
    if text == "8" and page > 0:
        return report_category_menu(sender, page - 1)

    try:
        choice = int(text)
    except ValueError:
        return report_category_menu(sender, page)

    if 1 <= choice <= len(current):
        user["temp_category"] = current[choice - 1]
        pending = user.get("pending_problem_statement", "").strip()
        user["pending_problem_statement"] = ""
        user["state"] = "REPORTING"
        save_user(sender, user)

        if pending:
            return process_reporting(sender, pending)

        return report_problem_statement_menu(sender)

    return report_category_menu(sender, page)


def report_problem_statement_menu(sender):
    language = get_language(sender)

    # No category prompt anymore - SETU's AI detects the category
    # automatically from what the citizen types below.

    if language == "tamil":
        return """பிரச்சினையை உங்கள் சொந்த வார்த்தைகளில் தெரிவிக்கவும்.

உதாரணம்:
கல்லூரி வாயில் அருகே சாலையில் பெரிய பள்ளம் உள்ளது.

0. பின்செல்லவும்விற்குச் செல்லவும்."""

    if language == "hindi":
        return """समस्या को अपने शब्दों में बताएं।

उदाहरण:
कॉलेज गेट के पास सड़क पर एक बड़ा गड्ढा है।

0. वापस जाएँ पर वापस जाएँ।"""

    return """Describe the problem in your own words.

Example:
There is a large pothole near the college gate.

Reply 0 to go back to Main Menu."""


def ask_report_description(sender):

    language = get_language(sender)
    user = get_user(sender)
    user["state"] = "REPORT_DESCRIPTION"
    save_user(sender, user)

    if language == "tamil":
        return "கூடுதல் விளக்கம் வழங்கலாம். இது விருப்பமானது.\nவிளக்கம் வேண்டாம் என்றால் SKIP அனுப்பவும்.\n0. முந்தைய படிக்கு செல்லவும்."
    if language == "hindi":
        return "आप अतिरिक्त विवरण दे सकते हैं। यह वैकल्पिक है।\nविवरण नहीं देना चाहते हैं तो SKIP भेजें।\n0. पिछले चरण पर जाएँ।"
    return "You may provide additional details. This is optional.\nIf you do not want to provide one, reply SKIP.\nReply 0 to go back to the previous step."


def location_menu(sender):

    language = get_language(sender)
    user = get_user(sender)
    user["state"] = "LOCATION"
    save_user(sender, user)

    if language == "tamil":
        return """இட விவரத்தை வழங்கவும்.

- சாலை / தெரு பெயர்
- அருகிலுள்ள முக்கிய இடம்
- நகரம் / கிராமம்
- மாவட்டம்
- PIN Code

உதாரணம்:
காங்கேயம் சாலை, அரசு மருத்துவமனை அருகில், திருப்பூர், திருப்பூர் மாவட்டம், PIN 641604

0. முந்தைய படிக்கு செல்லவும்."""
    if language == "hindi":
        return """स्थान की जानकारी दें।

- सड़क / गली
- पास का प्रमुख स्थान
- शहर / गाँव
- जिला
- PIN Code

उदाहरण:
कांगयम रोड, सरकारी अस्पताल के पास, तिरुपुर, तिरुपुर जिला, PIN 641604

0. पिछले चरण पर जाएँ."""
    return """Provide the problem location.

- Street/Road name
- Nearby landmark
- Town/Village
- District
- PIN Code

Example:
Kangeyam Road, near Government Hospital, Tirupur, Tirupur District, PIN 641604

Reply 0 to go back to the previous step."""


def send_sms(
    phone_number,
    message
):

    data = {

        "textMessage": {

            "text": message
        },

        "phoneNumbers": [

            phone_number
        ]
    }


    try:

        response = http.post(

            GATEWAY_URL
            +
            "/messages",

            json=data,

            timeout=5
        )


        print(
            "SEND:",
            response.status_code
        )


        if response.status_code not in [
            200,
            201,
            202
        ]:

            print(
                "SMS sending error:"
            )

            print(
                response.text
            )


    except Exception as e:

        print(
            "SMS sending exception:",
            e
        )


# ============================================================
# AI JSON PARSER
# ============================================================


def parse_ai_json(raw):

    if not raw:

        raise ValueError(
            "Empty AI response"
        )


    raw = str(
        raw
    ).strip()


    raw = raw.replace(
        "```json",
        ""
    )

    raw = raw.replace(
        "```JSON",
        ""
    )

    raw = raw.replace(
        "```",
        ""
    )

    raw = raw.strip()


    start = raw.find(
        "{"
    )

    end = raw.rfind(
        "}"
    )


    if start == -1 or end == -1:

        raise ValueError(
            "AI response does not contain JSON"
        )


    json_text = raw[
        start:end + 1
    ]


    return json.loads(
        json_text
    )


# ============================================================
# SAFE INTEGER
# ============================================================


def safe_int(
    value,
    default=0,
    minimum=None,
    maximum=None
):

    try:

        value = int(
            value
        )

    except Exception:

        value = default


    if minimum is not None:

        value = max(
            minimum,
            value
        )


    if maximum is not None:

        value = min(
            maximum,
            value
        )


    return value


# ============================================================
# SAFE BOOLEAN
# ============================================================


def safe_bool(
    value,
    default=False
):

    if isinstance(
        value,
        bool
    ):

        return value


    if isinstance(
        value,
        str
    ):

        value = value.strip().lower()


        if value in [
            "true",
            "yes",
            "1"
        ]:

            return True


        if value in [
            "false",
            "no",
            "0"
        ]:

            return False


    if isinstance(
        value,
        int
    ):

        return value != 0


    return default


# ============================================================
# AI GENERATE JSON
# GROQ PRIMARY → GEMINI FALLBACK
# ============================================================


def ai_generate_json(
    prompt,
    schema_name,
    schema,
    reasoning_effort="low"
):

    # ========================================================
    # GROQ
    # ========================================================

    if groq_client is not None:

        try:

            print(
                "AI Provider: GROQ"
            )

            start_time = time.time()


            response = (

                groq_client
                .chat
                .completions
                .create(

                    model=GROQ_MODEL,

                    messages=[

                        {

                            "role": "system",

                            "content": prompt
                        }
                    ],

                    response_format={

                        "type":
                            "json_schema",

                        "json_schema": {

                            "name":
                                schema_name,

                            "strict":
                                True,

                            "schema":
                                schema
                        }
                    },

                    reasoning_effort=
                        reasoning_effort,

                    temperature=0,

                    max_completion_tokens=1200
                )
            )


            elapsed = (
                time.time()
                -
                start_time
            )


            print(
                f"Groq response: {elapsed:.2f}s"
            )


            raw = (
                response
                .choices[0]
                .message
                .content
            )


            data = parse_ai_json(
                raw
            )


            print(
                "AI Provider used: GROQ"
            )


            return data


        except Exception as e:

            print(
                "Groq AI failed:"
            )

            print(e)

            print(
                "Trying Gemini fallback..."
            )


    # ========================================================
    # GEMINI
    # ========================================================

    if gemini_client is not None:

        try:

            print(
                "AI Provider: GEMINI FALLBACK"
            )

            start_time = time.time()


            response = (

                gemini_client
                .models
                .generate_content(

                    model=GEMINI_MODEL,

                    contents=prompt
                )
            )


            elapsed = (
                time.time()
                -
                start_time
            )


            print(
                f"Gemini response: {elapsed:.2f}s"
            )


            data = parse_ai_json(
                response.text
            )


            print(
                "AI Provider used: GEMINI"
            )


            return data


        except Exception as e:

            print(
                "Gemini fallback failed:"
            )

            print(e)


    print(
        "ERROR: Both Groq and Gemini failed."
    )


    return None


# ============================================================
# AI UNDERSTAND PROBLEM
# ============================================================


def ai_understand_problem(
    text,
    selected_category=""
):

    if selected_category:
        category_instruction = f"""Citizen selected category:
{selected_category}

4. problem_category must be exactly the citizen-selected category above. Do not replace it."""
    else:
        categories_list = "\n".join(SETU_CATEGORIES)
        category_instruction = f"""No category was pre-selected by the citizen. You must choose it yourself.

Official category list (choose exactly ONE, copied character-for-character):
{categories_list}

4. problem_category must be copied EXACTLY (same spelling, case, punctuation) from the list above - the single best match for the citizen's problem. Never invent a new category and never leave it blank."""

    prompt = f"""
You are SETU's civic problem understanding engine.

Understand the citizen's actual civic/community problem.

{category_instruction}

Citizen message:

"{text}"

The citizen may use:
- informal language
- spelling mistakes
- short sentences
- Tamil-English mixed language
- Hindi-English mixed language
- local expressions

Examples:

"big hole in road"
"road has huge pits"
"dangerous potholes"

all mean a road pothole problem.

RULES:

1. Understand meaning, not exact keywords.

2. problem_title must be short,
   standard and human-readable.

3. problem_type must be a broad civic category.

Examples:
Road Infrastructure
Water Supply
Waste Management
Street Lighting
Drainage
Public Transport
Electricity
Public Health
Sanitation
Education
Environment
Public Safety

5. severity must be exactly:
Low
Medium
High
Critical

5. urgency must be exactly:
Low
Medium
High
Critical

6. Do not invent facts.

7. Do not put location inside problem_title.

8. If this is clearly NOT a civic/community problem,
   understood must be false.

9. Return only structured data.

10. No explanation.
"""


    schema = {

        "type": "object",

        "properties": {

            "understood": {

                "type": "boolean"
            },

            "problem_title": {

                "type": "string"
            },

            "problem_type": {

                "type": "string"
            },

            "problem_category": {

                "type": "string"
            },

            "severity": {

                "type": "string",

                "enum": [

                    "Low",
                    "Medium",
                    "High",
                    "Critical"
                ]
            },

            "urgency": {

                "type": "string",

                "enum": [

                    "Low",
                    "Medium",
                    "High",
                    "Critical"
                ]
            }
        },

        "required": [

            "understood",
            "problem_title",
            "problem_type",
            "problem_category",
            "severity",
            "urgency"
        ],

        "additionalProperties":
            False
    }


    data = ai_generate_json(

        prompt,

        "setu_problem_understanding",

        schema,

        "low"
    )


    if data is None:

        return {

            "understood": False,

            "problem_title": "",

            "problem_type": "",

            "severity": "Medium",

            "urgency": "Medium"
        }


    data[
        "understood"
    ] = safe_bool(

        data.get(
            "understood",
            False
        )
    )


    data[
        "problem_title"
    ] = str(

        data.get(
            "problem_title",
            ""
        )
    ).strip()


    data[
        "problem_type"
    ] = str(

        data.get(
            "problem_type",
            ""
        )
    ).strip()

    data[
        "problem_category"
    ] = str(
        data.get(
            "problem_category",
            ""
        )
    ).strip()

    if selected_category:
        data["problem_category"] = selected_category
    else:
        # Auto-detected category: make sure it exactly matches one
        # of the official 45 categories (case-insensitive fallback
        # match), so downstream category filtering/display never
        # breaks on an AI typo or reworded category.
        detected = data["problem_category"]
        if detected not in SETU_CATEGORIES:
            match = next(
                (c for c in SETU_CATEGORIES if c.lower() == detected.lower()),
                None
            )
            data["problem_category"] = match or LEGACY_CATEGORY_LABEL


    data[
        "severity"
    ] = str(

        data.get(
            "severity",
            "Medium"
        )
    ).strip()


    data[
        "urgency"
    ] = str(

        data.get(
            "urgency",
            "Medium"
        )
    ).strip()


    allowed_levels = [

        "Low",
        "Medium",
        "High",
        "Critical"
    ]


    if data["severity"] not in allowed_levels:

        data["severity"] = "Medium"


    if data["urgency"] not in allowed_levels:

        data["urgency"] = "Medium"


    return data


# ============================================================
# AI SEVERITY + PRIORITY + CONFIDENCE + RESEARCH ASSESSMENT
# ============================================================
#
# This is a SEPARATE assessment from ai_understand_problem().
#
# It replaces the old simple Low/Medium/High/Critical labels
# with a full 0-100 scoring model made of independent factors,
# plus a Priority score, a Confidence score, and a Research
# classification. These four outputs are kept fully separate:
#
#   Severity   = how serious the problem could be
#   Priority   = how urgently government should act
#   Confidence = how sure SETU is about this assessment
#   Research   = whether solving it needs investigation/analysis
#                or only a standard, already-known procedure
#
# Community votes/support are NEVER an input to this function.
# They are a separate "Community Signal" tracked elsewhere
# (problem["votes"]). A popular but low-risk complaint must
# never be turned into a "Critical" issue by this function, and
# a dangerous but unpopular one must never be downgraded.
#
# This is a recommendation for the government dashboard, not an
# automatic decision. The government can always override it.
# ============================================================


SEVERITY_LEVELS = [
    "Very Low",
    "Low",
    "Moderate",
    "High",
    "Critical"
]

PRIORITY_LEVELS = [
    "Low",
    "Medium",
    "High",
    "Very High",
    "Critical"
]

RESEARCH_LABELS = [
    "RESEARCH_NEEDED",
    "RESEARCH_NOT_NEEDED"
]


def severity_score_to_level(score):

    score = safe_int(score, 0, 0, 100)

    if score <= 20:
        return "Very Low"

    if score <= 40:
        return "Low"

    if score <= 60:
        return "Moderate"

    if score <= 80:
        return "High"

    return "Critical"


def priority_score_to_level(score):

    score = safe_int(score, 0, 0, 100)

    if score <= 20:
        return "Low"

    if score <= 45:
        return "Medium"

    if score <= 70:
        return "High"

    if score <= 90:
        return "Very High"

    return "Critical"


def severity_level_to_legacy(level):

    # Maps the new 5-level severity/priority scale onto the
    # older Low/Medium/High/Critical enum still used by a few
    # legacy display paths and older database records, so both
    # systems keep working side by side.

    mapping = {
        "Very Low": "Low",
        "Low": "Low",
        "Moderate": "Medium",
        "High": "High",
        "Critical": "Critical"
    }

    return mapping.get(level, "Medium")


def priority_level_to_legacy(level):

    mapping = {
        "Low": "Low",
        "Medium": "Medium",
        "High": "High",
        "Very High": "High",
        "Critical": "Critical"
    }

    return mapping.get(level, "Medium")


def ai_assess_problem(
    problem_title,
    problem_type,
    problem_category,
    citizen_problem_statement,
    description,
    location
):

    combined_text = citizen_problem_statement or problem_title

    extra_description = (description or "").strip()

    prompt = f"""
You are SETU's civic problem severity, priority, confidence and
research-need assessment engine.

You NEVER see community votes/support. Do not consider popularity
at all. Judge the problem strictly on its own facts.

Problem title:
{problem_title}

Problem category (citizen-selected):
{problem_category}

Problem type:
{problem_type}

Citizen's own words describing the problem:
"{combined_text}"

Additional citizen-provided description (may be empty):
"{extra_description}"

Location text provided by the citizen:
"{location}"


TASK 1 - SEVERITY FACTORS

Score each factor using ONLY evidence present in the citizen's
own words. Do not invent facts. If a factor cannot be judged from
the text, score it low/neutral rather than guessing high.

A. life_safety_risk (0-25)
   Death, serious injury, accidents, fire, explosion, electrocution,
   structural collapse, dangerous live wires, drowning risk, etc.
   Pay special attention to DANGEROUS COMBINATIONS mentioned
   together in the text, for example:
     - exposed/sparking electrical wiring + rain/water/flooding
     - gas smell + fire/spark/ignition source nearby
     - damaged bridge/structure + heavy vehicle traffic
     - open manhole/deep pit + poor lighting/darkness/night
     - landslide-prone slope + heavy rain
   Such combinations should score much higher than either factor
   alone, because the combination multiplies the real danger.

B. health_risk (0-15)
   Contaminated water, sewage, disease risk, mosquito breeding,
   toxic substances, food contamination, sanitation failure.

C. people_affected_score (0-15)
   Estimate scale of impact from the text: a single house/person
   is low, a street/locality is moderate, an entire
   area/many households is high.

D. vulnerable_population_score (0-10)
   Increase only if the text mentions or clearly implies children,
   elderly people, persons with disabilities, a school, a hospital,
   or people dependent on the affected essential service.

E. urgency_score (0-10)
   How quickly harm could occur if nothing is done: can safely
   wait vs needs action within days vs needs immediate action.

F. environmental_impact_score (0-5)
   Air, water, soil, tree, wildlife or ecosystem impact.

G. economic_infrastructure_score (0-5)
   Damage/disruption to businesses, agriculture, transport,
   property, or public infrastructure.

H. escalation_risk_score (0-5)
   If nothing is done, how much worse could this realistically
   become? (e.g. a small blockage before heavy rain, a small
   crack that keeps growing, a minor leak near electrical wiring.)

I. critical_location_score (0-5)
   Increase only if the text indicates proximity to a hospital,
   school, major road, bridge, water/power infrastructure,
   emergency facility or public transport hub.

immediate_life_threat (true/false):
   true ONLY if the text describes a credible, immediate threat
   to life or serious injury happening right now (e.g. live wire
   in standing water, active fire, imminent collapse). This
   overrides everything else and forces Critical severity.


TASK 2 - CONFIDENCE

confidence_score (0-100): how confident SETU is that this
assessment is accurate, based on:
   - clarity and specificity of the citizen's description
   - whether the location is specific enough to act on
   - whether the described risk is plausible and internally
     consistent
   - absence of contradictions
This is SEPARATE from severity. A very dangerous-sounding but
vague, contradictory or unverifiable report should get LOW
confidence, not low severity. Do not reduce severity just
because confidence is low - instead set verification_required
to true.

verification_required (true/false): true if a field officer
should confirm this in person before action is taken (e.g. high
potential severity but vague description or location).


TASK 3 - PRIORITY

priority_score (0-100): how urgently the government should
consider acting, considering severity, urgency, vulnerability,
escalation risk, critical infrastructure and duration/frequency
mentioned in the text. Priority can differ from severity - e.g.
a very serious but currently stable structural issue can have
high severity but moderate priority, while a moderate drainage
issue right before heavy rain can have high priority despite
moderate severity.


TASK 4 - RESEARCH CLASSIFICATION

Classify the problem as exactly one of:
   RESEARCH_NEEDED
   RESEARCH_NOT_NEEDED

Use RESEARCH_NEEDED when the text shows:
   - the root cause is unknown, complex or needs investigation
   - the problem recurs even after normal repairs
   - no existing standard solution is adequate
   - solving it needs new/improved solutions, engineering,
     scientific, environmental or data analysis
   - it needs experiments, modelling, prototyping, pilots
   - it is a broader systemic issue, not a simple maintenance
     request

Use RESEARCH_NOT_NEEDED when the text shows a problem solvable by
an already-known standard procedure: routine repair/maintenance,
equipment replacement, regular cleaning/collection, standard
service delivery, enforcement of an existing rule, or a one-time
incident needing no investigation.

Do NOT mark RESEARCH_NEEDED just because a problem is severe,
urgent, expensive or affects many people. Research need is about
the NATURE of the solution, not the impact of the problem. A
single sparking electric post is RESEARCH_NOT_NEEDED (routine
electrical repair) even if severity is very high. A road that
floods every monsoon despite repeated drainage repairs is
RESEARCH_NEEDED (recurring root cause needs investigation) even
though it may not be immediately life-threatening.

research_reason: one short sentence explaining the classification.

overall_reasoning: one or two short sentences a government
official could read to understand the assessment at a glance.

Return only structured data. No extra text.
"""

    schema = {

        "type": "object",

        "properties": {

            "life_safety_risk": {"type": "integer", "minimum": 0, "maximum": 25},
            "health_risk": {"type": "integer", "minimum": 0, "maximum": 15},
            "people_affected_score": {"type": "integer", "minimum": 0, "maximum": 15},
            "vulnerable_population_score": {"type": "integer", "minimum": 0, "maximum": 10},
            "urgency_score": {"type": "integer", "minimum": 0, "maximum": 10},
            "environmental_impact_score": {"type": "integer", "minimum": 0, "maximum": 5},
            "economic_infrastructure_score": {"type": "integer", "minimum": 0, "maximum": 5},
            "escalation_risk_score": {"type": "integer", "minimum": 0, "maximum": 5},
            "critical_location_score": {"type": "integer", "minimum": 0, "maximum": 5},
            "immediate_life_threat": {"type": "boolean"},

            "confidence_score": {"type": "integer", "minimum": 0, "maximum": 100},
            "verification_required": {"type": "boolean"},

            "priority_score": {"type": "integer", "minimum": 0, "maximum": 100},

            "research_classification": {
                "type": "string",
                "enum": RESEARCH_LABELS
            },
            "research_reason": {"type": "string"},

            "overall_reasoning": {"type": "string"}
        },

        "required": [
            "life_safety_risk",
            "health_risk",
            "people_affected_score",
            "vulnerable_population_score",
            "urgency_score",
            "environmental_impact_score",
            "economic_infrastructure_score",
            "escalation_risk_score",
            "critical_location_score",
            "immediate_life_threat",
            "confidence_score",
            "verification_required",
            "priority_score",
            "research_classification",
            "research_reason",
            "overall_reasoning"
        ],

        "additionalProperties": False
    }

    data = ai_generate_json(
        prompt,
        "setu_problem_assessment",
        schema,
        "medium"
    )

    if data is None:

        # Safe fallback: moderate severity, low confidence, flag
        # for human verification instead of guessing.

        data = {
            "life_safety_risk": 0,
            "health_risk": 0,
            "people_affected_score": 0,
            "vulnerable_population_score": 0,
            "urgency_score": 0,
            "environmental_impact_score": 0,
            "economic_infrastructure_score": 0,
            "escalation_risk_score": 0,
            "critical_location_score": 0,
            "immediate_life_threat": False,
            "confidence_score": 30,
            "verification_required": True,
            "priority_score": 40,
            "research_classification": "RESEARCH_NOT_NEEDED",
            "research_reason": "AI assessment unavailable; default routine handling applied.",
            "overall_reasoning": "AI assessment engine was unavailable. Manual review recommended."
        }

    factor_keys = [
        "life_safety_risk",
        "health_risk",
        "people_affected_score",
        "vulnerable_population_score",
        "urgency_score",
        "environmental_impact_score",
        "economic_infrastructure_score",
        "escalation_risk_score",
        "critical_location_score"
    ]

    factor_max = {
        "life_safety_risk": 25,
        "health_risk": 15,
        "people_affected_score": 15,
        "vulnerable_population_score": 10,
        "urgency_score": 10,
        "environmental_impact_score": 5,
        "economic_infrastructure_score": 5,
        "escalation_risk_score": 5,
        "critical_location_score": 5
    }

    factors = {}

    for key in factor_keys:

        factors[key] = safe_int(
            data.get(key, 0),
            0,
            0,
            factor_max[key]
        )

    immediate_life_threat = safe_bool(
        data.get("immediate_life_threat", False)
    )

    severity_score = sum(factors.values())

    # --------------------------------------------------------
    # COMBINATION / OVERRIDE RULE
    # --------------------------------------------------------
    # An immediate, credible threat to life must always be
    # treated as Critical, regardless of the weighted total and
    # regardless of votes/popularity.
    # --------------------------------------------------------

    if immediate_life_threat:

        severity_score = max(severity_score, 90)

    severity_score = safe_int(severity_score, 0, 0, 100)

    severity_level = severity_score_to_level(severity_score)

    confidence_score = safe_int(
        data.get("confidence_score", 50),
        50,
        0,
        100
    )

    verification_required = safe_bool(
        data.get("verification_required", False)
    )

    # Rule: a high/critical severity report with low confidence
    # must always be flagged for verification, even if the AI
    # forgot to set the flag itself.

    if severity_score >= 61 and confidence_score < 60:

        verification_required = True

    priority_score = safe_int(
        data.get("priority_score", severity_score),
        severity_score,
        0,
        100
    )

    priority_level = priority_score_to_level(priority_score)

    research_classification = str(
        data.get("research_classification", "RESEARCH_NOT_NEEDED")
    ).strip().upper()

    if research_classification not in RESEARCH_LABELS:

        research_classification = "RESEARCH_NOT_NEEDED"

    research_reason = str(
        data.get("research_reason", "")
    ).strip()

    overall_reasoning = str(
        data.get("overall_reasoning", "")
    ).strip()

    return {
        "factors": factors,
        "immediate_life_threat": immediate_life_threat,
        "severity_score": severity_score,
        "severity_level": severity_level,
        "confidence_score": confidence_score,
        "verification_required": verification_required,
        "priority_score": priority_score,
        "priority_level": priority_level,
        "research_classification": research_classification,
        "research_reason": research_reason,
        "overall_reasoning": overall_reasoning,
        "assessed_at": utc_now()
    }


# ============================================================
# AI LOCATION + DUPLICATE DETECTION
# ============================================================


def ai_validate_location_and_find_duplicate(

    problem_title,

    problem_type,

    location_text
):

    # --------------------------------------------------------
    # IMPORTANT LOCATION-SOURCE NOTE (SMS channel):
    #
    # An ordinary SMS from a button phone carries NO GPS
    # coordinates. Every location handled here is a
    # CITIZEN-PROVIDED TEXT ADDRESS (street/landmark/town/
    # district/PIN), never GPS-confirmed. The "normalized_
    # location" produced below is an AI-cleaned-up version of
    # that same citizen text - not an independently verified or
    # geocoded coordinate. These three are different things and
    # must never be presented to the government as equivalent:
    #
    #   1. Citizen-provided address text   (what was typed)
    #   2. AI-normalized address           (cleaned-up text)
    #   3. GPS-confirmed coordinates       (NOT available on SMS)
    # --------------------------------------------------------

    all_problems = db.get_problems()


    candidate_lines = []


    for problem_id, problem in all_problems.items():

        candidate_lines.append(

            f"{problem_id} | "
            f"Title: {problem.get('title', '')} | "
            f"Type: {problem.get('problem_type', '')} | "
            f"Issue: {problem.get('issue', '')} | "
            f"Location: {problem.get('location', '')}"
        )


    candidates = "\n".join(
        candidate_lines
    )


    prompt = f"""
You are SETU's location validation and duplicate detection engine.

Problem title:
{problem_title}

Problem type:
{problem_type}

Citizen location:
"{location_text}"

Existing community problems:

{candidates}


TASK 1 — LOCATION VALIDATION

Determine whether the location contains enough
information to identify a meaningful real-world area.

Useful combinations include:

street/road + town/city

OR

landmark + town/city

OR

street/road + district

OR

clearly identifiable local area.

Vague locations such as:
"somewhere"
"near my house"
"my area"
"there"
"here"

should normally be invalid.

Do NOT invent location information.

Normalize the location into a short readable form.


TASK 2 — DUPLICATE DETECTION

Determine whether the citizen's report describes
the SAME UNDERLYING LOCAL COMMUNITY PROBLEM as one
existing problem.

Use BOTH:

1. Semantic similarity
2. Geographic similarity


IMPORTANT:

- Exact address matching is not required.
- Same road or nearby landmark can indicate a match.
- Same town/city can help.
- Same category alone is NOT enough.
- Same problem type in different cities should normally
  NOT be considered duplicate.
- A pothole on two completely different roads should
  normally be separate.
- Broad problems such as water, garbage, sanitation
  and electricity require strong geographic similarity.
- When uncertain, do NOT match.
- Return only the strongest single match.
- Never invent a Problem ID.


If there is no convincing duplicate:

match_found = false
problem_id = ""
confidence = 0


Return only structured data.
"""


    schema = {

        "type": "object",

        "properties": {

            "valid_location": {

                "type": "boolean"
            },

            "street": {

                "type": "string"
            },

            "landmark": {

                "type": "string"
            },

            "town": {

                "type": "string"
            },

            "district": {

                "type": "string"
            },

            "normalized_location": {

                "type": "string"
            },

            "match_found": {

                "type": "boolean"
            },

            "problem_id": {

                "type": "string"
            },

            "confidence": {

                "type": "integer",

                "minimum": 0,

                "maximum": 100
            },

            "reason": {

                "type": "string"
            }
        },

        "required": [

            "valid_location",

            "street",

            "landmark",

            "town",

            "district",

            "normalized_location",

            "match_found",

            "problem_id",

            "confidence",

            "reason"
        ],

        "additionalProperties":
            False
    }


    data = ai_generate_json(

        prompt,

        "setu_location_duplicate_detection",

        schema,

        "medium"
    )


    if data is None:

        return {

            "valid_location": False,

            "street": "",

            "landmark": "",

            "town": "",

            "district": "",

            "normalized_location": "",

            "match_found": False,

            "problem_id": "",

            "confidence": 0,

            "reason": ""
        }


    data[
        "valid_location"
    ] = safe_bool(

        data.get(
            "valid_location",
            False
        )
    )


    for field in [

        "street",
        "landmark",
        "town",
        "district",
        "normalized_location",
        "problem_id",
        "reason"

    ]:

        data[field] = str(

            data.get(
                field,
                ""
            )
        ).strip()


    data[
        "match_found"
    ] = safe_bool(

        data.get(
            "match_found",
            False
        )
    )


    data[
        "confidence"
    ] = safe_int(

        data.get(
            "confidence",
            0
        ),

        minimum=0,

        maximum=100
    )


    # --------------------------------------------------------
    # SAFETY CHECK
    # --------------------------------------------------------

    if data["problem_id"] not in all_problems:

        data["match_found"] = False

        data["problem_id"] = ""

        data["confidence"] = 0

        data["reason"] = ""


    if not data["match_found"]:

        data["problem_id"] = ""

        data["confidence"] = 0


    return data


# ============================================================
# PROBLEM UNDERSTOOD MESSAGE
# ============================================================


def problem_understood_message(
    sender,
    problem_title
):

    language = get_language(
        sender
    )


    if language == "tamil":

        return f"""பிரச்சினை புரிந்துகொள்ளப்பட்டது:

{problem_title}

இப்போது கூடுதல் விளக்கத்தை வழங்கலாம்.

விளக்கம் விருப்பமானது.
விளக்கம் வழங்க விரும்பவில்லை என்றால் SKIP என்று அனுப்பவும்."""


    if language == "hindi":

        return f"""समस्या समझ ली गई:

{problem_title}

अब आप अतिरिक्त विवरण दे सकते हैं।

विवरण देना वैकल्पिक है।
विवरण नहीं देना चाहते हैं तो SKIP भेजें।"""


    return f"""Problem understood:

{problem_title}

You can now provide additional details.

Description is optional.
If you don't want to provide one, reply SKIP."""


# ============================================================
# INVALID LOCATION
# ============================================================


def invalid_location_message(
    sender
):

    language = get_language(
        sender
    )


    if language == "tamil":

        return """இட விவரம் போதுமானதாக இல்லை.

தயவுசெய்து சாலை / தெரு, அருகிலுள்ள முக்கிய இடம், நகரம் / கிராமம் அல்லது மாவட்டம் போன்ற கூடுதல் தகவல்களை வழங்கவும்.

உதாரணம்:
காங்கேயம் சாலை, அரசு மருத்துவமனை அருகில், திருப்பூர், திருப்பூர் மாவட்டம்

ரத்து செய்ய 0 அனுப்பவும்."""


    if language == "hindi":

        return """स्थान की जानकारी पर्याप्त नहीं है।

कृपया सड़क / गली, पास का प्रमुख स्थान, शहर / गाँव या जिला जैसी अधिक जानकारी दें।

उदाहरण:
कांगयम रोड, सरकारी अस्पताल के पास, तिरुपुर, तिरुपुर जिला

रद्द करने के लिए 0 भेजें।"""


    return """The location details are not sufficient.

Please provide more information such as the road/street, nearby landmark, town/village or district.

Example:
Kangeyam Road, near Government Hospital, Tirupur, Tirupur District

Reply 0 to cancel."""


# ============================================================
# SIMILAR PROBLEM MESSAGE
# ============================================================


def similar_problem_message(
    sender,
    match
):

    language = get_language(
        sender
    )


    problem_id = match[
        "problem_id"
    ]

    confidence = match[
        "confidence"
    ]


    problem = db.get_problem(
        problem_id
    )


    if problem is None:

        return invalid_input(
            sender
        )


    if language == "tamil":

        return f"""இதே போன்ற சமூகப் பிரச்சினை கண்டறியப்பட்டுள்ளது.

{problem_id} {problem['title']}

இடம்:
{problem['location']}

சமூக ஆதரவு: {problem['votes']}

AI பொருத்தம்: {confidence}%

இது அதே பிரச்சினையா?

1. ஆம், {problem_id} ஐ ஆதரிக்கவும்
2. இல்லை, புதிய பிரச்சினையாகப் பதிவு செய்யவும்
0. பின்செல்லவும்"""


    if language == "hindi":

        return f"""इसी तरह की सामुदायिक समस्या मिली।

{problem_id} {problem['title']}

स्थान:
{problem['location']}

सामुदायिक समर्थन: {problem['votes']}

AI मिलान: {confidence}%

क्या यह वही समस्या है?

1. हाँ, {problem_id} का समर्थन करें
2. नहीं, नई समस्या दर्ज करें
0. रद्द करें"""


    return f"""Similar Community Problem Found

{problem_id} {problem['title']}

Location:
{problem['location']}

Community Support: {problem['votes']}

AI Match Confidence: {confidence}%

Is this the same underlying problem?

1. Yes, Support {problem_id}
2. No, Report as a New Problem
0. Back"""


# ============================================================
# SUPPORT PROBLEM
# ============================================================


def support_problem(
    sender,
    problem_id
):

    user = get_user(
        sender
    )

    language = get_language(
        sender
    )


    problem = db.get_problem(
        problem_id
    )


    if problem is None:

        user[
            "state"
        ] = "MAIN_MENU"

        save_user(
            sender,
            user
        )

        return invalid_input(
            sender
        )


    # --------------------------------------------------------
    # Check duplicate support.
    # --------------------------------------------------------

    if problem_id in user.get(
        "supported_problems",
        []
    ):

        votes = problem.get(
            "votes",
            0
        )


        if language == "tamil":

            return f"""நீங்கள் ஏற்கனவே {problem_id} ஐ ஆதரித்துள்ளீர்கள்.

சமூக ஆதரவு: {votes}

ஒரு குடிமகன் ஒரு பிரச்சினையை ஒருமுறை மட்டுமே ஆதரிக்க முடியும்.

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


        if language == "hindi":

            return f"""आप पहले ही {problem_id} का समर्थन कर चुके हैं।

सामुदायिक समर्थन: {votes}

एक नागरिक किसी समस्या का केवल एक बार समर्थन कर सकता है।

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


        return f"""You have already supported {problem_id}.

Community Support: {votes}

Each citizen can support a problem only once.

Reply 0 for Main Menu.
#. Main Menu"""


    # --------------------------------------------------------
    # Database-level duplicate protection.
    # --------------------------------------------------------

    added = db.add_support(

        sender,

        problem_id
    )


    if not added:

        return f"""You have already supported {problem_id}.

Each citizen can support a problem only once.

Reply 0 for Main Menu.
#. Main Menu"""


    # --------------------------------------------------------
    # Update user's support list.
    # --------------------------------------------------------

    if problem_id not in user[
        "supported_problems"
    ]:

        user[
            "supported_problems"
        ].append(
            problem_id
        )


    user[
        "selected_problem"
    ] = ""

    user[
        "duplicate_match"
    ] = None

    user[
        "state"
    ] = "MAIN_MENU"


    save_user(
        sender,
        user
    )


    # --------------------------------------------------------
    # Read updated problem.
    # --------------------------------------------------------

    problem = db.get_problem(
        problem_id
    )

    votes = problem.get(
        "votes",
        0
    )


    if language == "tamil":

        return f"""சமூக ஆதரவு சேர்க்கப்பட்டது.

பிரச்சினை: {problem_id}

சமூக ஆதரவு: {votes}

உங்கள் ஆதரவு உடனடியாகச் சேர்க்கப்பட்டது.

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


    if language == "hindi":

        return f"""सामुदायिक समर्थन जोड़ दिया गया।

समस्या: {problem_id}

सामुदायिक समर्थन: {votes}

आपका समर्थन तुरंत जोड़ दिया गया है।

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


    return f"""Community support added.

Problem: {problem_id}

Community Support: {votes}

Your upvote has been added immediately.

Reply 0 for Main Menu.
#. Main Menu"""


# ============================================================
# CREATE NEW REPORT
# ============================================================


def create_report(sender):

    user = get_user(sender)

    problem_title = user["temp_problem"]
    citizen_problem_statement = user.get("temp_problem_statement", "")
    description = user["temp_description"].strip()
    location = user["temp_location"]
    location_original = user.get("temp_location_original", location)
    ai_data = user.get("temp_ai_data", {})

    try:
        report_id = db.next_report_id()
        problem_id = db.next_problem_id()
    except Exception as e:
        print("Database ID generation failed:", e)
        return database_error_message(sender)

    problem_type = ai_data.get("problem_type", "Community Problem")
    problem_category = user.get("temp_category", "Community Problem")
    now = utc_now()

    # --------------------------------------------------------
    # ORIGINAL CITIZEN INPUT - stored exactly as given.
    #
    # This must never be overwritten by AI-derived data. If the
    # AI's understanding of the problem changes in the future
    # (re-processing, model upgrade, correction), the citizen's
    # own words remain untouched here for audit purposes.
    # --------------------------------------------------------

    citizen_input = {
        "raw_problem_statement": citizen_problem_statement,
        "selected_category": problem_category,
        "raw_description": description,
        "raw_location_text": location_original,
        "reporter_phone": sender,
        "submitted_at": now
    }

    # --------------------------------------------------------
    # AI ASSESSMENT - severity / priority / confidence / research.
    #
    # Kept as a separate, additional block. Community votes are
    # intentionally NOT passed in here and never affect it.
    # --------------------------------------------------------

    print("AI: Assessing severity, priority, confidence and research need...")

    assessment = ai_assess_problem(
        problem_title,
        problem_type,
        problem_category,
        citizen_problem_statement,
        description,
        location
    )

    # Legacy fields kept for backward compatibility with any
    # display/database code that still expects a simple
    # Low/Medium/High/Critical label instead of the 0-100 score.

    legacy_severity = severity_level_to_legacy(assessment["severity_level"])
    legacy_urgency = priority_level_to_legacy(assessment["priority_level"])

    problem = {
        "title": problem_title,
        "category": problem_category,
        "location": location,
        "citizen_location": location_original,
        "issue": citizen_problem_statement or problem_title,
        "description": description,
        "problem_type": problem_type,

        # Legacy simple fields (kept so older code/records keep working).
        "severity": legacy_severity,
        "urgency": legacy_urgency,

        # Full assessment (audit trail, version 1). Future
        # re-assessments should be APPENDED to this list, never
        # overwrite an existing entry.
        "assessment_history": [
            dict(assessment, version=1)
        ],

        # Original, unmodified citizen input for audit purposes.
        "citizen_input": citizen_input,

        "votes": 0,
        "status": "AI Verification",
        "report_id": report_id,
        "reporter": sender,
        "created_at": now
    }

    report = {
        "problem_id": problem_id,
        "problem": problem_title,
        "category": problem_category,
        "citizen_problem_statement": citizen_problem_statement,
        "description": description,
        "location": location,
        "citizen_location": location_original,
        "status": "AI Verification",
        "reporter": sender,
        "severity": legacy_severity,
        "urgency": legacy_urgency,
        "assessment_history": [
            dict(assessment, version=1)
        ],
        "citizen_input": citizen_input,
        "problem_type": problem_type,
        "created_at": now
    }

    try:
        db.save_problem(problem_id, problem)
        db.save_report(report_id, report)
    except Exception as e:
        print("Database write failed:", e)
        return database_error_message(sender)

    user["reports"].append(report_id)
    reset_report_flow(user)
    user["state"] = "MAIN_MENU"
    save_user(sender, user)

    return f"""Your report has been submitted successfully!

Report ID: {report_id}
Problem ID: {problem_id}

Category:
{problem_category}

Problem:
{problem_title}

Location:
{location}

Your report is now visible in Community Problems under "{problem_category}" - other citizens can see it and add their support.

Reply 0 for Main Menu.
#. Main Menu"""


def database_error_message(
    sender
):

    language = get_language(
        sender
    )


    if language == "tamil":

        return """மன்னிக்கவும்.

உங்கள் தகவலை தற்போது சேமிக்க முடியவில்லை.

தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."""


    if language == "hindi":

        return """क्षमा करें।

आपकी जानकारी अभी सहेजी नहीं जा सकी।

कृपया कुछ समय बाद फिर प्रयास करें."""


    return """Sorry.

We could not save your information right now.

Please try again later."""


# ============================================================
# STATUS MENU
# ============================================================


def status_menu(sender):

    language = get_language(
        sender
    )


    if language == "tamil":

        return """புகார் நிலையைப் பார்க்கவும்

உங்கள் Report ID ஐ அனுப்பவும்.

உதாரணம்:
SETU1025

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


    if language == "hindi":

        return """रिपोर्ट की स्थिति देखें

अपना Report ID भेजें।

उदाहरण:
SETU1025

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


    return """Check Report Status

Enter your Report ID.

Example:
SETU1025

Reply 0 for Main Menu.
#. Main Menu"""


# ============================================================
# SHOW REPORT STATUS
# ============================================================


def show_report_status(
    sender,
    report_id
):

    language = get_language(
        sender
    )

    report_id = report_id.upper().strip()


    report = db.get_report(
        report_id
    )


    if report is None:

        if language == "tamil":

            return """இந்த Report ID கிடைக்கவில்லை.

ID ஐ சரிபார்த்து மீண்டும் அனுப்பவும்.

உதாரணம்:
SETU1025

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


        if language == "hindi":

            return """यह Report ID नहीं मिली।

ID जाँचकर फिर भेजें।

उदाहरण:
SETU1025

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


        return """We couldn't find that Report ID.

Please check the ID and try again.

Example:
SETU1025

Reply 0 for Main Menu.
#. Main Menu"""


    problem_id = report[
        "problem_id"
    ]


    problem = db.get_problem(
        problem_id
    )


    votes = 0


    if problem:

        votes = problem.get(
            "votes",
            0
        )


    status = citizen_status_label(
        report[
            "status"
        ]
    )


    if language == "tamil":

        return f"""புகார்: {report_id}

பிரச்சினை:
{report['problem']}

இடம்:
{report['location']}

நிலை:
{status}

முன்னேற்றம்:

✓ புகார் பெறப்பட்டது
→ தற்போதைய நிலை: {status}
→ அடுத்தது: அரசு பரிசீலனை
→ அடுத்து: தீர்வு உருவாக்கம்
→ அடுத்து: Pilot
→ அடுத்து: செயல்படுத்தல்

சமூக ஆதரவு: {votes}

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


    if language == "hindi":

        return f"""रिपोर्ट: {report_id}

समस्या:
{report['problem']}

स्थान:
{report['location']}

स्थिति:
{status}

प्रगति:

✓ रिपोर्ट प्राप्त हुई
→ वर्तमान स्थिति: {status}
→ अगला: सरकारी समीक्षा
→ फिर: समाधान विकास
→ फिर: Pilot
→ फिर: कार्यान्वयन

सामुदायिक समर्थन: {votes}

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


    return f"""Report: {report_id}

Problem:
{report['problem']}

Location:
{report['location']}

Status:
{status}

Progress:

✓ Report Received
→ Current: {status}
→ Next: Government Review
→ Then: Solution Development
→ Then: Pilot
→ Then: Deployment

Community Support: {votes}

Reply 0 for Main Menu.
#. Main Menu"""


# ============================================================
# COMMUNITY PROBLEMS
# ============================================================


def show_problems(sender):
    return community_category_menu(sender, 0)


def get_active_categories(problems):

    # Every category that has at least one real problem in it,
    # in the same order as SETU_CATEGORIES, followed by the
    # legacy bucket (if any old/unmatched record exists) and any
    # other imported category not part of the official 45-list.

    present = set()

    for p in problems.values():

        present.add(get_problem_category(p))

    ordered = [c for c in SETU_CATEGORIES if c in present]

    extra = sorted(c for c in present if c not in SETU_CATEGORIES and c != LEGACY_CATEGORY_LABEL)

    ordered.extend(extra)

    if LEGACY_CATEGORY_LABEL in present:

        ordered.append(LEGACY_CATEGORY_LABEL)

    return ordered


def community_category_menu(sender, page=0):
    language = get_language(sender)
    user = get_user(sender)
    problems = db.get_problems()

    active = get_active_categories(problems)

    if not active:
        return "There are currently no community problems.\n\nReply 0 to go back.\n#. Main Menu"

    total_pages = (len(active) + CATEGORY_PAGE_SIZE - 1) // CATEGORY_PAGE_SIZE
    page = safe_int(page, 0, 0, total_pages - 1)
    user["state"] = "COMMUNITY_CATEGORIES"
    user["community_page"] = page
    save_user(sender, user)

    current = active[page * CATEGORY_PAGE_SIZE:(page + 1) * CATEGORY_PAGE_SIZE]
    if language == "tamil":
        out = ["சமூகப் பிரச்சினைகள் - வகைகள்", "", f"பக்கம் {page + 1}/{total_pages}", ""]
    elif language == "hindi":
        out = ["सामुदायिक समस्याएँ - श्रेणियाँ", "", f"पृष्ठ {page + 1}/{total_pages}", ""]
    else:
        out = ["Community Problems - Categories", "", f"Page {page + 1}/{total_pages}", ""]
    for n, c in enumerate(current, 1):
        count = sum(1 for p in problems.values() if get_problem_category(p) == c)
        out.append(f"{n}. {c} ({count})")
    out.append("")
    if page < total_pages - 1:
        out.append("9. Next Page")
    if page > 0:
        out.append("8. Previous Page")
    out.append("0. Back")
    return "\n".join(out)


def process_community_categories(sender, text):
    user = get_user(sender)
    problems = db.get_problems()
    active = get_active_categories(problems)
    if not active:
        return community_category_menu(sender, 0)

    page = safe_int(user.get("community_page", 0), 0, 0)
    total_pages = (len(active) + CATEGORY_PAGE_SIZE - 1) // CATEGORY_PAGE_SIZE
    page = min(page, total_pages - 1)
    current = active[page * CATEGORY_PAGE_SIZE:(page + 1) * CATEGORY_PAGE_SIZE]

    if text == "9" and page < total_pages - 1:
        return community_category_menu(sender, page + 1)
    if text == "8" and page > 0:
        return community_category_menu(sender, page - 1)

    try:
        choice = int(text)
    except ValueError:
        return community_category_menu(sender, page)

    if 1 <= choice <= len(current):
        user["community_category"] = current[choice - 1]
        user["community_page"] = 0
        save_user(sender, user)
        return community_problem_menu(sender, current[choice - 1], 0)

    return community_category_menu(sender, page)


def community_problem_menu(sender, category, page=0):
    language = get_language(sender)
    user = get_user(sender)
    problems = db.get_problems()
    matching = [(pid, p) for pid, p in problems.items() if get_problem_category(p) == category]

    if not matching:
        return community_category_menu(sender, user.get("community_page", 0))

    total_pages = (len(matching) + COMMUNITY_PROBLEM_PAGE_SIZE - 1) // COMMUNITY_PROBLEM_PAGE_SIZE
    page = safe_int(page, 0, 0, total_pages - 1)
    user["state"] = "COMMUNITY_PROBLEMS"
    user["community_category"] = category
    user["community_page"] = page
    save_user(sender, user)

    current = matching[page * COMMUNITY_PROBLEM_PAGE_SIZE:(page + 1) * COMMUNITY_PROBLEM_PAGE_SIZE]
    if language == "tamil":
        out = [category, "", f"பக்கம் {page + 1}/{total_pages}", ""]
    elif language == "hindi":
        out = [category, "", f"पृष्ठ {page + 1}/{total_pages}", ""]
    else:
        out = [category, "", f"Page {page + 1}/{total_pages}", ""]

    for pid, p in current:
        out.append(f"{pid} {p.get('title', '')}")
        if language == "tamil":
            out.append(f"இடம்: {p.get('location', '')}")
            out.append(f"ஆதரவு: {p.get('votes', 0)}")
        elif language == "hindi":
            out.append(f"स्थान: {p.get('location', '')}")
            out.append(f"समर्थन: {p.get('votes', 0)}")
        else:
            out.append(f"Location: {p.get('location', '')}")
            out.append(f"Support: {p.get('votes', 0)}")
        out.append("")

    out.append(
        "விவரங்களுக்கு Problem ID அனுப்பவும்." if language == "tamil"
        else "विवरण के लिए Problem ID भेजें।" if language == "hindi"
        else "Reply with a Problem ID for details."
    )
    if page < total_pages - 1:
        out.append("9. அடுத்த பக்கம்" if language == "tamil" else "9. अगला पृष्ठ" if language == "hindi" else "9. Next Page")
    if page > 0:
        out.append("8. முந்தைய பக்கம்" if language == "tamil" else "8. पिछला पृष्ठ" if language == "hindi" else "8. Previous Page")
    out.append("0. வகைகளுக்கு பின்செல்லவும்" if language == "tamil" else "0. श्रेणियों पर वापस जाएँ" if language == "hindi" else "0. Back to Categories")
    return "\n".join(out)


def process_community_problems(sender, text):
    user = get_user(sender)
    category = user.get("community_category", "")
    page = safe_int(user.get("community_page", 0), 0, 0)
    if text == "9":
        return community_problem_menu(sender, category, page + 1)
    if text == "8" and page > 0:
        return community_problem_menu(sender, category, page - 1)

    if re.fullmatch(r"#?\d+", text):
        pid = "#" + re.sub(r"[^0-9]", "", text)
        problem = db.get_problem(pid)
        if problem and get_problem_category(problem) == category:
            user["selected_problem"] = pid
            user["state"] = "PROBLEM_DETAILS"
            save_user(sender, user)
            return problem_details(sender, pid)

    return community_problem_menu(sender, category, page)


def get_latest_assessment(problem):

    history = problem.get("assessment_history", [])

    if history:

        return history[-1]

    return None


def assessment_display_lines(problem, language):

    # Builds the Severity/Priority/Confidence/Research block.
    #
    # Community votes are shown separately (Community Support)
    # and are never mixed into this block, so that a popular but
    # low-risk report is never confused with a genuinely severe
    # but less-voted one.

    assessment = get_latest_assessment(problem)

    if assessment is None:

        # Legacy record (created before the full assessment
        # engine existed, e.g. seeded demo data). Fall back to
        # the simple Low/Medium/High/Critical fields so nothing
        # disappears from the display.

        severity = problem.get("severity", "Medium")
        urgency = problem.get("urgency", "Medium")

        if language == "tamil":
            return [f"Severity: {severity}", f"Urgency: {urgency}"]

        if language == "hindi":
            return [f"Severity: {severity}", f"Urgency: {urgency}"]

        return [f"Severity: {severity}", f"Urgency: {urgency}"]

    severity_line = f"Severity: {assessment['severity_level']} ({assessment['severity_score']}/100)"
    priority_line = f"Priority: {assessment['priority_level']} ({assessment['priority_score']}/100)"
    confidence_line = f"Confidence: {assessment['confidence_score']}%"

    if assessment["research_classification"] == "RESEARCH_NEEDED":

        if language == "tamil":
            research_label = "ஆராய்ச்சி தேவை"
        elif language == "hindi":
            research_label = "अनुसंधान आवश्यक"
        else:
            research_label = "Research Needed"

    else:

        if language == "tamil":
            research_label = "ஆராய்ச்சி தேவையில்லை"
        elif language == "hindi":
            research_label = "अनुसंधान आवश्यक नहीं"
        else:
            research_label = "Research Not Needed"

    research_line = f"Research: {research_label}"

    lines = [severity_line, priority_line, confidence_line, research_line]

    if assessment.get("verification_required"):

        if language == "tamil":
            lines.append("சரிபார்ப்பு தேவை: ஆம்")
        elif language == "hindi":
            lines.append("सत्यापन आवश्यक: हाँ")
        else:
            lines.append("Verification Required: Yes")

    return lines


def problem_details(
    sender,
    problem_id
):

    problem = db.get_problem(
        problem_id
    )


    if problem is None:

        return invalid_input(
            sender
        )


    language = get_language(
        sender
    )


    description = problem.get(
        "description",
        problem.get(
            "issue",
            ""
        )
    )

    assessment_block = "\n".join(assessment_display_lines(problem, language))


    if language == "tamil":

        return f"""பிரச்சினை {problem_id}

{problem['title']}

இடம்:
{problem['location']}

வகை:
{problem.get('problem_type', 'Community Problem')}

விளக்கம்:
{description}

{assessment_block}

சமூக ஆதரவு:
{problem.get('votes', 0)}

நிலை:
{citizen_status_label(problem.get('status', ''))}

1. இந்த பிரச்சினையை ஆதரிக்கவும்
0. பின்செல்லவும்"""


    if language == "hindi":

        return f"""समस्या {problem_id}

{problem['title']}

स्थान:
{problem['location']}

समस्या का प्रकार:
{problem.get('problem_type', 'Community Problem')}

विवरण:
{description}

{assessment_block}

सामुदायिक समर्थन:
{problem.get('votes', 0)}

स्थिति:
{citizen_status_label(problem.get('status', ''))}

1. इस समस्या का समर्थन करें
0. वापस जाएँ"""


    return f"""Problem {problem_id}

{problem['title']}

Location:
{problem['location']}

Problem Type:
{problem.get('problem_type', 'Community Problem')}

Description:
{description}

{assessment_block}

Community Support:
{problem.get('votes', 0)}

Status:
{citizen_status_label(problem.get('status', ''))}

1. Support This Problem
0. Back"""


# ============================================================
# MY REPORTS
# ============================================================


def my_reports(sender):

    user = get_user(
        sender
    )

    language = get_language(
        sender
    )


    report_ids = user.get(
        "reports",
        []
    )


    if len(report_ids) == 0:

        if language == "tamil":

            return """எனது புகார்கள்

இதுவரை நீங்கள் எந்தப் பிரச்சினையையும் பதிவு செய்யவில்லை.

பிரச்சினையை பதிவு செய்ய 1 அனுப்பவும்.

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


        if language == "hindi":

            return """मेरी रिपोर्ट

आपने अभी तक कोई समस्या दर्ज नहीं की है।

समस्या दर्ज करने के लिए 1 भेजें।

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


        return """My Reports

You have not submitted any problems yet.

Reply 1 to report a problem.

Reply 0 for Main Menu.
#. Main Menu"""


    if language == "tamil":

        message = (
            "எனது புகார்கள்\n\n"
        )


        for report_id in report_ids:

            report = db.get_report(
                report_id
            )


            if report:

                message += (

                    f"{report_id}\n"

                    f"{report['problem']}\n"

                    f"நிலை: "
                    f"{citizen_status_label(report['status'])}\n\n"
                )


        message += (
            "விவரங்களுக்கு Report ID அனுப்பவும்.\n"
            "முதன்மை மெனுவிற்கு 0 அனுப்பவும்.\n#. முதன்மை மெனு"
        )


        return message


    if language == "hindi":

        message = (
            "मेरी रिपोर्ट\n\n"
        )


        for report_id in report_ids:

            report = db.get_report(
                report_id
            )


            if report:

                message += (

                    f"{report_id}\n"

                    f"{report['problem']}\n"

                    f"स्थिति: "
                    f"{citizen_status_label(report['status'])}\n\n"
                )


        message += (
            "विवरण के लिए Report ID भेजें।\n"
            "मुख्य मेनू के लिए 0 भेजें।"
        )


        return message


    message = (
        "My Reports\n\n"
    )


    for report_id in report_ids:

        report = db.get_report(
            report_id
        )


        if report:

            message += (

                f"{report_id}\n"

                f"{report['problem']}\n"

                f"Status: "
                f"{citizen_status_label(report['status'])}\n\n"
            )


    message += (
        "Enter a Report ID for details.\n"
        "Reply 0 for Main Menu.\n#. Main Menu"
    )


    return message


# ============================================================
# INVALID INPUT
# ============================================================


def invalid_input(sender):

    language = get_language(
        sender
    )


    if language == "tamil":

        return """மன்னிக்கவும், புரிந்துகொள்ள முடியவில்லை.

மெனுவில் உள்ள எண்ணை அனுப்பவும் அல்லது உங்கள் பிரச்சினையை உங்கள் சொந்த வார்த்தைகளில் தெரிவிக்கவும்.

முதன்மை மெனுவிற்கு 0 அனுப்பவும்.
#. முதன்மை மெனு"""


    if language == "hindi":

        return """क्षमा करें, मैं समझ नहीं पाया।

मेनू में से कोई नंबर भेजें या अपनी समस्या अपने शब्दों में बताएं।

मुख्य मेनू के लिए 0 भेजें।
#. मुख्य मेनू"""


    return """Sorry, I didn't understand that.

Choose an option from the menu or describe your problem in your own words.

Reply 0 for Main Menu.
#. Main Menu"""


# ============================================================
# PROCESS REPORTING
# ============================================================


def process_reporting(sender, text):

    user = get_user(sender)

    # Category is no longer picked by the citizen. The AI reads
    # the free-text problem statement and assigns the closest
    # matching category from the official 45-category list on
    # its own (see ai_understand_problem).
    result = ai_understand_problem(text, "")

    if not result.get("understood"):
        return invalid_input(sender)

    problem_title = result.get("problem_title", "").strip()
    if not problem_title:
        return invalid_input(sender)

    user["temp_category"] = result.get("problem_category", "").strip()
    user["temp_problem"] = problem_title
    user["temp_problem_statement"] = text.strip()
    user["temp_ai_data"] = result
    user["temp_description"] = ""
    save_user(sender, user)
    return ask_report_description(sender)


def process_report_description(
    sender,
    text
):

    user = get_user(
        sender
    )


    # --------------------------------------------------------
    # DESCRIPTION IS OPTIONAL
    # --------------------------------------------------------

    if text.strip().upper() == "SKIP":

        user[
            "temp_description"
        ] = ""

    else:

        user[
            "temp_description"
        ] = text.strip()


    save_user(
        sender,
        user
    )


    return location_menu(
        sender
    )


# ============================================================
# PROCESS LOCATION
# ============================================================


def process_location(
    sender,
    text
):

    user = get_user(
        sender
    )


    print(
        "AI: Validating location and checking duplicates..."
    )


    result = ai_validate_location_and_find_duplicate(

        user[
            "temp_problem"
        ],

        user[
            "temp_ai_data"
        ].get(
            "problem_type",
            ""
        ),

        text
    )


    if not result.get(
        "valid_location"
    ):

        return invalid_location_message(
            sender
        )


    location = result.get(

        "normalized_location",

        ""
    ).strip()


    if not location:

        location = text.strip()


    user[
        "temp_location"
    ] = location

    user[
        "temp_location_original"
    ] = text.strip()


    # --------------------------------------------------------
    # Duplicate
    # --------------------------------------------------------

    if result.get(
        "match_found"
    ):

        problem_id = result.get(

            "problem_id",

            ""
        )


        confidence = safe_int(

            result.get(
                "confidence",
                0
            ),

            minimum=0,

            maximum=100
        )


        if db.get_problem(
            problem_id
        ) is not None:

            match = {

                "problem_id":
                    problem_id,

                "confidence":
                    confidence,

                "reason":
                    result.get(
                        "reason",
                        ""
                    )
            }


            user[
                "selected_problem"
            ] = problem_id


            user[
                "duplicate_match"
            ] = match


            user[
                "state"
            ] = "DUPLICATE"


            save_user(
                sender,
                user
            )


            return similar_problem_message(

                sender,

                match
            )


    # --------------------------------------------------------
    # No duplicate → create new report
    # --------------------------------------------------------

    save_user(
        sender,
        user
    )


    return create_report(
        sender
    )


# ============================================================
# PROCESS MESSAGE
# ============================================================


def _process_message(
    sender,
    text
):

    user = get_user(
        sender
    )


    text = text.strip()


    if not text:

        return None


    upper_text = text.upper()


    print()

    print(
        "================================"
    )

    print(
        "FROM:",
        sender
    )

    print(
        "MESSAGE:",
        text
    )

    print(
        "STATE:",
        user.get(
            "state"
        )
    )

    print(
        "LANGUAGE:",
        user.get(
            "language"
        )
    )

    print(
        "================================"
    )


    # ========================================================
    # START
    # ========================================================
    #
    # ONLY START can activate an inactive/expired session.
    #
    # MENU / HOME do NOT activate a new session.
    #
    # ========================================================

    if upper_text == "START":

        reset_report_flow(
            user
        )

        user[
            "state"
        ] = "MAIN_MENU"

        now = utc_now()

        user[
            "session_started_at"
        ] = now

        user[
            "last_activity_at"
        ] = now

        save_user(
            sender,
            user
        )

        return main_menu(
            sender
        )


    # ========================================================
    # SESSION CHECK
    # ========================================================

    if user.get(
        "state",
        "INACTIVE"
    ) == "INACTIVE":

        # Do not reply.
        return None


    if session_has_expired(
        user
    ):

        user[
            "state"
        ] = "INACTIVE"

        reset_report_flow(
            user
        )

        save_user(
            sender,
            user
        )

        # Do not reply.
        return None


    # ========================================================
    # ACTIVE SESSION
    # ========================================================

    touch_session(
        sender
    )


    # ========================================================
    # UNIVERSAL MAIN MENU
    # ========================================================
    #
    # # always returns directly to the Main Menu from any
    # active state. This is intentionally handled before all
    # state-specific processing.
    # ========================================================

    if upper_text == "#":

        reset_report_flow(
            user
        )

        user[
            "state"
        ] = "MAIN_MENU"

        save_user(
            sender,
            user
        )

        return main_menu(
            sender
        )


    # ========================================================
    # MENU / HOME
    # ========================================================

    if upper_text in [
        "MENU",
        "HOME"
    ]:

        reset_report_flow(
            user
        )

        user[
            "state"
        ] = "MAIN_MENU"

        save_user(
            sender,
            user
        )

        return main_menu(
            sender
        )


    # ========================================================
    # CANCEL / BACK / 0
    # ========================================================

    if upper_text in [
        "CANCEL",
        "BACK",
        "0"
    ]:

        state = user.get("state", "MAIN_MENU")

        if state == "REPORT_CATEGORY":
            reset_report_flow(user)
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "REPORTING":
            reset_report_flow(user)
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "REPORT_DESCRIPTION":
            user["state"] = "REPORTING"
            save_user(sender, user)
            return report_problem_statement_menu(sender)

        if state == "LOCATION":
            user["state"] = "REPORT_DESCRIPTION"
            save_user(sender, user)
            return ask_report_description(sender)

        if state == "DUPLICATE":
            user["state"] = "LOCATION"
            save_user(sender, user)
            return location_menu(sender)

        if state == "RIGHTS_MENU":
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "RIGHTS_DETAIL":
            user["state"] = "RIGHTS_MENU"
            save_user(sender, user)
            return know_your_rights_menu(sender)

        if state == "HELP":
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "LANGUAGE_MENU":
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "STATUS":
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "MY_REPORTS":
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "COMMUNITY_CATEGORIES":
            user["state"] = "MAIN_MENU"
            save_user(sender, user)
            return main_menu(sender)

        if state == "COMMUNITY_PROBLEMS":
            user["state"] = "COMMUNITY_CATEGORIES"
            save_user(sender, user)
            return community_category_menu(sender, user.get("community_page", 0))

        if state == "PROBLEM_DETAILS":
            user["state"] = "COMMUNITY_PROBLEMS"
            save_user(sender, user)
            return community_problem_menu(
                sender,
                user.get("community_category", ""),
                user.get("community_page", 0)
            )

        reset_report_flow(user)
        user["state"] = "MAIN_MENU"
        save_user(sender, user)
        return main_menu(sender)


    # ========================================================
    # LANGUAGE COMMAND
    # ========================================================

    if upper_text in [

        "LANG",
        "LANGUAGE"

    ]:

        user[
            "state"
        ] = "LANGUAGE_MENU"

        save_user(
            sender,
            user
        )

        return language_menu(
            sender
        )


    # ========================================================
    # LANGUAGE MENU
    # ========================================================

    if user.get(
        "state"
    ) == "LANGUAGE_MENU":

        if text == "1":

            set_language(
                sender,
                "english"
            )

            user[
                "state"
            ] = "MAIN_MENU"

            save_user(
                sender,
                user
            )

            return language_changed(
                "english"
            )


        if text == "2":

            set_language(
                sender,
                "tamil"
            )

            user[
                "state"
            ] = "MAIN_MENU"

            save_user(
                sender,
                user
            )

            return language_changed(
                "tamil"
            )


        if text == "3":

            set_language(
                sender,
                "hindi"
            )

            user[
                "state"
            ] = "MAIN_MENU"

            save_user(
                sender,
                user
            )

            return language_changed(
                "hindi"
            )


        return language_menu(
            sender
        )


    # ========================================================
    # KNOW YOUR RIGHTS MENU
    # ========================================================

    if user.get("state") == "RIGHTS_MENU":

        if text in ["1", "2", "3"]:

            return rights_detail(
                sender,
                text
            )

        return know_your_rights_menu(
            sender
        )


    # ========================================================
    # KNOW YOUR RIGHTS DETAIL
    # ========================================================

    if user.get("state") == "RIGHTS_DETAIL":

        topic = user.get(
            "rights_topic",
            ""
        )

        if text in ["1", "2", "3"]:

            topic = text

        return rights_detail(
            sender,
            topic
        )


    # ========================================================
    # HELP
    # ========================================================

    if user.get("state") == "HELP":

        return help_menu(
            sender
        )


    # ========================================================
    # REPORT CATEGORY
    # ========================================================

    if user.get("state") == "REPORT_CATEGORY":
        return process_report_category(sender, text)


    # ========================================================
    # REPORTING
    # ========================================================

    if user.get(
        "state"
    ) == "REPORTING":

        return process_reporting(

            sender,

            text
        )


    # ========================================================
    # DESCRIPTION
    # ========================================================

    if user.get(
        "state"
    ) == "REPORT_DESCRIPTION":

        return process_report_description(

            sender,

            text
        )


    # ========================================================
    # LOCATION
    # ========================================================

    if user.get(
        "state"
    ) == "LOCATION":

        return process_location(

            sender,

            text
        )


    # ========================================================
    # DUPLICATE DECISION
    # ========================================================

    if user.get(
        "state"
    ) == "DUPLICATE":

        match = user.get(
            "duplicate_match"
        )


        if not match:

            user[
                "state"
            ] = "MAIN_MENU"

            save_user(
                sender,
                user
            )

            return main_menu(
                sender
            )


        problem_id = match[
            "problem_id"
        ]


        if text == "1":

            return support_problem(

                sender,

                problem_id
            )


        if text == "2":

            return create_report(
                sender
            )


        return similar_problem_message(

            sender,

            match
        )


    # ========================================================
    # COMMUNITY CATEGORIES
    # ========================================================

    if user.get("state") == "COMMUNITY_CATEGORIES":
        return process_community_categories(sender, text)


    # ========================================================
    # COMMUNITY PROBLEMS
    # ========================================================

    if user.get("state") == "COMMUNITY_PROBLEMS":
        return process_community_problems(sender, text)


    # ========================================================
    # STATUS
    # ========================================================

    if user.get(
        "state"
    ) == "STATUS":

        return show_report_status(

            sender,

            text
        )


    # ========================================================
    # MY REPORTS
    # ========================================================

    if user.get(
        "state"
    ) == "MY_REPORTS":

        if upper_text.startswith(
            "SETU"
        ):

            return show_report_status(

                sender,

                upper_text
            )


        return show_report_status(

            sender,

            text
        )


    # ========================================================
    # PROBLEM DETAILS
    # ========================================================

    if user.get(
        "state"
    ) == "PROBLEM_DETAILS":

        problem_id = user[
            "selected_problem"
        ]


        if text == "1":

            return support_problem(

                sender,

                problem_id
            )


        return problem_details(

            sender,

            problem_id
        )


    # ========================================================
    # MAIN MENU
    # ========================================================

    if user.get(
        "state"
    ) == "MAIN_MENU":

        # ----------------------------------------------------
        # 1 — REPORT
        # ----------------------------------------------------

        if text == "1":

            user[
                "state"
            ] = "REPORTING"

            save_user(
                sender,
                user
            )

            return report_problem_menu(
                sender
            )


        # ----------------------------------------------------
        # 2 — COMMUNITY PROBLEMS
        # ----------------------------------------------------

        if text == "2":

            return show_problems(
                sender
            )


        # ----------------------------------------------------
        # 3 — STATUS
        # ----------------------------------------------------

        if text == "3":

            user[
                "state"
            ] = "STATUS"

            save_user(
                sender,
                user
            )

            return status_menu(
                sender
            )


        # ----------------------------------------------------
        # 4 — MY REPORTS
        # ----------------------------------------------------

        if text == "4":

            user[
                "state"
            ] = "MY_REPORTS"

            save_user(
                sender,
                user
            )

            return my_reports(
                sender
            )


        # ----------------------------------------------------
        # 5 — LANGUAGE
        # ----------------------------------------------------

        if text == "5":

            user[
                "state"
            ] = "LANGUAGE_MENU"

            save_user(
                sender,
                user
            )

            return language_menu(
                sender
            )


        # ----------------------------------------------------
        # 6 — KNOW YOUR RIGHTS
        # ----------------------------------------------------

        if text == "6":

            return know_your_rights_menu(
                sender
            )


        # ----------------------------------------------------
        # 7 — HELP
        # ----------------------------------------------------

        if text == "7":

            return help_menu(
                sender
            )


        # ----------------------------------------------------
        # REPORT ID
        # ----------------------------------------------------

        if upper_text.startswith(
            "SETU"
        ):

            return show_report_status(

                sender,

                upper_text
            )


        # ----------------------------------------------------
        # PROBLEM ID
        # ----------------------------------------------------

        if re.fullmatch(

            r"#?\d+",

            text
        ):

            number = re.sub(

                r"[^0-9]",

                "",

                text
            )


            problem_id = (
                "#"
                +
                number
            )


            if db.get_problem(
                problem_id
            ) is not None:

                user[
                    "selected_problem"
                ] = problem_id

                user[
                    "state"
                ] = "PROBLEM_DETAILS"

                save_user(
                    sender,
                    user
                )

                return problem_details(

                    sender,

                    problem_id
                )


        # ----------------------------------------------------
        # REPORT COMMAND
        # ----------------------------------------------------

        if upper_text in [

            "REPORT",
            "PROBLEM",
            "ISSUE",
            "COMPLAINT"

        ]:

            user[
                "state"
            ] = "REPORTING"

            save_user(
                sender,
                user
            )

            return report_problem_menu(
                sender
            )


        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        if upper_text in [

            "STATUS",
            "TRACK"

        ]:

            user[
                "state"
            ] = "STATUS"

            save_user(
                sender,
                user
            )

            return status_menu(
                sender
            )


        # ----------------------------------------------------
        # COMMUNITY PROBLEMS
        # ----------------------------------------------------

        if upper_text in [

            "PROBLEMS",
            "ISSUES"

        ]:

            return show_problems(
                sender
            )


        # ----------------------------------------------------
        # NATURAL LANGUAGE REPORT
        # ----------------------------------------------------

        if len(text) >= 8:

            # No category step needed anymore - process the
            # citizen's free-text problem straight away; the AI
            # detects the category on its own.
            user["state"] = "REPORTING"
            save_user(sender, user)

            return process_reporting(sender, text)


        return invalid_input(
            sender
        )


    # ========================================================
    # FALLBACK
    # ========================================================

    user[
        "state"
    ] = "MAIN_MENU"

    save_user(
        sender,
        user
    )


    return invalid_input(
        sender
    )


def process_message(
    sender,
    text
):

    reply = _process_message(
        sender,
        text
    )

    if reply is None:
        return None

    user = get_user(
        sender
    )

    state = user.get(
        "state",
        "MAIN_MENU"
    )

    # Main Menu already is the top level.
    # Every other active response receives a consistent
    # direct-to-main-menu option.
    if state == "MAIN_MENU":
        return reply

    language = get_language(
        sender
    )

    if "#. Main Menu" in reply:
        return reply

    if "#. मुख्य मेनू" in reply:
        return reply

    if "#. முதன்மை மெனு" in reply:
        return reply

    if language == "tamil":

        return (
            reply
            +
            "\n#. முதன்மை மெனு"
        )

    if language == "hindi":

        return (
            reply
            +
            "\n#. मुख्य मेनू"
        )

    return (
        reply
        +
        "\n#. Main Menu"
    )


# ============================================================
# PROCESSED SMS
# ============================================================

processed_messages = set()


# ============================================================
# IGNORE OLD SMS
# ============================================================


def ignore_old_messages():

    try:

        response = http.get(

            GATEWAY_URL
            +
            "/inbox?limit=100",

            timeout=5
        )


        if response.status_code != 200:

            print(
                "Could not read old messages."
            )

            print(
                "Status:",
                response.status_code
            )

            return


        messages = response.json()


        count = 0


        for sms in messages:

            message_id = sms.get(
                "id"
            )


            if message_id:

                processed_messages.add(
                    message_id
                )

                count += 1


        print(
            "Old SMS ignored:",
            count
        )


    except Exception as e:

        print(
            "Startup inbox error:",
            e
        )


# ============================================================
# CHECK INCOMING SMS
# ============================================================


def check_messages():

    try:

        response = http.get(

            GATEWAY_URL
            +
            "/inbox?limit=10",

            timeout=5
        )


        if response.status_code != 200:

            print(
                "Inbox error:",
                response.status_code
            )

            return


        messages = response.json()


        # ----------------------------------------------------
        # Gateway returns a LIST directly.
        # ----------------------------------------------------

        if not isinstance(
            messages,
            list
        ):

            print(
                "Unexpected inbox format:"
            )

            print(
                messages
            )

            return


        for sms in messages:

            # ------------------------------------------------
            # SMS ID
            # ------------------------------------------------

            message_id = sms.get(
                "id"
            )


            if not message_id:

                continue


            # ------------------------------------------------
            # Prevent duplicate processing.
            # ------------------------------------------------

            if message_id in processed_messages:

                continue


            processed_messages.add(
                message_id
            )


            # ------------------------------------------------
            # SENDER
            # ------------------------------------------------
            #
            # Your gateway returns:
            #
            # "sender": "+919150283824"
            #
            # ------------------------------------------------

            sender = sms.get(
                "sender",
                ""
            ).strip()


            # ------------------------------------------------
            # SMS TEXT
            # ------------------------------------------------
            #
            # IMPORTANT:
            #
            # Your gateway does NOT return the text under
            # "textMessage".
            #
            # It returns:
            #
            # "contentPreview": "Start"
            #
            # Therefore we use contentPreview.
            #
            # ------------------------------------------------

            text = sms.get(

                "contentPreview",

                ""
            ).strip()


            if not sender:

                print(
                    "SMS ignored: sender missing"
                )

                continue


            if not text:

                print(
                    f"SMS ignored from {sender}: empty"
                )

                continue


            print()

            print(
                "NEW SMS RECEIVED"
            )

            print(
                "Sender:",
                sender
            )

            print(
                "Text:",
                text
            )


            # ------------------------------------------------
            # PROCESS
            # ------------------------------------------------

            reply = process_message(

                sender,

                text
            )


            # ------------------------------------------------
            # IMPORTANT:
            #
            # If user is inactive/expired, process_message()
            # returns None.
            #
            # We DO NOT send an SMS.
            #
            # ------------------------------------------------

            if reply is None:

                print(
                    "No reply sent."
                )

                continue


            print()

            print(
                "REPLY:"
            )

            print(
                reply
            )

            print()


            # ------------------------------------------------
            # SEND
            # ------------------------------------------------

            send_sms(

                sender,

                reply
            )


    except requests.exceptions.RequestException as e:

        print(
            "Gateway connection error:"
        )

        print(e)


    except Exception as e:

        print(
            "Inbox processing error:"
        )

        print(e)


# ============================================================
# REAL SMS MODE
# ============================================================
#
# This is the ORIGINAL SETU startup + polling loop, unchanged.
# It is now wrapped in a function so it only runs when the
# user chooses REAL SMS mode at startup.
# ============================================================


def run_real_sms_mode():

    print(
        "================================"
    )

    print(
        "       SETU SMS SYSTEM"
    )

    print(
        "================================"
    )

    print(
        "Gateway:",
        GATEWAY_URL
    )

    print(
        "Primary AI:",
        GROQ_MODEL
    )

    print(
        "Backup AI:",
        GEMINI_MODEL
    )

    print(
        "Database:",
        DATABASE_MODE
    )

    print(
        "Session timeout:",
        SESSION_TIMEOUT_MINUTES,
        "minutes"
    )

    print(
        "Polling: 1 second"
    )

    print()


    # --------------------------------------------------------
    # IGNORE EXISTING SMS
    # --------------------------------------------------------

    ignore_old_messages()

    print()

    print(
        "Waiting for NEW SMS..."
    )

    print(
        "Only START activates a session."
    )

    print(
        "Session expires after 30 minutes of inactivity."
    )

    print(
        "Press CTRL + C to stop."
    )

    print()


    # --------------------------------------------------------
    # CONTINUOUS SMS LOOP
    # --------------------------------------------------------

    while True:

        check_messages()

        time.sleep(1)


# ============================================================
# TEST / COMMAND-LINE MODE
# ============================================================
#
# Same SETU processing logic as REAL SMS mode
# (process_message is called exactly the same way).
#
# The only differences:
#
#   REAL MODE: incoming SMS -> process_message() -> send_sms()
#   TEST MODE: CMD input    -> process_message() -> print()
#
# No SMS gateway call is ever made in TEST MODE, so it does
# not consume the daily SMS quota.
# ============================================================

# Fixed fake sender used for every CMD test session, so the
# conversation/session state behaves exactly like a single
# real phone number texting SETU.
TEST_MODE_SENDER = "TEST_MODE_USER"


def run_test_mode():

    print()

    print(
        "============================================================"
    )

    print(
        "                 SETU SMS TEST MODE"
    )

    print(
        "============================================================"
    )

    print(
        "Type the SMS message exactly as a citizen would send it."
    )

    print(
        "Type EXIT to stop."
    )

    print(
        "Type CLEAR to visually separate the conversation."
    )

    print(
        "No SMS will be sent to the phone in TEST MODE."
    )

    print(
        "============================================================"
    )

    print()

    while True:

        try:

            text = input(
                "CITIZEN > "
            )

        except (KeyboardInterrupt, EOFError):

            print()

            print(
                "============================================================"
            )

            print(
                "SETU TEST MODE CLOSED"
            )

            print(
                "============================================================"
            )

            break


        text = text.strip()


        if text.upper() == "EXIT":

            print()

            print(
                "============================================================"
            )

            print(
                "SETU TEST MODE CLOSED"
            )

            print(
                "============================================================"
            )

            break


        if text.upper() == "CLEAR":

            print(
                "\n" * 35
            )

            print(
                "============================================================"
            )

            print(
                "                 CONVERSATION CLEARED"
            )

            print(
                "============================================================"
            )

            print()

            continue


        if not text:

            continue


        print()

        print(
            "-------------------- INCOMING SMS --------------------------"
        )

        print(
            f"CITIZEN: {text}"
        )

        print(
            "-------------------------------------------------------------"
        )


        # ------------------------------------------------
        # Capture internal diagnostic output generated by
        # process_message(), AI calls, and database logic.
        #
        # This keeps the visible SMS conversation clean while
        # preserving the exact same processing logic.
        # ------------------------------------------------

        debug_buffer = io.StringIO()

        with redirect_stdout(
            debug_buffer
        ):

            reply = process_message(
                TEST_MODE_SENDER,
                text
            )


        debug_output = debug_buffer.getvalue().strip()


        if debug_output:

            print()

            print(
                "---------------------- SYSTEM LOG -------------------------"
            )

            print(
                debug_output
            )

            print(
                "-------------------------------------------------------------"
            )


        # ------------------------------------------------
        # IMPORTANT:
        #
        # If user is inactive/expired, process_message()
        # returns None, exactly like in REAL SMS mode.
        #
        # We DO NOT print a reply, and we NEVER call
        # send_sms() in TEST MODE.
        #
        # ------------------------------------------------

        if reply is None:

            print()

            print(
                "SETU: No SMS reply sent."
            )

            print()

            continue


        print()

        print(
            "======================= SETU REPLY ========================="
        )

        print(
            reply
        )

        print(
            "============================================================="
        )

        print()


# ============================================================
# MODE SELECTION
# ============================================================
#
# Ask the user whether to run SETU with the real SMS gateway
# or in TEST MODE (typed input in the terminal).
#
# Accepted as YES: Y, y, Yes, YES, yes
# Accepted as NO:  N, n, No, NO, no
#
# Any other input keeps asking.
# ============================================================

YES_INPUTS = {
    "y",
    "yes"
}

NO_INPUTS = {
    "n",
    "no"
}


def ask_run_real_sms():

    prompt = "Do you want to run SETU with real SMS? (Y/N): "

    while True:

        answer = input(
            prompt
        ).strip().lower()

        if answer in YES_INPUTS:

            return True

        if answer in NO_INPUTS:

            return False

        prompt = "Please enter Y or N: "


# ============================================================
# START SETU
# ============================================================

if __name__ == "__main__":

    if ask_run_real_sms():

        run_real_sms_mode()

    else:

        run_test_mode()
