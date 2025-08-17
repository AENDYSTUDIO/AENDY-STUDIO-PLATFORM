# Инструкция по загрузке проекта на GitHub

## Шаг 1: Инициализация Git репозитория

Если вы еще не инициализировали Git репозиторий, выполните:

```bash
git init
```

## Шаг 2: Создание репозитория на GitHub

1. Перейдите на [GitHub](https://github.com)
2. Нажмите на "+" в правом верхнем углу и выберите "New repository"
3. Заполните информацию о репозитории:
   - **Repository name**: `music-stream-platform` (или любое другое имя)
   - **Description**: `Децентрализованная музыкальная стриминговая платформа на Next.js`
   - Установите флажок **Public** (если хотите публичный репозиторий)
   - Установите флажок **Add a README file** (если хотите)
   - Установите флажок **Add .gitignore** (если хотите)
   - Выберите **Node** для .gitignore шаблона
4. Нажмите "Create repository"

## Шаг 3: Связывание локального репозитория с GitHub

После создания репозитория на GitHub, скопируйте URL репозитория (например: `https://github.com/username/music-stream-platform.git`)

Выполните в терминале:

```bash
# Добавление удаленного репозитория
git remote add origin https://github.com/username/music-stream-platform.git

# Переименование ветки (если нужно)
git branch -M main
```

## Шаг 4: Коммит и отправка кода

```bash
# Добавление всех файлов в индекс
git add .

# Создание первого коммита
git commit -m "Initial commit: MusicStream platform setup

- Next.js 15 with App Router
- TypeScript and Tailwind CSS
- Prisma ORM with SQLite database
- Authentication system
- Music player component
- Track upload functionality
- Playlist management
- Rewards system with SAUDIO tokens
- Responsive UI with shadcn/ui components"

# Отправка кода на GitHub
git push -u origin main
```

## Шаг 5: Проверка репозитория

Перейдите на страницу вашего репозитория на GitHub и убедитесь, что все файлы успешно загружены.

## Дополнительные шаги

### Настройка GitHub Pages (для деплоя)

Если вы хотите развернуть проект на GitHub Pages:

1. В настройках репозитория перейдите в раздел "Pages"
2. В разделе "Build and deployment" выберите источник "GitHub Actions"
3. Создайте файл `.github/workflows/deploy.yml` со следующим содержимым:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Export static files
      run: npm run export
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### Добавление лицензии

Создайте файл `LICENSE` с лицензией MIT:

```bash
echo "MIT License

Copyright (c) 2024 MusicStream

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE." > LICENSE
```

### Добавление файла CONTRIBUTING.md

Создайте файл `CONTRIBUTING.md` для руководства по внесению вклада:

```bash
echo "# Внесение вклада в MusicStream

Спасибо за ваш интерес к развитию проекта!

## Как внести вклад

1. Форкните репозиторий
2. Создайте ветку для вашей функции (\`git checkout -b feature/amazing-feature\`)
3. Закоммитьте ваши изменения (\`git commit -m 'Add some amazing feature'\`)
4. Запушьте ветку (\`git push origin feature/amazing-feature\`)
5. Откройте Pull Request

## Требования к коду

- Следуйте существующему стилю кода
- Добавляйте комментарии для сложных участков
- Убедитесь, что код проходит линтинг (\`npm run lint\`)
- Тестируйте ваши изменения

## Лицензия

Внося вклад, вы соглашаетесь, что ваш вклад будет распространяться под лицензией MIT." > CONTRIBUTING.md
```

## Полезные команды Git

```bash
# Проверка статуса
git status

# Просмотр истории коммитов
git log --oneline

# Просмотр удаленных репозиториев
git remote -v

# Создание новой ветки
git checkout -b feature/new-feature

# Переключение между ветками
git checkout main

# Слияние веток
git merge feature/new-feature

# Удаление ветки
git branch -d feature/new-feature
```

## Решение распространенных проблем

### Ошибка аутентификации
Если у вас возникли проблемы с аутентификацией:

1. Убедитесь, что вы используете правильный URL репозитория
2. Проверьте настройки SSH ключей или используйте HTTPS с токеном доступа
3. Обновите учетные данные Git:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Проблемы с большими файлами
Если у вас есть большие файлы (например, аудиофайлы), рассмотрите использование Git LFS:

```bash
# Установка Git LFS
git lfs install

# Отслеживание больших файлов
git lfs track "*.mp3"
git lfs track "*.wav"
git lfs track "*.flac"

# Добавление .gitattributes
git add .gitattributes
```

### Конфликты слияния
Если возникли конфликты при слиянии:

1. Решите конфликты в файлах
2. Добавьте разрешенные файлы:
   ```bash
   git add .
   ```
3. Завершите слияние:
   ```bash
   git commit -m "Resolve merge conflicts"
   ```

Теперь ваш проект готов к работе на GitHub!