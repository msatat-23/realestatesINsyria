import classes from './statistics.module.css';
import prisma from '@/lib/prisma';
import IncreaseViews from './increase-views';
const Statistics = async ({ id, views, rating, numOfRaters, createdAt }) => {

    const fixedRating = rating?.toNumber?.() ?? 0;
    const formmatedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-GB',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-') : '';

    return (
        <table className={classes.table}>
            <thead>
                <tr>
                    <th>
                        <div className={classes.headerItem}>
                            <img src='/assets/icons/stats_icons/eye.png' alt="views" />
                            <span>عدد المشاهدات</span>
                        </div>
                    </th>
                    <th>
                        <div className={classes.headerItem}>
                            <img src='/assets/icons/stats_icons/star.png' alt="rating" />
                            <span>تقييم العقار</span>
                        </div>
                    </th>
                    <th>
                        <div className={classes.headerItem}>
                            <img src='/assets/icons/stats_icons/stats.png' alt="raters" />
                            <span>عدد المقيمين</span>
                        </div>
                    </th>
                    <th>
                        <div className={classes.headerItem}>
                            <img src='/assets/icons/stats_icons/calendar (1).png' alt="date" />
                            <span>تاريخ النشر</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <IncreaseViews id={id} />
                    <td data-label="عدد المشاهدات">{views}</td>
                    <td data-label="تقييم العقار">{fixedRating}</td>
                    <td data-label="عدد المقيمين">{numOfRaters}</td>
                    <td data-label="تاريخ النشر">{formmatedDate}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Statistics;
