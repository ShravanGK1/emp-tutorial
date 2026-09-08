from sqlalchemy import Column, Integer, String, Date
from database import Base

class EmployeeModel(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_code = Column(String(50), nullable=False)
    client = Column(String(100), default="Acme Corp")
    branch = Column(String(100), default="West")
    site = Column(String(100), default="Austin")
    name = Column(String(100), nullable=False)
    gender = Column(String(20), default="Male")
    status = Column(String(20), default="Active")
    designation = Column(String(100), default="Technician")
    client_desig = Column(String(100), default="Client Technician")
    email = Column(String(100), nullable=False)
    mobile = Column(String(30), nullable=False)
    weekly_off = Column(String(50), default="Sunday")
    joined_on = Column(Date, nullable=False)
    released_on = Column(Date, nullable=True)
    release_reason = Column(String(100), nullable=True)
    remarks = Column(String(255), nullable=True)
    site_count = Column(Integer, default=1)
    on_board = Column(String(10), default="Yes")
    attn_app = Column(String(10), default="Yes")
    trainee_app = Column(String(10), default="No")
