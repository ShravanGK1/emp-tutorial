from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from queries import (
    get_all_employees,
    create_employee,
    update_employee,
    release_employee,
    Employee,
    EmployeeCreate,
    EmployeeUpdate,
    ReleaseData,
)

router = APIRouter()

# GET route to fetch all employees from DB
@router.get("/employees", response_model=List[Employee])
def read_employees(db: Session = Depends(get_db)):
    return get_all_employees(db)

# POST route to allow saving new employee to DB
@router.post("/employees", response_model=Employee)
def add_employee(emp: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, emp)

# PUT route to update existing employee in DB
@router.put("/employees/{emp_id}", response_model=Employee)
def update_emp(emp_id: int, emp: EmployeeUpdate, db: Session = Depends(get_db)):
    updated = update_employee(db, emp_id, emp)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated

# POST route to release employee in DB
@router.post("/employees/{emp_id}/release", response_model=Employee)
def release_emp(emp_id: int, release_data: ReleaseData, db: Session = Depends(get_db)):
    released = release_employee(db, emp_id, release_data)
    if not released:
        raise HTTPException(status_code=404, detail="Employee not found")
    return released