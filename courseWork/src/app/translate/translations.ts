import { OpaqueToken }                 from "@angular/core";
import { LANG_EN_NAME, LANG_EN_TRANS } from "./lang-en";
import { LANG_RU_TRANS, LANG_RU_NAME } from "./lang-ru";

export const TRANSLATIONS = new OpaqueToken('translations');

const dictionary = {
  "en": LANG_EN_TRANS,
  "ru": LANG_RU_TRANS
};

export const TRANSLATION_PROVIDERS = [
  { provide: TRANSLATIONS, useValue: dictionary }
];