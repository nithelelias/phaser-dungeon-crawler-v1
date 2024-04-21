const TEXTS: Record<string, any> = {};
const LANG = {
  list: [""],
  current: "ES",
};
export function initCsvTextRaw(stringLang: string) { 
  const rows = stringLang.split("\n");

  if (rows.length < 0) return null;

  const cols = rows.shift()!.trim().split(";");
  // remove id0
  cols.shift();
  LANG.list = [...cols];
  //
  rows.forEach((row) => {
    if (row.length < 1) return;
    const values = row.trim().split(";");
    const key = values[0].toLowerCase();
    TEXTS[key] = {};
    cols.forEach((lang, idx) => {
      TEXTS[key][lang] = values[idx + 1];
    });
  });
 
}
function translateWord(word: string) {
  if (word.length < 1) return word;

  if (TEXTS.hasOwnProperty(word)) {
    return TEXTS[word][LANG.current];
  }
  if (TEXTS.hasOwnProperty(word.toLowerCase())) {
    TEXTS[word] = { ...TEXTS[word.toLowerCase()] };
    for (let i in TEXTS[word]) {
      TEXTS[word][i] = TEXTS[word][i].toUpperCase();
    }

    return TEXTS[word][LANG.current];
  }

  return word;
}
export function translate(_texts: string[] | string) {
  const returnAsArray = Array.isArray(_texts);
  const result = [""].concat(_texts).map((text: string) => {
    return text.split(" ").map(translateWord).join(" ");
  });
  // REMOVE EMPTY
  result.shift();
  return returnAsArray ? result : result[0];
}

export const $t = translate;

export function getLang() {
  return LANG.current;
}
export function setLang(lang: string) {
  if (LANG.list.includes(lang.toUpperCase())) {
    LANG.current = lang.toUpperCase();
  }
  return LANG.current;
}

export function getLangList(){
  return [...LANG.list];
}