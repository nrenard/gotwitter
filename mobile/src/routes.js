import { createStackNavigator } from 'react-navigation';

import Login from './page/Login';
import Timeline from './page/Timeline';
import New from './page/New';

const Routes = createStackNavigator({
    Login,
    Timeline,
    New
});

export default Routes;