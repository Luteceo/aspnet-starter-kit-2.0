import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div>
            <Link className='navbar-brand' to={'/'}>Server</Link>
            <ul>
                <li>
                    <NavLink exact to={'/'}>Home</NavLink>
                </li>
                <li>
                    <NavLink to={'/counter'}>Counter</NavLink>
                </li>
                <li>
                    <NavLink to={'/fetchdata'}>Fetch data</NavLink>
                </li>
            </ul>
        </div>;
    }
}
