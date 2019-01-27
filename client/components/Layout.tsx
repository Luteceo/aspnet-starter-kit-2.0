import * as React from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return <div style={{display: 'flex'}}>
                <div style={{width: 250}}>
                    <NavMenu />
                </div>
                <div style={{flex: 1}}>
                    { this.props.children }
                </div>
        </div>;
    }
}
