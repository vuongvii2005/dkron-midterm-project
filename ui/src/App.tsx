import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DnsIcon from '@mui/icons-material/Dns'; // Thêm icon máy chủ cho đẹp
import { createHashHistory } from "history";

import jobs from './jobs';
import { BusyList } from './executions/BusyList';
// Nhúng giao diện NodeList vào (Đảm bảo bạn đã tạo file này ở thư mục ./nodes/NodeList.tsx)
import { NodeList } from './nodes/NodeList';
import { Layout } from './layout';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import Dashboard from './dashboard';
import Settings from './settings/Settings';
import LoginPage from './LoginPage';
import { lightTheme } from './theme';

declare global {
    interface Window {
        DKRON_API_URL: string;
        DKRON_LEADER: string;
        DKRON_UNTRIGGERED_JOBS: string;
        DKRON_FAILED_JOBS: string;
        DKRON_SUCCESSFUL_JOBS: string;
        DKRON_TOTAL_JOBS: string;
        DKRON_ACL_ENABLED: boolean;
    }
}

const history = createHashHistory();

export const App = () => <Admin
    dashboard={Dashboard}
    loginPage={LoginPage}
    authProvider={window.DKRON_ACL_ENABLED ? authProvider : undefined}
    dataProvider={dataProvider}
    layout={Layout}
    theme={lightTheme}
>

    <Resource name="jobs" {...jobs} />
    <Resource name="busy" options={{ label: 'Busy' }} list={BusyList} icon={PlayCircleOutlineIcon} />
    <Resource name="executions" />

    {/* ĐÃ CẬP NHẬT: Gắn NodeList vào resource members và đổi tên hiển thị thành Nodes */}
    <Resource
        name="members"
        options={{ label: 'Nodes' }}
        list={NodeList}
        icon={DnsIcon}
    />

    <CustomRoutes>
        <Route path="/settings" element={<Settings />} />
    </CustomRoutes>
</Admin>;