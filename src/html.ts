import html from './webview/reg.html.raw';
import style from './webview/reg.css.raw';
import logic from './webview/logic.js.raw';
import lib from './webview/lib.js.raw';

export const composeHTML = (reg: string) => {
  let finalReg = reg.trim();
  const wrapedWithDoubleSlash = finalReg.startsWith('/') && finalReg.endsWith('/');
  if (wrapedWithDoubleSlash) finalReg = reg.replace(/^\/|\/$/g, '');

  finalReg = finalReg.replace(/`/g, '\\`');
  const finalLogicCode = logic.replace('==regexp==', finalReg);

  return html
    .replace('/*==style==*/', style)
    .replace('/*==lib==*/', lib)
    .replace('/*==logic==*/', finalLogicCode);
};
