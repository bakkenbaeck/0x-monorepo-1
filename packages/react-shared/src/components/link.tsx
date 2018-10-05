import * as _ from 'lodash';
import * as React from 'react';
import { Link as ReactRounterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

import { LinkType } from '../types';
import { constants } from '../utils/constants';

export interface LinkProps {
    to: string;
    type?: LinkType;
    shouldOpenInNewTab?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onMouseOver?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    containerId?: string;
}

export interface LinkState {}

/**
 * A generic link component which let's the developer render internal, external and scroll-to-hash links, and
 * their associated behaviors with a single link component. Many times we want a menu including a combination of
 * internal, external and scroll links and the abstraction of the differences of rendering each types of link
 * makes it much easier to do so.
 */
export class Link extends React.Component<LinkProps, LinkState> {
    public static defaultProps: Partial<LinkProps> = {
        type: LinkType.ReactRoute,
        shouldOpenInNewTab: false,
        style: {},
        className: '',
        onMouseOver: _.noop.bind(_),
        onMouseLeave: _.noop.bind(_),
        onMouseEnter: _.noop.bind(_),
        containerId: constants.DOCS_CONTAINER_ID,
    };
    private _outerReactScrollSpan: HTMLSpanElement | null;
    constructor(props: LinkProps) {
        super(props);
        this._outerReactScrollSpan = null;
    }
    public render(): React.ReactNode {
        const styleWithDefault = {
            textDecoration: 'none',
            cursor: 'pointer',
            ...this.props.style,
        };

        switch (this.props.type) {
            case LinkType.External:
                return (
                    <a
                        target={this.props.shouldOpenInNewTab ? '_blank' : ''}
                        className={this.props.className}
                        style={styleWithDefault}
                        href={this.props.to}
                        onMouseOver={this.props.onMouseOver}
                        onMouseEnter={this.props.onMouseEnter}
                        onMouseLeave={this.props.onMouseLeave}
                    >
                        {this.props.children}
                    </a>
                );
            case LinkType.ReactRoute:
                return (
                    <ReactRounterLink
                        to={this.props.to}
                        className={this.props.className}
                        style={styleWithDefault}
                        target={this.props.shouldOpenInNewTab ? '_blank' : ''}
                        onMouseOver={this.props.onMouseOver}
                        onMouseEnter={this.props.onMouseEnter}
                        onMouseLeave={this.props.onMouseLeave}
                    >
                        {this.props.children}
                    </ReactRounterLink>
                );
            case LinkType.ReactScroll:
                return (
                    <span ref={input => (this._outerReactScrollSpan = input)}>
                        <ScrollLink
                            to={this.props.to}
                            offset={0}
                            hashSpy={true}
                            duration={constants.DOCS_SCROLL_DURATION_MS}
                            containerId={this.props.containerId}
                            style={styleWithDefault}
                        >
                            <span onClick={this._onClickPropagateClickEventAroundScrollLink.bind(this)}>
                                {this.props.children}
                            </span>
                        </ScrollLink>
                    </span>
                );
            default:
                throw new Error(`Unrecognized LinkType: ${this.props.type}`);
        }
    }
    // HACK(fabio): For some reason, the react-scroll link decided to stop the propagation of click events.
    // We do however rely on these events being propagated in certain scenarios (e.g when the link
    // is within a dropdown we want to close upon being clicked). Because of this, we registry the
    // click event of an inner span, and pass it around the react-scroll link to an outer span.
    private _onClickPropagateClickEventAroundScrollLink(): void {
        if (!_.isNull(this._outerReactScrollSpan)) {
            this._outerReactScrollSpan.click();
        }
    }
}