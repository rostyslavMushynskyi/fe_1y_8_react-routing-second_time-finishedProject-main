import { Helmet } from "react-helmet-async";
import styles from "./AuthorPage.module.css";
import rostyslavAvatar from "../assets/rostyslav-avatar.png";
import certificateImg from "../assets/certificate.png";
import certificatePdf from "../assets/certificate.pdf";

function AuthorPage() {
  return (
    <div className={styles.authorPage}>
      <Helmet>
        <title>Про автора | MovieRate</title>
        <meta
          name="description"
          content="Познайомтеся з розробником MovieRate - сучасного веб-додатку для любителів кіно."
        />
      </Helmet>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.avatarContainer}>
            <img
              src={rostyslavAvatar}
              alt="Фото розробника"
              className={styles.avatar}
            />
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              Активний розробник
            </div>
          </div>

          <div className={styles.intro}>
            <h1 className={styles.name}>Ростислав Мушинський</h1>
            <p className={styles.title}>Full-Stack React Developer</p>
            <p className={styles.bio}>
              Студент другого курсу, захоплений веб-розробкою та створенням
              сучасних користувацьких інтерфейсів. Спеціалізуюся на React,
              Node.js та сучасних веб-технологіях.
            </p>

            {/* Contact Buttons */}
            <div className={styles.heroContacts}>
              <a
                href="https://github.com/rostyslavMushynskyi"
                className={styles.contactButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.contactIcon}>⚡</span>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/%D1%80%D0%BE%D1%81%D1%82%D0%B8%D1%81%D0%BB%D0%B0%D0%B2-%D0%BC%D1%83%D1%88%D0%B8%D0%BD%D1%81%D1%8C%D0%BA%D0%B8%D0%B9-983265232/"
                className={styles.contactButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.contactIcon}>💼</span>
                LinkedIn
              </a>
              <a
                href="mailto:rostyslavmushynskyi@gmail.com"
                className={styles.contactButton}
              >
                <span className={styles.contactIcon}>📧</span>
                Email
              </a>
            </div>
          </div>
        </section>

        {/* Certificate Section */}
        <section className={styles.certificateSection}>
          <h2 className={styles.sectionTitle}>Сертифікат Front‑End курсу</h2>
          <div className={styles.certificateCard}>
            <div className={styles.certificateMedia}>
              <img
                src={certificateImg}
                alt="Сертифікат про завершення курсу Front‑End"
                className={styles.certificateImage}
                loading="lazy"
              />
            </div>
            <div className={styles.certificateInfo}>
              <h3 className={styles.certificateTitle}>GoITeens — Front‑End</h3>
              <p className={styles.certificateMeta}>
                Оцінка: <strong>100/100</strong> • 380 годин • Дата: 30.04.2024
              </p>
              <div className={styles.certificateActions}>
                <a
                  href={certificatePdf}
                  className={styles.actionButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Переглянути (PDF)
                </a>
                <a
                  href={certificatePdf}
                  className={styles.actionButton}
                  download
                >
                  Завантажити PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className={styles.techSection}>
          <h2 className={styles.sectionTitle}>Технологічний стек</h2>
          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>⚛️</div>
              <h3>React</h3>
              <p>Сучасна бібліотека для створення інтерфейсів</p>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>🚀</div>
              <h3>React Router</h3>
              <p>Навігація та маршрутизація в SPA</p>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>🎨</div>
              <h3>CSS Modules</h3>
              <p>Стилізація компонентів з ізольованими стилями</p>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>⚡</div>
              <h3>Vite</h3>
              <p>Швидкий інструмент збирання проектів</p>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>🔗</div>
              <h3>Context API</h3>
              <p>Управління глобальним станом додатку</p>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>🎭</div>
              <h3>TMDb API</h3>
              <p>Інтеграція з базою даних фільмів</p>
            </div>
          </div>
        </section>

        {/* About Project Section */}
        <section className={styles.projectSection}>
          <h2 className={styles.sectionTitle}>Про проект MovieRate</h2>
          <div className={styles.projectInfo}>
            <div className={styles.projectCard}>
              <div className={styles.cardIcon}>🎬</div>
              <h3>Концепція</h3>
              <p>
                MovieRate - це сучасний веб-додаток для любителів кіно,
                створений як самостійна робота з використанням React та сучасних
                веб-технологій.
              </p>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.cardIcon}>✨</div>
              <h3>Особливості</h3>
              <p>
                Автентифікація користувачів, управління улюбленими фільмами,
                пошук та фільтрація, адаптивний дизайн з Glassmorphism UI.
              </p>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.cardIcon}>🔥</div>
              <h3>Функціонал</h3>
              <p>
                Рейтинги фільмів, збереження улюблених, детальна інформація,
                акторський склад, відгуки та трейлери.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.skillsSection}>
          <h2 className={styles.sectionTitle}>Навички та технології</h2>
          <div className={styles.skillsGrid}>
            <div className={styles.skillCategory}>
              <div className={styles.categoryIcon}>💻</div>
              <h3>Frontend</h3>
              <div className={styles.skillTags}>
                <span className={styles.skillTag}>React</span>
                <span className={styles.skillTag}>JavaScript</span>
                <span className={styles.skillTag}>CSS3</span>
                <span className={styles.skillTag}>HTML5</span>
                <span className={styles.skillTag}>React Router</span>
                <span className={styles.skillTag}>Responsive Design</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <div className={styles.categoryIcon}>🎨</div>
              <h3>Дизайн і UX</h3>
              <div className={styles.skillTags}>
                <span className={styles.skillTag}>UI/UX Design</span>
                <span className={styles.skillTag}>CSS Animations</span>
                <span className={styles.skillTag}>Glassmorphism</span>
                <span className={styles.skillTag}>Mobile First</span>
                <span className={styles.skillTag}>Figma</span>
              </div>
            </div>

            <div className={styles.skillCategory}>
              <div className={styles.categoryIcon}>🛠️</div>
              <h3>Інструменти</h3>
              <div className={styles.skillTags}>
                <span className={styles.skillTag}>Vite</span>
                <span className={styles.skillTag}>Git & GitHub</span>
                <span className={styles.skillTag}>VS Code</span>
                <span className={styles.skillTag}>Node.js</span>
                <span className={styles.skillTag}>REST API</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Давайте співпрацювати!</h2>
          <p className={styles.contactDescription}>
            Готовий до нових викликів і цікавих проектів. Зв&apos;яжіться зі
            мною!
          </p>
          <div className={styles.contactInfo}>
            <a
              href="mailto:rostyslavmushynskyi@gmail.com"
              className={styles.contactLink}
            >
              <span className={styles.linkIcon}>📧</span>
              <div className={styles.linkContent}>
                <strong>Email</strong>
                <span>rostyslavmushynskyi@gmail.com</span>
              </div>
            </a>
            <a
              href="https://github.com/rostyslavMushynskyi"
              className={styles.contactLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.linkIcon}>⚡</span>
              <div className={styles.linkContent}>
                <strong>GitHub</strong>
                <span>@rostyslavMushynskyi</span>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/%D1%80%D0%BE%D1%81%D1%82%D0%B8%D1%81%D0%BB%D0%B0%D0%B2-%D0%BC%D1%83%D1%88%D0%B8%D0%BD%D1%81%D1%8C%D0%BA%D0%B8%D0%B9-983265232/"
              className={styles.contactLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.linkIcon}>💼</span>
              <div className={styles.linkContent}>
                <strong>LinkedIn</strong>
                <span>Rostislav Mushynskyi</span>
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.authorFooter}>
          <p>
            © 2025 Ростислав Мушинський. Створено з ❤️ для курсу веб-розробки.
          </p>
          <p className={styles.timestamp}>
            Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AuthorPage;
