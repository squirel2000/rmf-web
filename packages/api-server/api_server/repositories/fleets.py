from typing import List, Optional

from fastapi import Depends
from tortoise.queryset import QuerySet

from api_server.authenticator import user_dep
from api_server.models import FleetState, Pagination, User
from api_server.models.tortoise_models import FleetState as DbFleetState
from api_server.query import add_pagination


class FleetRepository:
    def __init__(self, user: User):
        self.user = user

    async def query_fleet_states(
        self, query: QuerySet[DbFleetState], pagination: Optional[Pagination] = None
    ) -> List[FleetState]:
        # TODO: enforce with authz
        if pagination:
            query = add_pagination(query, pagination)
        results = await query.values_list("data", flat=True)
        return [FleetState(**r) for r in results]

    async def get_fleet_state(self, name: str) -> Optional[FleetState]:
        # TODO: enforce with authz
        result = await DbFleetState.get_or_none(name=name)
        if result is None:
            return None
        return FleetState(**result.data)


def fleet_repo_dep(user: User = Depends(user_dep)):
    return FleetRepository(user)
