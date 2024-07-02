# This is a generated file, do not edit

from typing import Annotated

import pydantic

from ..builtin_interfaces.Time import Time


class BidProposal(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(from_attributes=True)

    fleet_name: str  # string
    expected_robot_name: str  # string
    prev_cost: float  # float64
    new_cost: float  # float64
    finish_time: Time  # builtin_interfaces/Time


# # This message is published by a Fleet Adapter in response to a BidNotice
# # message.
#
# # The name of the Fleet Adapter publishing this message
# string fleet_name
#
# # The name of the robot in the fleet which will potentially execute the task
# string expected_robot_name
#
# # The overall cost of task assignments prior to accommodating the new task
# float64 prev_cost
#
# # The overall cost of task assignments after accommodating the new task
# float64 new_cost
#
# # The estimated finish time of the new task
# builtin_interfaces/Time finish_time
