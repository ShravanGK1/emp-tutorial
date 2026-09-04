from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import date
import random
from sqlalchemy.orm import Session
from models import EmployeeModel

# --- Pydantic Schemas Exactly Matching Frontend Types ---
class EmployeeBase(BaseModel):
    emp_code: str
    client: str = "Acme Corp"
    branch: str = "West"
    site: str = "Austin"
    name: str
    gender: str = "Male"
    status: str = "Active"
    skill_desig: str = "Technician"
    client_desig: str = "Client Technician"
    email: str
    mobile: str
    weekly_off: str = "Sunday"
    joined_on: date
    released_on: Optional[date] = None
    site_count: int = 1
    on_board: str = "Yes"
    attn_app: str = "Yes"
    trainee_app: str = "No"

class Employee(EmployeeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class ReleaseData(BaseModel):
    release_date: date
    release_reason: str
    remarks: str

# --- Database Query Functions ---
def get_all_employees(db: Session) -> List[EmployeeModel]:
    return db.query(EmployeeModel).order_by(EmployeeModel.id.desc()).all()

def create_employee(db: Session, emp: EmployeeCreate) -> EmployeeModel:
    db_emp = EmployeeModel(**emp.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def update_employee(db: Session, emp_id: int, emp_update: EmployeeUpdate) -> Optional[EmployeeModel]:
    db_emp = db.query(EmployeeModel).filter(EmployeeModel.id == emp_id).first()
    if not db_emp:
        return None
    for key, value in emp_update.model_dump().items():
        setattr(db_emp, key, value)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def release_employee(db: Session, emp_id: int, release_data: ReleaseData) -> Optional[EmployeeModel]:
    db_emp = db.query(EmployeeModel).filter(EmployeeModel.id == emp_id).first()
    if not db_emp:
        return None
    db_emp.status = "Inactive"
    db_emp.released_on = release_data.release_date
    db.commit()
    db.refresh(db_emp)
    return db_emp

def seed_initial_data_if_empty(db: Session, count: int = 200):
    """If the test_db employees table is empty, seed it with sample records."""
    if db.query(EmployeeModel).first() is not None:
        return

    clients = ["Acme Corp", "Tata Communications", "Global Tech", "Innovatech"]
    branches = ["West", "East", "North", "South", "Central"]
    sites = ["Austin", "Chicago", "Boston", "Seattle", "Atlanta", "Denver", "New York", "Miami", "TCL BKC"]
    genders = ["Male", "Female"]
    skills = ["Sr. Analyst", "Supervisor", "HR Executive", "Technician", "Coordinator", "Safety Officer", "Recruiter", "Associate", "LS/G"]
    statuses = ["Active", "Inactive"]
    names = ["Maya Chen", "Noah Williams", "Priya Shah", "Liam Foster", "Sofia Martinez", "Ethan Brooks", "Ava Thompson", "Lucas Reed", "Rahul Sharma"]

    sample_employees = []
    for i in range(1, count + 1):
        status = random.choice(statuses)
        emp = EmployeeModel(
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
        sample_employees.append(emp)
    
    db.add_all(sample_employees)
    db.commit()
    print(f">>> [DB SEED] Successfully seeded {count} initial employee records into test_db!")