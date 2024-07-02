# This is a generated file, do not edit

from typing import Annotated

import pydantic


class RobotMode(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(from_attributes=True)

    mode: Annotated[int, pydantic.Field(ge=0, le=4294967295)]  # uint32
    mode_request_id: Annotated[
        int, pydantic.Field(ge=0, le=18446744073709551615)
    ]  # uint64
    performing_action: str  # string


# uint32 mode
# uint32 MODE_IDLE=0
# uint32 MODE_CHARGING=1
# uint32 MODE_MOVING=2
# uint32 MODE_PAUSED=3
# uint32 MODE_WAITING=4
# uint32 MODE_EMERGENCY=5
# uint32 MODE_GOING_HOME=6
# uint32 MODE_DOCKING=7
#
# # Use this when a command received from the fleet adapter
# # has a problem and needs to be recomputed.
# uint32 MODE_ADAPTER_ERROR=8
#
# uint32 MODE_CLEANING=9
#
# # These modes are used to indicate that the robot has started or completed
# # performing an action in simulation, it is not encouraged to be used for
# # fleet adapters
# uint32 MODE_PERFORMING_ACTION=10
# uint32 MODE_ACTION_COMPLETED=11
#
# uint64 mode_request_id
#
# # Specify the action that the robot is performing when its current mode
# # is MODE_PERFORMING_ACTION
# string performing_action
