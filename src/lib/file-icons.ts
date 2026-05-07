export const FILE_ICON_MAP: Record<string, string> = {
  ai: "/files-icons/Property 1=001-adobe illustrator.svg",
  apk: "/files-icons/Property 1=002-apk.svg",
  css: "/files-icons/Property 1=003-css.svg",
  doc: "/files-icons/Property 1=005-doc.svg",
  docx: "/files-icons/Property 1=005-doc.svg",
  xls: "/files-icons/Property 1=031-xls.svg",
  xlsx: "/files-icons/Property 1=006-excel.svg",
  iso: "/files-icons/Property 1=008-iso.svg",
  js: "/files-icons/Property 1=009-javascript.svg",
  jpg: "/files-icons/Property 1=010-image.svg",
  jpeg: "/files-icons/Property 1=010-image.svg",
  png: "/files-icons/Property 1=010-image.svg",
  gif: "/files-icons/Property 1=010-image.svg",
  webp: "/files-icons/Property 1=010-image.svg",
  mp3: "/files-icons/Property 1=013-mp3.svg",
  mp4: "/files-icons/Property 1=014-video.svg",
  mov: "/files-icons/Property 1=014-video.svg",
  wav: "/files-icons/Property 1=015-music.svg",
  pdf: "/files-icons/Property 1=016-pdf.svg",
  php: "/files-icons/Property 1=017-php.svg",
  pptx: "/files-icons/Property 1=018-powerpoint.svg",
  ppt: "/files-icons/Property 1=019-ppt.svg",
  psd: "/files-icons/Property 1=020-psd.svg",
  sql: "/files-icons/Property 1=022-sql.svg",
  svg: "/files-icons/Property 1=023-svg.svg",
  txt: "/files-icons/Property 1=026-txt.svg",
  ttf: "/files-icons/Property 1=025-ttf.svg",
  woff: "/files-icons/Property 1=007-font file.svg",
  zip: "/files-icons/Property 1=032-zip.svg",
  rar: "/files-icons/Property 1=032-zip.svg",
};

export const DEFAULT_FILE_ICON = "/files-icons/Property 1=024-text.svg";

export function getFileIcon(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return FILE_ICON_MAP[ext] ?? DEFAULT_FILE_ICON;
}
