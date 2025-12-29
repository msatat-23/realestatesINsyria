'use client';
import { Fragment, useEffect, useState } from 'react';
import './notifications.css';
import { fetchAllNotifications, markAllRead, markRead } from './notification-actions';

export default function NotificatioSidebar({ close }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await fetchAllNotifications();
            console.log(res);
            setNotifications(res.data);
        }
        catch (e) {
            console.log("فشل جلب الإشعارات:", e);
        }
        finally {
            setLoading(false);
        }
    };
    const markAsRead = async (id) => {
        try {
            setLoading(true);
            const res = await markRead(id);
            setNotifications(
                notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            console.log(res);
        } catch (e) {
            console.log('فشل تعليم الإشعار كمقروء:', e);
        }
        finally {
            setLoading(false);
        }
    };
    const markAllAsRead = async () => {
        try {
            setLoading(true);
            const res = await markAllRead();
            setNotifications(
                notifications.map((n) => ({ ...n, isRead: true })));
            console.log(res);
        } catch (e) {
            console.log('فشل تعليم الإشعارات كمقروء:', e);
        }
        finally {
            setLoading(false);
        }
    };

    const unreadCount = notifications.length > 0 ? notifications.filter((n) => !n.isRead).length : 0;


    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Fragment>

            <div
                className="notification-overlay"
                onClick={close}
                aria-label="إغلاق الشريط"
            ></div>


            <div className="notification-sidebar">
                <div className="notification-header">
                    <h2>الإشعارات</h2>
                    <button
                        onClick={close}
                        className="notification-close-btn"
                        aria-label="إغلاق"
                    >
                        ✕
                    </button>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="notification-mark-all-btn"
                    >
                        تعليم الكل كمقروء
                    </button>
                )}

                <div className="notification-list">
                    {loading ? (
                        <div className="notification-loading">جاري التحميل...</div>
                    ) : notifications.length === 0 ? (
                        <div className="notification-empty">لا توجد إشعارات</div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`notification-item ${!n.isRead ? 'notification-unread' : ''}`}
                            >
                                <div className="notification-title">{n.title}</div>
                                <div className="notification-message">
                                    {n.description}
                                </div>
                                <div className="notification-footer">
                                    <span className="notification-time">
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="notification-read-btn"
                                        >
                                            تعليم كمقروء
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Fragment>
    );
}