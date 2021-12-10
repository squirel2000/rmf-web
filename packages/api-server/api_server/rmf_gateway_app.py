# NOTE: This will eventually replace `gateway.py``
import sys
from typing import Any, Dict

from fastapi import FastAPI, WebSocket

from . import models as mdl
from .rmf_io import fleet_events, task_events

app = FastAPI()


@app.websocket("/")
async def rmf_gateway(websocket: WebSocket):
    await websocket.accept()
    while True:
        data: Dict[str, Any] = await websocket.receive_json()
        payload_type: str = data["type"]
        if not isinstance(payload_type, str):
            print("'type' must be a string", file=sys.stderr)

        if payload_type == "task_state_update":
            task_state = mdl.TaskState.construct(**data)
            await task_state.save()
            task_events.task_states.on_next(task_state)
        elif payload_type == "fleet_state_update":
            fleet_state = mdl.FleetState.construct(**data)
            await fleet_state.save()
            fleet_events.fleet_states.on_next(fleet_state)
