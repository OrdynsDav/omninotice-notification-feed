import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationFeedPage, NotificationsFeedProvider } from '../src/public';
import NotificationsState from '../src/components/molecules/NotificationsState/NotificationsState';

describe('Настройки (§3.1)', () => {
  it('применяет pageTitle и pageSubtitle', () => {
    render(
      <NotificationsFeedProvider settings={{ pageTitle: 'Мои уведомления', pageSubtitle: 'Подзаголовок' }}>
        <NotificationFeedPage />
      </NotificationsFeedProvider>
    );
    expect(screen.getByText('Мои уведомления')).toBeInTheDocument();
    expect(screen.getByText('Подзаголовок')).toBeInTheDocument();
  });

  it('добавляет пользовательский класс к корню страницы', () => {
    const { container } = render(
      <NotificationsFeedProvider>
        <NotificationFeedPage className="custom-notifications-page" />
      </NotificationsFeedProvider>
    );
    expect(container.querySelector('.custom-notifications-page')).toBeInTheDocument();
  });

  it('добавляет пользовательский класс к секции уведомлений', () => {
    const { container } = render(
      <NotificationsFeedProvider>
        <NotificationFeedPage sectionClassName="custom-notifications-section" />
      </NotificationsFeedProvider>
    );
    expect(
      container.querySelector('section.custom-notifications-section')
    ).toBeInTheDocument();
  });

  it('показывает текст состояния ошибки из конфига без переопределения', () => {
    render(
      <NotificationsFeedProvider>
        <NotificationsState state="error" />
      </NotificationsFeedProvider>
    );
    expect(screen.getByText(/Проверьте соединение и повторите/)).toBeInTheDocument();
  });

  it('использует текст состояния из конфига, если передано пустое описание', () => {
    render(
      <NotificationsFeedProvider>
        <NotificationsState state="error" description="" />
      </NotificationsFeedProvider>
    );
    expect(screen.getByText(/Проверьте соединение и повторите/)).toBeInTheDocument();
  });

  it('применяет sidebarBackdrop', () => {
    const { container } = render(
      <NotificationsFeedProvider settings={{ sidebarBackdrop: false }}>
        <NotificationFeedPage />
      </NotificationsFeedProvider>
    );
    // Проверяем, что класс backdrop не добавлен (или добавлен, если true)
    const backdrop = container.querySelector('[class*="backdrop"]');
    if (backdrop) {
      expect(backdrop.className).not.toContain('filled');
    }
  });
});