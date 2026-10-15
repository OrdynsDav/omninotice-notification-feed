import { mkdirSync, writeFileSync } from 'node:fs';

const TOTAL = 50;
const PER_PAGE = 10;
const OUT_DIR = 'public/mock';

const samples = [
  ['📝', 'Назначена новая задача', 'Вам назначена задача «Подготовить отчёт за квартал». Срок: 20 октября.'],
  ['🌴', 'Отпуск согласован', 'Ваш отпуск с 3 по 17 ноября согласован руководителем.'],
  ['📊', 'Опрос: как вам новый корпоративный портал?', null],
  ['🎉', 'С днём рождения, Анна!', 'Команда поздравляет вас и желает успехов в новом году жизни.'],
  ['🔒', 'Обновлён регламент информационной безопасности', 'Ознакомьтесь с новой версией регламента до конца недели.'],
  ['🛠️', 'Плановые технические работы', 'В субботу с 02:00 до 04:00 сервис будет недоступен.'],
  ['📅', 'Напоминание о встрече', 'Совещание отдела начнётся через 30 минут в переговорной «Север».'],
  ['✅', 'Заявка одобрена', 'Ваша заявка на оборудование одобрена и передана в закупку.'],
  ['📄', 'Новый документ на подпись', null],
  ['🏆', 'Вы в числе лучших сотрудников месяца', 'Поздравляем! Спасибо за вклад в общий результат команды.']
];

const base = new Date('2026-10-14T09:00:00.000Z').getTime();
const HOUR = 3600 * 1000;

const items = Array.from({ length: TOTAL }, (_, i) => {
  const [emoji, title, description] = samples[i % samples.length];
  const date = new Date(base - i * 5 * HOUR).toISOString();
  return {
    status: 'published',
    created_date: date,
    modified_date: date,
    chit: {
      status: 'published',
      created_date: date,
      modified_date: date,
      message_type: 'simple',
      // номер в заголовке, чтобы видеть порядок и отсутствие дублей
      title: `${title} #${i + 1}`,
      description,
      picture:
        i % 4 === 3
          ? null
          : { main: null, preview: null, cover: null, icon: null, emoji },
      message_id: `3fa85f64-5717-4562-b3fc-${String(i + 1).padStart(12, '0')}`
    },
    is_read: i % 3 === 1
  };
});

mkdirSync(OUT_DIR, { recursive: true });

const pages = Math.ceil(TOTAL / PER_PAGE);
for (let p = 1; p <= pages; p++) {
  const data = items.slice((p - 1) * PER_PAGE, p * PER_PAGE);
  const json = {
    data,
    info: {
      api_version: '0.1.0',
      count: data.length,
      total: TOTAL,
      page: p,
      page_size: PER_PAGE
    }
  };
  writeFileSync(`${OUT_DIR}/notifications-${p}.json`, JSON.stringify(json, null, 2));
}

console.log(`Готово: ${pages} файлов, ${TOTAL} записей`);