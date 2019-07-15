import React from 'react';
import styled from 'styled-components';

import { Link } from '@0x/react-shared';

import { colors } from 'ts/style/colors';

interface ITableOfContentsProps {
    contents: IContents[];
}

export interface IContents {
    children: IContents[];
    id: string;
    level: number;
    title: string;
}

export const TableOfContents: React.FC<ITableOfContentsProps> = ({ contents }) => {
    console.log('contents', contents);
    return (
        <ContentList>
            {contents.map(content => {
                const { children, id, title } = content;
                return (
                    <li key={id}>
                        <ContentLink to={id}>{title}</ContentLink>
                        {children.length > 0 && <TableOfContents contents={children} />}
                    </li>
                );
            })}
        </ContentList>
    );
};

const ContentList = styled.ul`
    ul {
        border-left: 1px solid #e3e3e3;
        padding-left: 0.7rem;

        span {
            font-size: 0.7222rem;
            line-height: 1.45;
        }
    }
`;

const ContentLink = styled(Link)`
    display: block;
    font-size: 0.8333rem;
    color: ${colors.textDarkSecondary};
    margin-bottom: 1rem;
`;
