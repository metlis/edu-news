const keywords = (function () {
  const categories = {
    'Все новости': ['(министерство образования)', '(министерство просвещения)'],
    'Дошкольное образование': ['(детский сад)', 'ДОУ', 'дошкольник', 'дошкольный', 'воспитатель',
      'дошкольное образование'],
    'Средняя школа': ['школьник', 'школа', 'учитель', 'фгос', 'гимназия', 'лицей'],
    ЕГЭ: ['егэ', 'единый государственный экзамен'],
    'Высшая школа': ['вуз', 'университет', 'институт', 'студент', 'высшее учебное заведение',
      'высшее образование'],
    Профобразование: ['профессиональное образование', 'техникум', 'училище',
      'профобразование'],
    'Последипломное образование': ['повышение квалификации', 'последипломное образование',
      'профессиональная переподготовка', 'переподготовка кадров'],
    Репетиторство: ['репетитор', 'репетиторство'],
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
