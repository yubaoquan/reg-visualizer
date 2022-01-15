import htmlTemplate from './webview/reg.html.raw';
import header from './webview/header.html.raw';
import fork from './webview/fork.html.raw';
import footer from './webview/footer.html.raw';
import style from './webview/reg.css.raw';
import logic from './webview/logic.js.raw';
import lib from './webview/lib.js.raw';

type Options = {
  hideHeader?: boolean;
  hideFork?: boolean;
  hideFooter?: boolean;
};

const defaultOptions: Options = {};

export const composeHTML = (reg: string, { hideHeader, hideFork, hideFooter } = defaultOptions) => {
  let html = htmlTemplate;
  const finalLogicCode = logic.replace('==regexp==', reg.replace(/\\/g, '\\\\'));

  if (!hideHeader) {
    html = html.replace('<!-- ==header== -->', header);
    if (!hideFork) html = html.replace('<!-- ==fork== -->', fork);
  }

  if (!hideFooter) html = html.replace('<!-- ==footer== -->', footer);

  return html
    .replace('/*==style==*/', style)
    .replace('/*==lib==*/', lib)
    .replace('/*==logic==*/', finalLogicCode);
};
