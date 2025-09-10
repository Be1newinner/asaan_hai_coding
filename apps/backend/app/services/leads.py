from app.services.base import CRUDBase
from app.models.leads import Leads
from app.schemas.leads import LeadCreate, LeadUpdate


class LeadsCrud(CRUDBase[Leads, LeadCreate, LeadUpdate]):
    pass


leads_crud = LeadsCrud(Leads)
