import {
    Datagrid,
    TextField,
    NumberField,
    DateField,
    EditButton,
    Filter,
    TextInput,
    List,
    SelectInput,
    BulkDeleteButton,
    BooleanInput,
    Pagination,
    FunctionField,
    ListContextProvider,
    useListContext
} from 'react-admin';
import { Fragment, useMemo, useState } from 'react';
import { Box, MenuItem, TextField as MuiTextField, Typography } from '@mui/material';
import BulkRunButton from "./BulkRunButton";
import BulkToggleButton from "./BulkToggleButton";
import StatusField from "./StatusField";
import EnabledField from "./EnabledField";
import { styled } from '@mui/material/styles';
import UpdateIcon from '@mui/icons-material/Update';

const JobFilter = (props: any) => (
    <Filter {...props}>
        <TextInput
            label="Search"
            source="q"
            alwaysOn
            sx={{ ml: 2 }}
        />
        <SelectInput
            source="status"
            choices={[
                { id: 'success', name: 'Success' },
                { id: 'failed', name: 'Failed' },
                { id: 'untriggered', name: 'Waiting to Run' },
            ]}
        />
        <BooleanInput source="disabled" />
    </Filter>
);

const JobBulkActionButtons = () => (
    <Fragment>
        <BulkRunButton />
        <BulkToggleButton />
        <BulkDeleteButton />
    </Fragment>
);

const JobPagination = (props: any) => <Pagination rowsPerPageOptions={[5, 10, 25, 50, 100]} {...props} />;

const getJobGroupValue = (record: any) => record?.metadata?.group || '';
const getJobGroup = (record: any) => getJobGroupValue(record) || '-';

const JobGroupFilter = ({
    selectedGroup,
    onGroupChange,
}: {
    selectedGroup: string;
    onGroupChange: (group: string) => void;
}) => {
    const { data = [] } = useListContext();
    const groups = useMemo(() => {
        const loadedGroups = new Set<string>();

        data.forEach((job: any) => {
            const group = getJobGroupValue(job);

            if (group) {
                loadedGroups.add(group);
            }
        });

        if (selectedGroup) {
            loadedGroups.add(selectedGroup);
        }

        return Array.from(loadedGroups).sort();
    }, [data, selectedGroup]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1.5 }}>
            <MuiTextField
                select
                label="Group"
                value={selectedGroup}
                onChange={(event) => onGroupChange(event.target.value)}
                size="small"
                sx={{ minWidth: 180 }}
            >
                <MenuItem value="">All groups</MenuItem>
                {groups.map((group) => (
                    <MenuItem key={group} value={group}>
                        {group}
                    </MenuItem>
                ))}
            </MuiTextField>
        </Box>
    );
};

const PREFIX = 'JobList';

const classes = {
    hiddenOnSmallScreens: `${PREFIX}-hiddenOnSmallScreens`,
    cell: `${PREFIX}-cell`,
};

const StyledDatagrid = styled(Datagrid)(({ theme }) => ({
    [`& .${classes.hiddenOnSmallScreens}`]: {
        display: 'table-cell',
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    [`& .${classes.cell}`]: {
        padding: "6px 8px 6px 8px",
    },
    '& .RaDatagrid-headerCell': {
        backgroundColor: '#f7fafc',
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#4a5568',
    },
    '& .RaDatagrid-row': {
        '&:hover': {
            backgroundColor: '#f7fafc',
        },
    },
    '& .RaDatagrid-rowCell': {
        borderBottom: '1px solid #e2e8f0',
    },
}));

const ListHeader = () => (
    <Box
        sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
        }}
    >
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(49, 130, 206, 0.2)',
            }}
        >
            <UpdateIcon />
        </Box>
        <Box>
            <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: 'text.primary' }}
            >
                Scheduled Jobs
            </Typography>
            <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
            >
                Manage your distributed cron jobs
            </Typography>
        </Box>
    </Box>
);

const JobDatagridContent = () => (
    <StyledDatagrid rowClick="show" bulkActionButtons={<JobBulkActionButtons />}>
        <TextField source="id" />
        <TextField source="displayname" label="Display name" />
        <FunctionField
            label="Group"
            render={(record: any) => getJobGroup(record)}
        />
        <TextField source="timezone" sortable={false}
            cellClassName={classes.hiddenOnSmallScreens}
            headerClassName={classes.hiddenOnSmallScreens} />
        <TextField source="schedule" />
        <NumberField source="success_count"
            cellClassName={classes.hiddenOnSmallScreens}
            headerClassName={classes.hiddenOnSmallScreens} />
        <NumberField source="error_count"
            cellClassName={classes.hiddenOnSmallScreens}
            headerClassName={classes.hiddenOnSmallScreens} />
        <DateField source="last_success" showTime />
        <DateField source="last_error" showTime />
        <EnabledField label="Enabled" />
        <NumberField source="retries" sortable={false} />
        <StatusField />
        <DateField source="next" showTime />
        <EditButton/>
    </StyledDatagrid>
);

const JobDatagrid = ({ selectedGroup }: { selectedGroup: string }) => {
    const listContext = useListContext();
    const groupedData = useMemo(() => {
        if (!listContext.data) {
            return undefined;
        }

        const visibleJobs = selectedGroup
            ? listContext.data.filter((job: any) => getJobGroupValue(job) === selectedGroup)
            : listContext.data;

        return [...visibleJobs].sort((jobA: any, jobB: any) => {
            const groupA = getJobGroupValue(jobA);
            const groupB = getJobGroupValue(jobB);
            const groupCompare = groupA.localeCompare(groupB);

            if (groupCompare !== 0) {
                return groupCompare;
            }

            return (jobA.name || jobA.id || '').localeCompare(jobB.name || jobB.id || '');
        });
    }, [listContext.data, selectedGroup]);

    if (!groupedData) {
        return <JobDatagridContent />;
    }

    const groupedContext = {
        ...listContext,
        data: groupedData,
        total: selectedGroup ? groupedData.length : listContext.total,
    } as typeof listContext;

    return (
        <ListContextProvider value={groupedContext}>
            <JobDatagridContent />
        </ListContextProvider>
    );
};

const JobList = (props: any) => {
    const [selectedGroup, setSelectedGroup] = useState('');

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <ListHeader />
            <List
                {...props}
                filters={<JobFilter />}
                pagination={<JobPagination />}
                sx={{
                    '& .RaList-main': {
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                    },
                    '& .RaList-content': {
                        boxShadow: 'none',
                    },
                }}
            >
                <JobGroupFilter selectedGroup={selectedGroup} onGroupChange={setSelectedGroup} />
                <JobDatagrid selectedGroup={selectedGroup} />
            </List>
        </Box>
    );
};

export default JobList;
