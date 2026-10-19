import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ru: {
    translation: {
      "app_title": "ExtraQuest BY",
      "quests": "Квесты",
      "admin_panel": "Админ-панель",
      "hero_title": "Забронируй лучший квест в Минске",
      "hero_subtitle": "Живые эмоции, сложные загадки и профессиональные актеры",
      "search_placeholder": "Поиск квеста по названию...",
      "genre": "Жанр",
      "genre_all": "Все",
      "sort_by": "Сортировка",
      "sort_rating": "По рейтингу",
      "sort_price_asc": "Сначала дешевле",
      "sort_price_desc": "Сначала дороже",
      "btn_info": "Инфо",
      "btn_book": "Бронь",
      "btn_add": "Добавить квест",
      "btn_edit": "Изменить",
      "btn_delete": "Удалить",
      "btn_save": "Сохранить",
      "btn_cancel": "Отмена",
      "no_quests": "Ничего не найдено по вашему запросу.",
      "price": "BYN"
    }
  },
  en: {
    translation: {
      "app_title": "ExtraQuest BY",
      "quests": "Quests",
      "admin_panel": "Admin Panel",
      "hero_title": "Book the best quest in Minsk",
      "hero_subtitle": "Live emotions, challenging puzzles, and professional actors",
      "search_placeholder": "Search quest by title...",
      "genre": "Genre",
      "genre_all": "All",
      "sort_by": "Sort by",
      "sort_rating": "By rating",
      "sort_price_asc": "Price: Low to High",
      "sort_price_desc": "Price: High to Low",
      "btn_info": "Info",
      "btn_book": "Book",
      "btn_add": "Add Quest",
      "btn_edit": "Edit",
      "btn_delete": "Delete",
      "btn_save": "Save",
      "btn_cancel": "Cancel",
      "no_quests": "No quests found matching your criteria.",
      "price": "BYN"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;