from typing import List, Optional
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, ConfigDict
from datetime import date
import random
from sqlalchemy.orm import Session
from models import EmployeeModel

# --- Pydantic Schemas ---
class EmployeeBase(BaseModel):
    emp_code: str
    client: str = "Acme Corp"
    branch: str = "West"
    site: str = "Austin"
    name: str
    gender: str = "Male"
    status: str = "Active"
    designation: str = "Technician"
    client_desig: str = "Client Technician"
    email: str
    mobile: str
    weekly_off: str = "Sunday"
    joined_on: date
    released_on: Optional[date] = None
    release_reason: Optional[str] = None
    remarks: Optional[str] = None
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
    # Returns all employees (both Active and Inactive) so historical logs are never lost
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
    
    # If the updated status is Active or on_board is Active/Yes, reset release metadata
    if db_emp.status == "Active" or db_emp.on_board in ["Active", "Yes"]:
        db_emp.status = "Active"
        db_emp.on_board = "Active"
        db_emp.released_on = None
        db_emp.release_reason = None
        db_emp.remarks = None

    db.commit()
    db.refresh(db_emp)
    return db_emp

def re_onboard_employee(db: Session, emp_id: int) -> Optional[EmployeeModel]:
    # Re-activate released employee: Reset status, on_board, and clear release fields
    db_emp = db.query(EmployeeModel).filter(EmployeeModel.id == emp_id).first()
    if not db_emp:
        return None
    db_emp.status = "Active"
    db_emp.on_board = "Active"
    db_emp.released_on = None
    db_emp.release_reason = None
    db_emp.remarks = None
    db.commit()
    db.refresh(db_emp)
    return db_emp

def release_employee(db: Session, emp_id: int, release_data: ReleaseData) -> Optional[EmployeeModel]:
    # Soft release: Do NOT delete the employee record. Update status and release log details.
    db_emp = db.query(EmployeeModel).filter(EmployeeModel.id == emp_id).first()
    if not db_emp:
        return None
    db_emp.status = "Inactive"
    db_emp.on_board = "Inactive"
    db_emp.released_on = release_data.release_date
    db_emp.release_reason = release_data.release_reason
    db_emp.remarks = release_data.remarks
    db.commit()
    db.refresh(db_emp)
    return db_emp

def seed_initial_data_if_empty(db: Session, count: int = 200):
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
            designation=random.choice(skills),
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