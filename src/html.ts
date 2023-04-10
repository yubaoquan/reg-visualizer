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

  /*
   * 只替换 reg 中的反斜杠, 不要替换 logic 中的反斜杠, 所以替换反斜杠时在 reg 上调用 replace
   * 整个 logic 中的 $ 要替换成 $$, 以便在后面组装 html 时调用 replace 再转义回 $, 所以替换 $ 时在 logic 上调用 replace
   */
  const finalLogicCode = logic
    .replace('==regexp==', reg.replace(/\\/g, '\\\\'))
    .replace(/\$/g, '$$$$');

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
