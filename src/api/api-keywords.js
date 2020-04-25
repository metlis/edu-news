const keywords = (function () {
  const categories = {
    'Все новости': ['(министерство образования)', '(министерство просвещения)', 'минобразования',
      'минобр', 'минпросвещения', 'егэ', 'огэ', 'фгос', 'доу', 'вуз', 'ректор', 'декан',
      '(высшее учебное заведение)', '(высшее образование)', '(вступительные экзамены)',
      '(средняя школа)', '(начальная школа)', 'учитель', '(начальные классы)', '(средние классы)',
      'старшеклассники', 'старшеклассник', 'фгос', 'гимназия', 'лицей', 'доу', '(учебный год)'],
    ВУЗы: ['вуз', 'ректор', 'декан', '(высшее учебное заведение)', '(высшее образование)',
      '(вступительные экзамены)'],
    'Средняя школа': ['(средняя школа)', '(начальная школа)', 'учитель', 'фгос', 'гимназия', 'лицей',
      'егэ', 'огэ', '(начальные классы)', '(средние классы)', 'старшеклассники', 'старшеклассник'],
    ЕГЭ: ['егэ', '(единый государственный экзамен)', '(единый госэкзамен)'],
    ОГЭ: ['огэ'],
  };

  function setCategory(catName, catValue) {
    categories[catName] = catValue;
  }

  function getCategory(catName) {
    return categories[catName] ? categories[catName] : false;
  }

  function getCategoriesNames() {
    return Object.keys(categories);
  }

  function getCategoryKeysStr(cat) {
    let str = '';
    if (categories[cat]) str = categories[cat].join(' OR ');
    return encodeURI(str);
  }

  return {
    setCategory,
    getCategory,
    getCategoriesNames,
    getCategoryKeysStr,
  };
}());
export default keywords;
