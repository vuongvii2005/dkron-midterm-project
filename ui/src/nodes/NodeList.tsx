import {
    List,
    Datagrid,
    TextField,
    FunctionField
} from 'react-admin';
import { Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import DnsIcon from '@mui/icons-material/Dns';

const NodeHeader = () => (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(46, 204, 113, 0.2)',
            }}
        >
            <DnsIcon />
        </Box>
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Cluster Nodes
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Monitor your distributed Dkron server instances and their status
            </Typography>
        </Box>
    </Box>
);

const StyledDatagrid = styled(Datagrid)(({ theme }) => ({
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
        padding: "12px 8px",
    },
}));

// Đã sửa: Check Status = 1 là Alive theo chuẩn Dkron
const renderStatusChip = (record: any) => {
    const isAlive = record?.Status === 1;
    return isAlive ? (
        <Chip label="Alive" size="small" sx={{ backgroundColor: '#e6f4ea', color: '#137333', fontWeight: 600 }} />
    ) : (
        <Chip label="Dead" size="small" sx={{ backgroundColor: '#fce8e6', color: '#c5221f', fontWeight: 600 }} />
    );
};

export const NodeList = (props: any) => {
    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <NodeHeader />
            <List
                {...props}
                bulkActionButtons={false}
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
                <StyledDatagrid rowClick={false}>
                    {/* Đã sửa: Name, Addr, Tags.version viết hoa chữ đầu */}
                    <TextField source="Name" label="Node Name" sx={{ fontWeight: 500 }} />
                    <TextField source="Addr" label="Address" />

                    <FunctionField
                        label="Status"
                        render={(record: any) => renderStatusChip(record)}
                    />

                    <TextField source="Tags.version" label="Version" defaultValue="-" />
                </StyledDatagrid>
            </List>
        </Box>
    );
};

export default NodeList;