import { observable, configure, action } from 'mobx';
import i18nApi from '@api/i18n';
import { usei18n } from '@config/setting';

interface Languages {
  lang: string;
  langName: string;
  version: number;
}

configure({ enforceActions: 'observed' });
class LocaleStore {
  @observable lang: string = localStorage.getItem('RA-lang') || 'zh_CN';
  @observable localeContent: any = {};
  @observable languages: Languages[] = [];
  dict: string = '';

  constructor() {
    usei18n && this.initLocaleList();
  }

  async initLocaleList() {
    await this.dispatchI18nDict();
    await this.dispatchDictLanguage();
    await this.dispachLocaleContent();
  }

  async dispatchI18nDict() {
    const dictRes = await i18nApi.getStaticDict();
    const dicts = dictRes.data;
    this.setDict(dicts[0]);
  }

  @action setDict(dict: string) {
    this.dict = dict;
  }

  async dispatchDictLanguage() {
    const languageRes = await i18nApi.getStaticDictLanguageByName(this.dict);
    this.setLanguages(languageRes.data);
  }

  @action setLanguages(data: Languages[]) {
    this.languages = data;
  }

  async dispachLocaleContent() {
    const { lang, dict } = this;
    const contentRes = await i18nApi.getStaticDictContent(dict, lang);
    const data = JSON.parse(contentRes.data);
    this.setLocaleContent(data);
  }

  @action setLocale(key: string): void {
    this.lang = key;
    localStorage.setItem('RA-lang', key);
    this.dispachLocaleContent();
  }

  @action setLocaleContent(data: any) {
    this.localeContent = data;
  }
}

export const localeStore = new LocaleStore();
export default LocaleStore;
