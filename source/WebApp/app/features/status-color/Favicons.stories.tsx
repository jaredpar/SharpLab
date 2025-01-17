import React from 'react';
import { RecoilRoot } from 'recoil';
import { recoilTestState } from '../../shared/helpers/testing/recoilTestState';
import { useReactTestRender } from '../../shared/helpers/testing/useReactTestRender';
import { onlineState } from '../../shared/state/onlineState';
import { minimalResultAction } from '../../shared/testing/minimalResultAction';
import { ResultRoot } from '../../shared/testing/ResultRoot';
import { UserTheme, userThemeState } from '../dark-mode/themeState';
import { Favicons } from './Favicons';

export default {
    component: Favicons
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TemplateProps = {
    offline?: boolean;
    error?: boolean;
    dark?: boolean;
};

const renderFavicons = ({ offline, error, dark }: TemplateProps) => {
    return <RecoilRoot initializeState={recoilTestState(
        [onlineState, !offline],
        [userThemeState, (dark ? 'dark' : 'light') as UserTheme]
    )}>
        <ResultRoot action={minimalResultAction({ error })}>
            <Favicons />
        </ResultRoot>
    </RecoilRoot>;
};

type FaviconLink = {
    type: 'link';
    props: {
        type: string;
        href: string;
        sizes?: string;
    };
};

const Template: React.FC<TemplateProps> = ({ offline, error, dark }) => {
    const faviconLinks = useReactTestRender(
        () => renderFavicons({ offline, error, dark }),
        ({ root }) => root.findAllByType('link'),
        [offline, error, dark]
    ) as ReadonlyArray<FaviconLink> | undefined;

    if (!faviconLinks)
        return null;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const svg = faviconLinks.find(l => l.props.type === 'image/svg+xml')!;
    const firstColumnStyle = { minWidth: '5em' } as const;
    const rows: Array<React.ReactNode> = [<tr key='svg'>
        <td style={firstColumnStyle}>SVG</td>
        <td><img src={svg.props.href} width="64" height="64" /></td>
    </tr>];

    const nonSvg = faviconLinks.filter(l => l !== svg);
    if (!nonSvg.every(l => l.props.href.startsWith('data:'))) {
        return <>
            <table>
                <tbody>{rows}</tbody>
            </table>
            Default images other than SVG are not available in Storybook at the moment.
        </>;
    }

    rows.push(nonSvg.map((link, index) => <tr key={index}>
        <td style={firstColumnStyle}>{link.props.sizes}</td>
        <td><img src={link.props.href} /></td>
    </tr>));
    return <table>
        <tbody>{rows}</tbody>
    </table>;
};

export const Default = () => <Template />;
export const Error = () => <Template error />;
export const Offline = () => <Template offline />;
export const DarkMode = () => <Template dark />;