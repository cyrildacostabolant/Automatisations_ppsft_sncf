import { ErpTab } from '../types';

export type TargetBrowser = 'edge' | 'chrome' | 'default';

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Generates a standard Netscape Bookmarks HTML file compatible with Edge, Chrome and Firefox.
 * Users can import it once and middle-click or right-click > "Open all" on the folder
 * to bypass all JavaScript popup blockers natively.
 */
export function generateBookmarksHtml(
  sourcingTabs: ErpTab[],
  vendorTabs: ErpTab[]
): string {
  const timestamp = Math.floor(Date.now() / 1000);

  const renderLinks = (tabs: ErpTab[]) =>
    tabs
      .map(
        (tab) =>
          `            <DT><A HREF="${escapeHtml(tab.url)}" ADD_DATE="${timestamp}">${escapeHtml(
            `${tab.name} [${tab.envName}]`
          )}</A>`
      )
      .join('\n');

  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- Fichier généré automatiquement par Automatisations Peoplesoft SNCF -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Favoris PeopleSoft SNCF</TITLE>
<H1>Favoris PeopleSoft SNCF</H1>
<DL><p>
    <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}" PERSONAL_TOOLBAR_FOLDER="true">PeopleSoft SNCF</H3>
    <DL><p>
        <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">Forcer Sourcing DA (${sourcingTabs.length} onglets)</H3>
        <DL><p>
${renderLinks(sourcingTabs)}
        </DL><p>
        <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">Codification Fournisseur (${vendorTabs.length} onglets)</H3>
        <DL><p>
${renderLinks(vendorTabs)}
        </DL><p>
    </DL><p>
</DL><p>
`;
}

/**
 * Generates a Windows .bat launcher script that opens all tabs directly via the OS,
 * completely bypassing browser web-page popup blockers.
 */
export function generateBatScript(
  tabs: ErpTab[],
  browser: TargetBrowser,
  moduleLabel: string
): string {
  const sanitizeBatUrl = (url: string) => url.replace(/%/g, '%%');

  const lines: string[] = [
    '@echo off',
    'chcp 65001 >nul',
    `title Lanceur PeopleSoft - ${moduleLabel}`,
    `echo Ouverture automatique des ${tabs.length} onglets PeopleSoft (${moduleLabel})...`,
    'echo.',
  ];

  if (browser === 'edge' || browser === 'chrome') {
    const exe = browser === 'edge' ? 'msedge' : 'chrome';
    const quotedUrls = tabs.map((t) => `"${sanitizeBatUrl(t.url)}"`).join(' ');
    lines.push(`start "" ${exe} ${quotedUrls}`);
  } else {
    tabs.forEach((tab, index) => {
      lines.push(`echo [${index + 1}/${tabs.length}] ${tab.code} (${tab.envName})`);
      lines.push(`start "" "${sanitizeBatUrl(tab.url)}"`);
      if (index < tabs.length - 1) {
        lines.push('timeout /t 1 /nobreak >nul');
      }
    });
  }

  lines.push('echo.');
  lines.push('echo Tous les onglets ont ete envoyes au navigateur.');
  lines.push('timeout /t 2 >nul');

  return lines.join('\r\n') + '\r\n';
}

/**
 * Generates a single-line PowerShell command for environments where .bat downloads are restricted.
 */
export function generatePowerShellCommand(
  tabs: ErpTab[],
  browser: TargetBrowser
): string {
  const urlList = tabs.map((t) => `'${t.url}'`).join(',');
  if (browser === 'edge') {
    return `Start-Process msedge.exe -ArgumentList @(${urlList})`;
  }
  if (browser === 'chrome') {
    return `Start-Process chrome.exe -ArgumentList @(${urlList})`;
  }
  return `@(${urlList}) | ForEach-Object { Start-Process $_; Start-Sleep -Milliseconds 300 }`;
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/plain;charset=utf-8'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
