from fastapi import APIRouter, HTTPException
from typing import List
from queries import (
    Employee, 
    EmployeeCreate, 
    EmployeeUpdate, 
    ReleaseData,
    get_all_employees,
    create_employee,
    update_employee,
    release_employee
)

router = APIRouter(tags=["Employees"])

@router.get("/employees", response_model=List[Employee])
def get_employees():
    return get_all_employees()

@router.post("/employees", response_model=Employee)
def create_new_employee(emp: EmployeeCreate):
    return create_employee(emp)

@router.put("/employees/{emp_id}", response_model=Employee)
def modify_employee(emp_id: int, emp: EmployeeUpdate):
    updated = update_employee(emp_id, emp)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated

@router.post("/employees/{emp_id}/release", response_model=Employee)
def release_existing_employee(emp_id: int, data: ReleaseData):
    released = release_employee(emp_id, data)
    if not released:
        raise HTTPException(status_code=404, detail="Employee not found")
    return released
