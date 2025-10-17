# 🎯 План вивчення React для MovieRate проєкту

## 5-денний інтенсивний курс

---

## 📅 **ДЕНЬ 1: React Router v6 - Основа вашого проєкту**

### 🎥 **Відео для перегляду (2-3 години):**

1. **"React Router 6 Tutorial" - The Net Ninja** (плейліст)

   - https://www.youtube.com/playlist?list=PL4cUxeGkcC9gXdVXVJBmHpSI7zCEiIDKb
   - ⏱ Час: ~1.5 години

2. **"React Router v6 in 20 minutes" - WebDevSimplified**

   - https://www.youtube.com/watch?v=Ul3y1LXxzdU
   - ⏱ Час: 20 хвилин

3. **"React Router 6 - Nested Routes" - CodeBrah**
   - https://www.youtube.com/watch?v=0cSVuySEB0A
   - ⏱ Час: 15 хвилин

### 📖 **Документація для прочитання (30 хвилин):**

- **React Router офіційна документація**: https://reactrouter.com/en/main/start/tutorial
- Розділи: Getting Started, Nested Routes, URL Parameters

### 🛠 **Практичне завдання (1 година):**

1. Відкрийте файл `App.jsx` у вашому проєкті
2. Проаналізуйте структуру маршрутів
3. Зрозумійте як працює вкладений маршрут `/movie/:movieId`
4. Подивіться як використовується `<Outlet />` в `MovieDetailsPage.jsx`

### ✅ **Результат дня:**

- Розумієте як працюють маршрути у вашому проєкті
- Знаєте що таке nested routing
- Розумієте useNavigate, useParams, Outlet

---

## 📅 **ДЕНЬ 2: Context API + useReducer - AuthContext розбір**

### 🎥 **Відео для перегляду (2.5 години):**

1. **"React Context API Tutorial" - The Net Ninja**

   - https://www.youtube.com/watch?v=6RhOzQciVwI&list=PL4cUxeGkcC9hNokByJilPg5g9m2APUePI
   - ⏱ Час: ~1 година

2. **"useReducer Hook Explained" - WebDevSimplified**

   - https://www.youtube.com/watch?v=kK_Wqx3RnHk
   - ⏱ Час: 25 хвилин

3. **"Context + useReducer = Magic" - Ben Awad**

   - https://www.youtube.com/watch?v=StABs2PiDqY
   - ⏱ Час: 30 хвилин

4. **"When to use Context vs Redux" - Jack Herrington**
   - https://www.youtube.com/watch?v=MpdFj8MEuJA
   - ⏱ Час: 20 хвилин

### 📖 **Статті для прочитання (45 хвилин):**

1. **"When to use useReducer vs useState"** - Kent C. Dodds
   - https://kentcdodds.com/blog/should-i-usestate-or-usereducer
2. **"How to use React Context effectively"** - Kent C. Dodds
   - https://kentcdodds.com/blog/how-to-use-react-context-effectively

### 🛠 **Практичне завдання (1.5 години):**

1. Відкрийте `src/contexts/AuthContext.jsx`
2. Розберіть кожну дію в `AUTH_ACTIONS`
3. Проаналізуйте `authReducer` функцію
4. Зрозумійте як працює `initializeAuth`
5. Подивіться як використовується `useAuth` в `ProfilePage.jsx`

### ✅ **Результат дня:**

- Розумієте Context API
- Знаєте різницю між useState та useReducer
- Розумієте як працює ваш AuthContext

---

## 📅 **ДЕНЬ 3: API Integration + Custom Hooks**

### 🎥 **Відео для перегляду (2 години):**

1. **"React Custom Hooks" - WebDevSimplified**

   - https://www.youtube.com/watch?v=6ThXsUwLWvc
   - ⏱ Час: 25 хвилин

2. **"Axios Crash Course" - Brad Traversy**

   - https://www.youtube.com/watch?v=6LyagkoRWYA
   - ⏱ Час: 40 хвилин

3. **"React API calls - Best Practices" - Codevolution**

   - https://www.youtube.com/watch?v=DTBta08fXGU
   - ⏱ Час: 30 хвилин

4. **"Error Handling in React" - WebDevSimplified**
   - https://www.youtube.com/watch?v=ZWlVPHcjzHo
   - ⏱ Час: 20 хвилин

### 📖 **Документація (30 хвилин):**

1. **React Custom Hooks**: https://react.dev/learn/reusing-logic-with-custom-hooks
2. **TMDb API Documentation**: https://developers.themoviedb.org/3/getting-started/introduction

### 🛠 **Практичне завдання (1.5 години):**

1. Розберіть файл `src/config/axios.js` - конфігурація API
2. Проаналізуйте `src/services/authService.js` - методи API
3. Подивіться `src/services/moviesService.js` - як працюють запити
4. Зрозумійте структуру `src/services/favoritesService.js`
5. Розберіть як працює error handling у ваших сервісах

### ✅ **Результат дня:**

- Розумієте як створювати custom hooks
- Знаєте як працювати з API через Axios
- Розумієте patterns error handling

---

## 📅 **ДЕНЬ 4: useEffect + Side Effects + Loading States**

### 🎥 **Відео для перегляду (2 години):**

1. **"useEffect Explained" - WebDevSimplified**

   - https://www.youtube.com/watch?v=0ZJgIjIuY7U
   - ⏱ Час: 25 хвилин

2. **"useEffect Complete Guide" - Ben Awad**

   - https://www.youtube.com/watch?v=j1ZRyw7OtZs
   - ⏱ Час: 45 хвилин

3. **"Loading States in React" - The Net Ninja**

   - https://www.youtube.com/watch?v=2yQKi5otJas
   - ⏱ Час: 20 хвилин

4. **"Async useEffect Patterns" - Jack Herrington**
   - https://www.youtube.com/watch?v=QQYeipc_cik
   - ⏱ Час: 30 хвилин

### 📖 **Статті для прочитання (45 хвилин):**

1. **"Complete Guide to useEffect"** - Dan Abramov

   - https://overreacted.io/a-complete-guide-to-useeffect/

2. **"Data Fetching with Hooks"** - React docs
   - https://react.dev/learn/synchronizing-with-effects

### 🛠 **Практичне завдання (1.5 години):**

1. Розберіть усі `useEffect` в `ProfilePage.jsx`
2. Проаналізуйте loading states в `HomePage.jsx`
3. Подивіться як працює пошук в `MoviesPage.jsx`
4. Зрозумійте dependency arrays у всіх useEffect
5. Подивіться на cleanup functions (якщо є)

### ✅ **Результат дня:**

- Розумієте useEffect повністю
- Знаєте як правильно робити API calls
- Розумієте loading та error states

---

## 📅 **ДЕНЬ 5: Authentication Flow + Protected Routes + CSS Modules**

### 🎥 **Відео для перегляду (2 години):**

1. **"React Authentication Tutorial" - WebDevSimplified**

   - https://www.youtube.com/watch?v=PKwu15ldZ7k
   - ⏱ Час: 35 хвилин

2. **"Protected Routes in React Router" - The Net Ninja**

   - https://www.youtube.com/watch?v=2k8NleFjG7I
   - ⏱ Час: 20 хвилин

3. **"CSS Modules in React" - Codevolution**

   - https://www.youtube.com/watch?v=1HZpkc_dUOk
   - ⏱ Час: 25 хвилин

4. **"Local Storage in React" - WebDevSimplified**

   - https://www.youtube.com/watch?v=AUOzvFzdIk4
   - ⏱ Час: 15 хвилин

5. **"React Performance Tips" - Ben Awad**
   - https://www.youtube.com/watch?v=BQ5-oHEoJ38
   - ⏱ Час: 25 хвилин

### 📖 **Документація (30 хвилин):**

1. **CSS Modules**: https://github.com/css-modules/css-modules
2. **React DevTools**: https://react.dev/learn/react-developer-tools

### 🛠 **Практичне завдання (2 години):**

1. Проаналізуйте повний authentication flow:
   - `LoginPage.jsx` → `AuthContext` → `ProfilePage.jsx`
2. Зрозумійте як працює захист маршрутів
3. Розберіть CSS Modules у ваших компонентах
4. Подивіться на PropTypes validation в `NavbarLink.jsx`
5. Проаналізуйте структуру всього проєкту

### ✅ **Результат дня:**

- Розумієте весь authentication flow
- Знаєте як працюють CSS Modules
- Розумієте архітектуру всього проєкту

---

## 🎯 **ПІДСУМОК ТИЖНЯ - Що ви знатимете:**

### ✅ **Технічні навички:**

- React Router v6 (навігація, вкладені маршрути)
- Context API + useReducer (глобальний стан)
- Custom Hooks (винесення логіки)
- API Integration (Axios, обробка даних)
- useEffect (side effects, життєвий цикл)
- Authentication patterns (захист маршрутів)
- CSS Modules (модульні стилі)

### ✅ **Розуміння вашого проєкту:**

- Структура файлів та папок
- Потік даних між компонентами
- Як працює авторизація
- Як відбуваються API запити
- Як працює навігація між сторінками

---

## 📚 **Додаткові ресурси для закріплення:**

### **YouTube канали для підписки:**

- WebDevSimplified
- The Net Ninja
- Ben Awad
- Jack Herrington
- Codevolution

### **Блоги для читання:**

- kentcdodds.com
- overreacted.io (Dan Abramov)
- react.dev/learn

### **Інструменти розробника:**

- React Developer Tools (браузерне розширення)
- Redux DevTools (якщо додасте Redux)

---

## ⚡ **Швидкі поради:**

1. **Не намагайтеся все запам'ятати** - розуміння важливіше
2. **Практикуйте на вашому проєкті** - змінюйте код та експериментуйте
3. **Ведіть нотатки** - записуйте ключові концепції
4. **Не соромтеся перегляну відео повторно** - складні теми потребують часу
5. **Задавайте питання** - якщо щось незрозуміло

**Успіхів у навчанні! 🚀**
