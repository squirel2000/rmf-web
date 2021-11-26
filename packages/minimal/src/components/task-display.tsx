import React from 'react';
import { makeStyles, TableContainer, Paper } from '@material-ui/core';
import type { TaskSummary } from 'api-client';
import { TaskTable } from 'react-components';

interface TaskDisplayProps {
  tasks: TaskSummary[];
}

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}));

export const TaskDisplay = (props: TaskDisplayProps) => {
  const classes = useStyles();
  const { tasks } = props;
  return (
    <Paper className={classes.root} variant="outlined">
      <TableContainer>
        <TaskTable tasks={tasks} />
      </TableContainer>
    </Paper>
  );
};
