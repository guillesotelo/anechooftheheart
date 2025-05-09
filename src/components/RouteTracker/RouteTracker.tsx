import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { dataObj } from '../../types';

type Props = {
    history: dataObj
}

const RouteTracker = ({ history }: Props) => {

    history.listen((location: string, action: string) => {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.send({
            hitType: 'pageview',
            page: window.location.pathname
        })
    });

    return <div></div>;
};

export default withRouter(RouteTracker);