import { 
  createQuest, 
  readQuest, 
  listQuests, 
  deleteQuest, 
  backupData 
} from './src/fs/questManager.js';

const args = process.argv.slice(2);
const command = args[0];

try {
  switch (command) {
    case 'create':
      if (args.length < 5) {
        throw new Error('Недостаточно аргументов для создания. Используйте: node app.js create <id> <title> <author> <isbn> <year>');
      }
      createQuest(args[1], args[2], args[3], args[4], args[5]);
      break;

    case 'read':
      if (!args[1]) {
        throw new Error('Укажите ID записи. Пример: node app.js read 1');
      }
      readQuest(args[1]);
      break;

    case 'list':
      listQuests();
      break;

    case 'delete':
      if (!args[1]) {
        throw new Error('Укажите ID записи для удаления. Пример: node app.js delete 1');
      }
      deleteQuest(args[1]);
      break;

    case 'backup':
      const backupPath = args[1] || './data/backup';
      backupData(backupPath);
      break;

    default:
      console.log('❌ Неизвестная команда!');
      console.log('Доступные команды:');
      console.log('  node app.js create <id> <title> <author> <isbn> <year>');
      console.log('  node app.js read <id>');
      console.log('  node app.js list');
      console.log('  node app.js delete <id>');
      console.log('  node app.js backup [путь]');
      break;
  }
} catch (error) {
  console.error('❌ Ошибка:', error.message);
  process.exit(1);
}