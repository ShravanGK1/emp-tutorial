from typing import List, Optional
from pydantic import BaseModel
from datetime import date
import random

# We'll use simple random data generation to avoid external dependencies like Faker for now,
# but we'll generate 200 records as requested.

class EmployeeBase(BaseModel):
    emp_code: str
    client: str
    branch: str
    site: str
    name: str
    gender: str
    status: str
    skill_desig: str
    client_desig: str
    email: str
    mobile: str
    weekly_off: str
    joined_on: date
    released_on: Optional[date] = None
    site_count: int
    on_board: str
    attn_app: str
    trainee_app: str

class Employee(EmployeeBase):
    id: int

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class ReleaseData(BaseModel):
    release_date: date
    release_reason: str
    remarks: str

# Mock Database
mock_db: List[Employee] = []

def generate_mock_data(count: int = 200):
    global mock_db
    clients = ["Acme Corp", "Tata Communications", "Global Tech", "Innovatech"]
    branches = ["West", "East", "North", "South", "Central"]
    sites = ["Austin", "Chicago", "Boston", "Seattle", "Atlanta", "Denver", "New York", "Miami", "TCL BKC"]
    genders = ["Male", "Female"]
    skills = ["Sr. Analyst", "Supervisor", "HR Executive", "Technician", "Coordinator", "Safety Officer", "Recruiter", "Associate", "LS/G"]
    statuses = ["Active", "Inactive"]
    names = ["Maya Chen", "Noah Williams", "Priya Shah", "Liam Foster", "Sofia Martinez", "Ethan Brooks", "Ava Thompson", "Lucas Reed", "Rahul Sharma"]
    
    for i in range(1, count + 1):
        status = random.choice(statuses)
        emp = Employee(
            id=i,
            emp_code=f"EMP-{1000 + i}",
            client=random.choice(clients),
            branch=random.choice(branches),
            site=random.choice(sites),
            name=f"{random.choice(names)} {i}",
            gender=random.choice(genders),
            status=status,
            skill_desig=random.choice(skills),
            client_desig=f"Client {random.choice(skills)}",
            email=f"emp{i}@example.com",
            mobile=f"+1 555 01{i:02d}",
            weekly_off=random.choice(["Sunday", "Sat, Sun", "Monday"]),
            joined_on=date(2020 + random.randint(0, 4), random.randint(1, 12), random.randint(1, 28)),
            released_on=date(2025, 1, 1) if status == 'Inactive' else None,
            site_count=random.randint(1, 5),
            on_board=random.choice(["Yes", "No"]),
            attn_app=random.choice(["Yes", "No"]),
            trainee_app=random.choice(["Yes", "No"]),
        )
        mock_db.append(emp)

# Initialize mock data
generate_mock_data()

def get_all_employees() -> List[Employee]:
    return mock_db

def create_employee(emp: EmployeeCreate) -> Employee:
    new_id = max([e.id for e in mock_db], default=0) + 1
    new_emp = Employee(**emp.dict(), id=new_id)
    mock_db.insert(0, new_emp)
    return new_emp

def update_employee(emp_id: int, emp_update: EmployeeUpdate) -> Optional[Employee]:
    for i, emp in enumerate(mock_db):
        if emp.id == emp_id:
            updated_emp = Employee(**emp_update.dict(), id=emp_id)
            mock_db[i] = updated_emp
            return updated_emp
    return None

def release_employee(emp_id: int, release_data: ReleaseData) -> Optional[Employee]:
    for emp in mock_db:
        if emp.id == emp_id:
            emp.status = "Inactive"
            emp.released_on = release_data.release_date
            return emp
    return None
