import io from '@/api/io';

export default {
  getStaticDict() {
    return io.get('/i18nApi/api/staticDict');
  },
  getStaticDictLanguageByName(name) {
    return io.get(`/i18nApi/api/staticDict/version?name=${name}`);
  },
  getStaticDictContent(name, lang, version) {
    return io.get(`/i18nApi/api/staticDict/content?name=${name}&lang=${lang}`);
  }
};
