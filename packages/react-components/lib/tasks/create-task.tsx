/**
 * FIXME(kp): Make the whole task request system task agnostic.
 * For that RMF needs to support task discovery and UI schemas https://github.com/open-rmf/rmf_api_msgs/issues/32.
 */

import UpdateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import type { TaskFavoritePydantic as TaskFavorite, TaskRequest } from 'api-client';
import React from 'react';
import { Loading } from '..';
import { ConfirmationDialog, ConfirmationDialogProps } from '../confirmation-dialog';
import { PositiveIntField } from '../form-inputs';

// A bunch of manually defined descriptions to avoid using `any`.
interface DeliveryTaskDescription {
  pickup: {
    place: string;
    handler: string;
    payload: {
      sku: string;
      quantity: number;
    };
  };
  dropoff: {
    place: string;
    handler: string;
    payload: {
      sku: string;
      quantity: number;
    };
  };
}

interface LoopTaskDescription {
  places: string[];
  rounds: number;
}

interface CleanTaskDescription {
  zone: string;
}

type TaskDescription = DeliveryTaskDescription | LoopTaskDescription | CleanTaskDescription;

const classes = {
  title: 'dialogue-info-value',
  selectFileBtn: 'create-task-selected-file-btn',
  taskList: 'create-task-task-list',
  selectedTask: 'create-task-selected-task',
  actionBtn: 'dialogue-action-button',
};
const StyledDialog = styled((props: DialogProps) => <Dialog {...props} />)(({ theme }) => ({
  [`& .${classes.selectFileBtn}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.taskList}`]: {
    flex: '1 1 auto',
    minHeight: 400,
    maxHeight: '50vh',
    overflow: 'auto',
  },
  [`& .${classes.selectedTask}`]: {
    background: theme.palette.action.focus,
  },
  [`& .${classes.title}`]: {
    flex: '1 1 auto',
  },
  [`& .${classes.actionBtn}`]: {
    minWidth: 80,
  },
}));

function getShortDescription(taskRequest: TaskRequest): string {
  switch (taskRequest.category) {
    case 'clean': {
      return `[Clean] zone [${taskRequest.description.zone}]`;
    }
    case 'delivery': {
      return `[Delivery] from [${taskRequest.description.pickup.place}] to [${taskRequest.description.dropoff.place}]`;
    }
    case 'patrol': {
      return `[Patrol] [${taskRequest.description.places[0]}] to [${taskRequest.description.places[1]}]`;
    }
    default:
      return `[Unknown] type "${taskRequest.category}"`;
  }
}

interface FormToolbarProps {
  onSelectFileClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function FormToolbar({ onSelectFileClick }: FormToolbarProps) {
  return (
    <Button
      aria-label="Select File"
      className={classes.selectFileBtn}
      variant="contained"
      color="primary"
      onClick={onSelectFileClick}
    >
      Select File
    </Button>
  );
}

interface DeliveryTaskFormProps {
  taskDesc: DeliveryTaskDescription;
  deliveryWaypoints: string[];
  dispensers: string[];
  ingestors: string[];
  onChange(taskDesc: TaskDescription): void;
}

function DeliveryTaskForm({
  taskDesc,
  deliveryWaypoints,
  dispensers,
  ingestors,
  onChange,
}: DeliveryTaskFormProps) {
  const theme = useTheme();

  return (
    <>
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 60%' }}>
          <Autocomplete
            id="pickup-location"
            freeSolo
            fullWidth
            options={deliveryWaypoints}
            value={taskDesc.pickup.place}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  place: newValue,
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  place: (ev.target as HTMLInputElement).value,
                },
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Pickup Location" margin="normal" />
            )}
          />
        </Grid>
        <Grid
          style={{
            flex: '1 1 40%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <Autocomplete
            id="dispenser"
            freeSolo
            fullWidth
            options={dispensers}
            value={taskDesc.pickup.handler}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  handler: newValue,
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  handler: (ev.target as HTMLInputElement).value,
                },
              })
            }
            renderInput={(params) => <TextField {...params} label="Dispenser" margin="normal" />}
          />
        </Grid>
      </Grid>
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 60%' }}>
          <Autocomplete
            id="dropoff-location"
            freeSolo
            fullWidth
            options={deliveryWaypoints}
            value={taskDesc.dropoff.place}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  place: newValue,
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  place: (ev.target as HTMLInputElement).value,
                },
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Dropoff Location" margin="normal" />
            )}
          />
        </Grid>
        <Grid
          style={{
            flex: '1 1 40%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <Autocomplete
            id="ingestor"
            freeSolo
            fullWidth
            options={ingestors}
            value={taskDesc.dropoff.handler}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  handler: newValue,
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  handler: (ev.target as HTMLInputElement).value,
                },
              })
            }
            renderInput={(params) => <TextField {...params} label="Ingestor" margin="normal" />}
          />
        </Grid>
      </Grid>
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 60%' }}>
          <Autocomplete
            id="pickup_sku"
            freeSolo
            fullWidth
            value={taskDesc.pickup.payload.sku}
            options={[]}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  payload: {
                    ...taskDesc.pickup.payload,
                    sku: newValue,
                  },
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.dropoff,
                  payload: {
                    ...taskDesc.pickup.payload,
                    sku: (ev.target as HTMLInputElement).value,
                  },
                },
              })
            }
            renderInput={(params) => <TextField {...params} label="Pickup SKU" margin="normal" />}
          />
        </Grid>
        <Grid
          style={{
            flex: '1 1 40%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <Autocomplete
            id="pickup_quantity"
            freeSolo
            fullWidth
            value={taskDesc.pickup.payload.quantity}
            options={[]}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  payload: {
                    ...taskDesc.pickup.payload,
                    quantity: typeof newValue == 'string' ? parseInt(newValue) : newValue,
                  },
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                pickup: {
                  ...taskDesc.pickup,
                  payload: {
                    ...taskDesc.pickup.payload,
                    quantity: parseInt((ev.target as HTMLInputElement).value),
                  },
                },
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Pickup Quantity" margin="normal" />
            )}
          />
        </Grid>
        <Grid style={{ flex: '1 1 60%' }}>
          <Autocomplete
            id="dropoff_sku"
            freeSolo
            fullWidth
            value={taskDesc.dropoff.payload.sku}
            options={[]}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  payload: {
                    ...taskDesc.dropoff.payload,
                    sku: newValue,
                  },
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  payload: {
                    ...taskDesc.dropoff.payload,
                    sku: (ev.target as HTMLInputElement).value,
                  },
                },
              })
            }
            renderInput={(params) => <TextField {...params} label="Dropoff SKU" margin="normal" />}
          />
        </Grid>
        <Grid
          style={{
            flex: '1 1 40%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <Autocomplete
            id="dropoff_quantity"
            freeSolo
            fullWidth
            value={taskDesc.dropoff.payload.quantity}
            options={[]}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  payload: {
                    ...taskDesc.dropoff.payload,
                    quantity: typeof newValue == 'string' ? parseInt(newValue) : newValue,
                  },
                },
              })
            }
            onBlur={(ev) =>
              onChange({
                ...taskDesc,
                dropoff: {
                  ...taskDesc.dropoff,
                  payload: {
                    ...taskDesc.dropoff.payload,
                    quantity: parseInt((ev.target as HTMLInputElement).value),
                  },
                },
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Dropoff Quantity" margin="normal" />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}

interface PlaceListProps {
  places: string[];
  onClick(places_index: number): void;
}

function PlaceList({ places, onClick }: PlaceListProps) {
  const theme = useTheme();
  return (
    <List
      dense
      sx={{
        bgcolor: 'background.paper',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
      }}
    >
      {places.map((value, index) => (
        <ListItem
          key={`${value}-${index}`}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onClick(index)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemIcon>
            <PlaceOutlined />
          </ListItemIcon>
          <ListItemText primary={`Place Name:   ${value}`} />
        </ListItem>
      ))}
    </List>
  );
}

interface LoopTaskFormProps {
  taskDesc: LoopTaskDescription;
  loopWaypoints: string[];
  onChange(loopTaskDescription: LoopTaskDescription): void;
}

function LoopTaskForm({ taskDesc, loopWaypoints, onChange }: LoopTaskFormProps) {
  const theme = useTheme();

  return (
    <>
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 100%' }}>
          <Autocomplete
            id="place-input"
            freeSolo
            fullWidth
            options={loopWaypoints}
            onChange={(_ev, newValue) =>
              newValue !== null &&
              onChange({
                ...taskDesc,
                places: taskDesc.places.concat(newValue).filter(
                  (el: string) => el, // filter null and empty str in places array
                ),
              })
            }
            renderInput={(params) => <TextField {...params} label="Place Name" margin="normal" />}
          />
        </Grid>
        <Grid
          style={{
            flex: '0 1 5em',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <PositiveIntField
            id="loops"
            label="Loops"
            margin="normal"
            value={taskDesc.rounds}
            onChange={(_ev, val) => {
              onChange({
                ...taskDesc,
                rounds: val,
              });
            }}
          />
        </Grid>
      </Grid>
      <PlaceList
        places={taskDesc && taskDesc.places ? taskDesc.places : []}
        onClick={(places_index) =>
          taskDesc.places.splice(places_index, 1) &&
          onChange({
            ...taskDesc,
          })
        }
      />
    </>
  );
}

interface CleanTaskFormProps {
  taskDesc: CleanTaskDescription;
  cleaningZones: string[];
  onChange(cleanTaskDescription: CleanTaskDescription): void;
}

function CleanTaskForm({ taskDesc, cleaningZones, onChange }: CleanTaskFormProps) {
  return (
    <Autocomplete
      id="cleaning-zone"
      freeSolo
      fullWidth
      options={cleaningZones}
      value={taskDesc.zone}
      onChange={(_ev, newValue) =>
        newValue !== null &&
        onChange({
          ...taskDesc,
          zone: newValue,
        })
      }
      onBlur={(ev) => onChange({ ...taskDesc, zone: (ev.target as HTMLInputElement).value })}
      renderInput={(params) => <TextField {...params} label="Cleaning Zone" margin="normal" />}
    />
  );
}

interface FavoriteTaskProps {
  listItemText: string;
  listItemClick: () => void;
  favoriteTask: TaskFavorite;
  setFavoriteTask: (favoriteTask: TaskFavorite) => void;
  setOpenDialog: (open: boolean) => void;
  setCallToDelete: (open: boolean) => void;
  setCallToUpdate: (open: boolean) => void;
}

function FavoriteTask({
  listItemText,
  listItemClick,
  favoriteTask,
  setFavoriteTask,
  setOpenDialog,
  setCallToDelete,
  setCallToUpdate,
}: FavoriteTaskProps) {
  const theme = useTheme();

  return (
    <>
      <ListItem
        sx={{ width: theme.spacing(30) }}
        onClick={() => {
          listItemClick();
          setCallToUpdate(false);
        }}
        role="listitem button"
        button
        divider={true}
      >
        <ListItemText primary={listItemText} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="update"
            onClick={() => {
              setCallToUpdate(true);
              listItemClick();
            }}
          >
            <UpdateIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              setOpenDialog(true);
              setFavoriteTask(favoriteTask);
              setCallToDelete(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
}

function defaultCleanTask(): CleanTaskDescription {
  return {
    zone: '',
  };
}

function defaultLoopTask(): LoopTaskDescription {
  return {
    places: [],
    rounds: 1,
  };
}

function defaultDeliveryTask(): DeliveryTaskDescription {
  return {
    pickup: {
      place: '',
      handler: '',
      payload: {
        sku: '',
        quantity: 1,
      },
    },
    dropoff: {
      place: '',
      handler: '',
      payload: {
        sku: '',
        quantity: 1,
      },
    },
  };
}

function defaultTaskDescription(taskCategory: string): TaskDescription | undefined {
  switch (taskCategory) {
    case 'clean':
      return defaultCleanTask();
    case 'patrol':
      return defaultLoopTask();
    case 'delivery':
      return defaultDeliveryTask();
    default:
      return undefined;
  }
}

function defaultTask(): TaskRequest {
  return {
    category: 'patrol',
    description: defaultLoopTask(),
    unix_millis_earliest_start_time: 0,
    priority: { type: 'binary', value: 0 },
  };
}

export type RecurringDays = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];

export interface Schedule {
  startOn: Date;
  days: RecurringDays;
}

interface DaySelectorSwitchProps {
  disabled?: boolean;
  onChange: (checked: RecurringDays) => void;
  value: RecurringDays;
}

const DaySelectorSwitch: React.VFC<DaySelectorSwitchProps> = ({ disabled, onChange, value }) => {
  const theme = useTheme();
  const renderChip = (idx: number, text: string) => (
    <Chip
      key={idx}
      label={text}
      color="primary"
      sx={{ '&:hover': {}, margin: theme.spacing(0.25) }}
      variant={value[idx] && !disabled ? 'filled' : 'outlined'}
      disabled={disabled}
      onClick={() => {
        value[idx] = !value[idx];
        onChange([...value]);
      }}
    />
  );
  return (
    <div>
      <TextField
        label="Recurring Every"
        color="primary"
        InputProps={{
          disabled: true,
          startAdornment: [
            renderChip(0, 'Mon'),
            renderChip(1, 'Tue'),
            renderChip(2, 'Wed'),
            renderChip(3, 'Thu'),
            renderChip(4, 'Fri'),
            renderChip(5, 'Sat'),
            renderChip(6, 'Sun'),
          ],
        }}
      />
    </div>
  );
};

const defaultFavoriteTask = (): TaskFavorite => {
  return {
    id: '',
    name: '',
    category: 'patrol',
    description: defaultLoopTask(),
    unix_millis_earliest_start_time: 0,
    priority: { type: 'binary', value: 0 },
    user: '',
  };
};

export interface CreateTaskFormProps
  extends Omit<ConfirmationDialogProps, 'onConfirmClick' | 'toolbar'> {
  /**
   * Shows extra UI elements suitable for submittng batched tasks. Default to 'false'.
   */
  allowBatch?: boolean;
  cleaningZones?: string[];
  loopWaypoints?: string[];
  deliveryWaypoints?: string[];
  dispensers?: string[];
  ingestors?: string[];
  favoritesTasks: TaskFavorite[];
  submitTasks?(tasks: TaskRequest[], schedule: Schedule | null): Promise<void>;
  tasksFromFile?(): Promise<TaskRequest[]> | TaskRequest[];
  onSuccess?(tasks: TaskRequest[]): void;
  onFail?(error: Error, tasks: TaskRequest[]): void;
  onSuccessFavoriteTask?(message: string, favoriteTask: TaskFavorite): void;
  onFailFavoriteTask?(error: Error, favoriteTask: TaskFavorite): void;
  submitFavoriteTask?(favoriteTask: TaskFavorite): Promise<void>;
  deleteFavoriteTask?(favoriteTask: TaskFavorite): Promise<void>;
}

export function CreateTaskForm({
  cleaningZones = [],
  loopWaypoints = [],
  deliveryWaypoints = [],
  dispensers = [],
  ingestors = [],
  favoritesTasks = [],
  submitTasks,
  tasksFromFile,
  onClose,
  onSuccess,
  onFail,
  onSuccessFavoriteTask,
  onFailFavoriteTask,
  submitFavoriteTask,
  deleteFavoriteTask,
  ...otherProps
}: CreateTaskFormProps): JSX.Element {
  const theme = useTheme();

  const [openFavoriteDialog, setOpenFavoriteDialog] = React.useState(false);
  const [callToDeleteFavoriteTask, setCallToDeleteFavoriteTask] = React.useState(false);
  const [callToUpdateFavoriteTask, setCallToUpdateFavoriteTask] = React.useState(false);
  const [deletingFavoriteTask, setDeletingFavoriteTask] = React.useState(false);

  const [favoriteTaskBuffer, setFavoriteTaskBuffer] = React.useState<TaskFavorite>(
    defaultFavoriteTask(),
  );
  const [favoriteTaskTitleError, setFavoriteTaskTitleError] = React.useState(false);
  const [savingFavoriteTask, setSavingFavoriteTask] = React.useState(false);

  const [taskRequests, setTaskRequests] = React.useState<TaskRequest[]>(() => [defaultTask()]);
  const [selectedTaskIdx, setSelectedTaskIdx] = React.useState(0);
  const taskTitles = React.useMemo(
    () => taskRequests && taskRequests.map((t, i) => `${i + 1}: ${getShortDescription(t)}`),
    [taskRequests],
  );
  const [submitting, setSubmitting] = React.useState(false);
  const taskRequest = taskRequests[selectedTaskIdx];
  const [openSchedulingDialog, setOpenSchedulingDialog] = React.useState(false);
  const [schedule, setSchedule] = React.useState<Schedule>({
    startOn: new Date(),
    days: [true, true, true, true, true, true, true],
  });
  const [atTime, setAtTime] = React.useState(new Date());
  // schedule is not supported with batch upload
  const scheduleEnabled = taskRequests.length === 1;

  const updateTasks = () => {
    setTaskRequests((prev) => {
      prev.splice(selectedTaskIdx, 1, taskRequest);
      return [...prev];
    });
  };

  const handleTaskDescriptionChange = (newCategory: string, newDesc: TaskDescription) => {
    taskRequest.category = newCategory;
    taskRequest.description = newDesc;
    setFavoriteTaskBuffer({ ...favoriteTaskBuffer, description: newDesc, category: newCategory });
    updateTasks();
  };

  const renderTaskDescriptionForm = () => {
    switch (taskRequest.category) {
      case 'clean':
        return (
          <CleanTaskForm
            taskDesc={taskRequest.description as CleanTaskDescription}
            cleaningZones={cleaningZones}
            onChange={(desc) => handleTaskDescriptionChange('clean', desc)}
          />
        );
      case 'patrol':
        return (
          <LoopTaskForm
            taskDesc={taskRequest.description as LoopTaskDescription}
            loopWaypoints={loopWaypoints}
            onChange={(desc) => handleTaskDescriptionChange('patrol', desc)}
          />
        );
      case 'delivery':
        return (
          <DeliveryTaskForm
            taskDesc={taskRequest.description as DeliveryTaskDescription}
            deliveryWaypoints={deliveryWaypoints}
            dispensers={dispensers}
            ingestors={ingestors}
            onChange={(desc) => handleTaskDescriptionChange('delivery', desc)}
          />
        );
      default:
        return null;
    }
  };
  const handleTaskTypeChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = ev.target.value;
    const newDesc = defaultTaskDescription(newCategory);
    if (newDesc === undefined) {
      return;
    }
    taskRequest.description = newDesc;
    taskRequest.category = newCategory;

    setFavoriteTaskBuffer({ ...favoriteTaskBuffer, category: newCategory, description: newDesc });

    updateTasks();
  };

  // no memo because deps would likely change
  const handleSubmit = async (scheduling: boolean) => {
    if (!submitTasks) {
      onSuccess && onSuccess(taskRequests);
      return;
    }
    try {
      setSubmitting(true);
      await submitTasks(taskRequests, scheduling && scheduleEnabled ? schedule : null);
      setSubmitting(false);
      onSuccess && onSuccess(taskRequests);
    } catch (e) {
      setSubmitting(false);
      onFail && onFail(e as Error, taskRequests);
    }
  };

  const handleSubmitNow: React.MouseEventHandler = async (ev) => {
    ev.preventDefault();
    await handleSubmit(false);
  };

  const handleSubmitSchedule: React.FormEventHandler = async (ev) => {
    ev.preventDefault();
    await handleSubmit(true);
  };

  const handleSubmitFavoriteTask: React.MouseEventHandler = async (ev) => {
    ev.preventDefault();

    if (!favoriteTaskBuffer.name) {
      setFavoriteTaskTitleError(true);
      return;
    }

    setFavoriteTaskTitleError(false);

    if (!submitFavoriteTask) {
      return;
    }
    try {
      setSavingFavoriteTask(true);
      await submitFavoriteTask(favoriteTaskBuffer);
      setSavingFavoriteTask(false);
      onSuccessFavoriteTask &&
        onSuccessFavoriteTask(
          `${!favoriteTaskBuffer.id ? `Created` : `Edited`}  favorite task successfully`,
          favoriteTaskBuffer,
        );
      setOpenFavoriteDialog(false);
      setCallToUpdateFavoriteTask(false);
    } catch (e) {
      setSavingFavoriteTask(false);
      onFailFavoriteTask && onFailFavoriteTask(e as Error, favoriteTaskBuffer);
    }
  };

  const handleDeleteFavoriteTask: React.MouseEventHandler = async (ev) => {
    ev.preventDefault();

    if (!deleteFavoriteTask) {
      return;
    }
    try {
      setDeletingFavoriteTask(true);
      await deleteFavoriteTask(favoriteTaskBuffer);
      setDeletingFavoriteTask(false);
      onSuccessFavoriteTask &&
        onSuccessFavoriteTask('Deleted favorite task successfully', favoriteTaskBuffer);

      setTaskRequests([defaultTask()]);
      setOpenFavoriteDialog(false);
      setCallToDeleteFavoriteTask(false);
      setCallToUpdateFavoriteTask(false);
    } catch (e) {
      setDeletingFavoriteTask(false);
      onFailFavoriteTask && onFailFavoriteTask(e as Error, favoriteTaskBuffer);
    }
  };

  const handleSelectFileClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!tasksFromFile) {
      return;
    }
    (async () => {
      const newTasks = await tasksFromFile();
      if (newTasks.length === 0) {
        return;
      }
      setTaskRequests(newTasks);
      setSelectedTaskIdx(0);
    })();
  };

  const submitText = taskRequests.length > 1 ? 'Submit All Now' : 'Submit Now';

  return (
    <>
      <StyledDialog
        title="Create Task"
        maxWidth="lg"
        fullWidth={taskRequests.length > 1}
        disableEnforceFocus
        {...otherProps}
      >
        <form aria-label="create-task">
          <DialogTitle>
            <Grid container wrap="nowrap">
              <Grid item className={classes.title}>
                Create Task
              </Grid>
              <Grid item>
                <FormToolbar onSelectFileClick={handleSelectFileClick} />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <Grid container direction="row" wrap="nowrap">
              <List dense className={classes.taskList} aria-label="Favorites Tasks">
                <Typography variant="h6" component="div">
                  Favorite tasks
                </Typography>
                {favoritesTasks.map((favoriteTask, index) => {
                  return (
                    <FavoriteTask
                      listItemText={favoriteTask.name}
                      key={index}
                      setFavoriteTask={setFavoriteTaskBuffer}
                      favoriteTask={favoriteTask}
                      setCallToDelete={setCallToDeleteFavoriteTask}
                      setCallToUpdate={setCallToUpdateFavoriteTask}
                      setOpenDialog={setOpenFavoriteDialog}
                      listItemClick={() => {
                        setFavoriteTaskBuffer(favoriteTask);
                        setTaskRequests((prev) => {
                          return [
                            ...prev,
                            {
                              category: favoriteTask.category,
                              description: favoriteTask.description,
                              unix_millis_earliest_start_time: Date.now(),
                              priority: favoriteTask.priority,
                            },
                          ];
                        });
                      }}
                    />
                  );
                })}
              </List>

              <Divider
                orientation="vertical"
                flexItem
                style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
              />

              <Grid>
                <TextField
                  select
                  id="task-type"
                  label="Task Category"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={taskRequest.category}
                  onChange={handleTaskTypeChange}
                >
                  <MenuItem value="clean">Clean</MenuItem>
                  <MenuItem value="patrol">Loop</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                </TextField>
                <Grid container wrap="nowrap">
                  <Grid style={{ flexGrow: 1 }}>
                    <DateTimePicker
                      inputFormat={'MM/dd/yyyy HH:mm'}
                      value={
                        taskRequest.unix_millis_earliest_start_time
                          ? new Date(taskRequest.unix_millis_earliest_start_time)
                          : new Date()
                      }
                      onChange={(date) => {
                        if (!date) {
                          return;
                        }
                        taskRequest.unix_millis_earliest_start_time = date.valueOf();
                        setFavoriteTaskBuffer({
                          ...favoriteTaskBuffer,
                          unix_millis_earliest_start_time: date.valueOf(),
                        });
                        updateTasks();
                      }}
                      label="Start Time"
                      renderInput={(props) => <TextField {...props} />}
                    />
                  </Grid>
                  <Grid
                    style={{
                      flex: '0 1 5em',
                      marginLeft: theme.spacing(2),
                      marginRight: theme.spacing(2),
                    }}
                  >
                    <PositiveIntField
                      id="priority"
                      label="Priority"
                      margin="normal"
                      // FIXME(AA): The priority object is currently undefined.
                      value={(taskRequest.priority as Record<string, number>)?.value || 0}
                      onChange={(_ev, val) => {
                        taskRequest.priority = { type: 'binary', value: val };
                        setFavoriteTaskBuffer({
                          ...favoriteTaskBuffer,
                          priority: { type: 'binary', value: val },
                        });
                        updateTasks();
                      }}
                    />
                  </Grid>
                </Grid>
                {renderTaskDescriptionForm()}
                <Grid container justifyContent="center">
                  <Button
                    aria-label="Save as a favorite task"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      !callToUpdateFavoriteTask &&
                        setFavoriteTaskBuffer({ ...favoriteTaskBuffer, name: '', id: '' });
                      setOpenFavoriteDialog(true);
                    }}
                  >
                    {callToUpdateFavoriteTask ? `Confirm edits` : 'Save as a favorite task'}
                  </Button>
                </Grid>
              </Grid>
              {taskTitles.length > 1 && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
                  />
                  <List dense className={classes.taskList} aria-label="Tasks List">
                    {taskTitles.map((title, idx) => (
                      <ListItem
                        key={idx}
                        button
                        onClick={() => setSelectedTaskIdx(idx)}
                        className={selectedTaskIdx === idx ? classes.selectedTask : undefined}
                        role="listitem button"
                      >
                        <ListItemText primary={title} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              disabled={submitting}
              className={classes.actionBtn}
              onClick={(ev) => onClose && onClose(ev, 'escapeKeyDown')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={submitting}
              className={classes.actionBtn}
              onClick={() => setOpenSchedulingDialog(true)}
            >
              Add to Schedule
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={submitting}
              className={classes.actionBtn}
              onClick={handleSubmitNow}
            >
              <Loading hideChildren loading={submitting} size="1.5em" color="inherit">
                {submitText}
              </Loading>
            </Button>
          </DialogActions>
        </form>
      </StyledDialog>
      {openFavoriteDialog && (
        <ConfirmationDialog
          confirmText={callToDeleteFavoriteTask ? 'Delete' : 'Save'}
          cancelText="Back"
          open={openFavoriteDialog}
          title={callToDeleteFavoriteTask ? 'Confirm Delete' : 'Favorite Task'}
          submitting={callToDeleteFavoriteTask ? deletingFavoriteTask : savingFavoriteTask}
          onClose={() => {
            setOpenFavoriteDialog(false);
            setCallToDeleteFavoriteTask(false);
          }}
          onSubmit={callToDeleteFavoriteTask ? handleDeleteFavoriteTask : handleSubmitFavoriteTask}
        >
          {!callToDeleteFavoriteTask && (
            <TextField
              size="small"
              value={favoriteTaskBuffer.name}
              onChange={(e) =>
                setFavoriteTaskBuffer({ ...favoriteTaskBuffer, name: e.target.value })
              }
              helperText="Required"
              error={favoriteTaskTitleError}
            />
          )}
          {callToDeleteFavoriteTask && (
            <Typography>{`Are you sure you want to delete "${favoriteTaskBuffer.name}"?`}</Typography>
          )}
        </ConfirmationDialog>
      )}
      {openSchedulingDialog && (
        <ConfirmationDialog
          confirmText="Schedule"
          cancelText="Cancel"
          open={openSchedulingDialog}
          title="Schedule Task"
          submitting={false}
          onClose={() => setOpenSchedulingDialog(false)}
          onSubmit={(ev) => {
            handleSubmitSchedule(ev);
            setOpenSchedulingDialog(false);
          }}
        >
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={6}>
              <DatePicker
                value={schedule.startOn}
                onChange={(date) =>
                  date &&
                  setSchedule((prev) => {
                    date.setHours(atTime.getHours());
                    date.setMinutes(atTime.getMinutes());
                    return { ...prev, startOn: date };
                  })
                }
                label="Start On"
                disabled={!scheduleEnabled}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                value={atTime}
                onChange={(date) => {
                  if (!date) {
                    return;
                  }
                  setAtTime(date);
                  if (!isNaN(date.valueOf())) {
                    setSchedule((prev) => {
                      const startOn = prev.startOn;
                      startOn.setHours(date.getHours());
                      startOn.setMinutes(date.getMinutes());
                      return { ...prev, startOn };
                    });
                  }
                }}
                label="At"
                disabled={!scheduleEnabled}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <DaySelectorSwitch
                value={schedule.days}
                disabled={!scheduleEnabled}
                onChange={(days) => setSchedule((prev) => ({ ...prev, days }))}
              />
            </Grid>
          </Grid>
        </ConfirmationDialog>
      )}
    </>
  );
}
