CREATE OR REPLACE FUNCTION send_notification_after_reviewing_property()
RETURNS TRIGGER AS $$
BEGIN 
  IF NEW."state"='مقبول'
  THEN INSERT INTO "Notification"
  ("userId","title","description") VALUES
  (NEW."userId",'مراجعة عقار','عزيزي المستخدم تم عرض عقارك '||NEW."title"||' بنجاح ✅.');
  ELSIF NEW."state"='مرفوض'
  THEN INSERT INTO "Notification"
  ("userId","title","description") VALUES
  (NEW."userId",'مراجعة عقار','عزيزي المستخدم تم رفض عقارك ❌ '||NEW."title"||' ،يرجى مراجعة شروط الاستخدام وسياسة الخصوصية.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER send_notification_reviewing_property_feedback
AFTER UPDATE OF "state" ON "Property"
FOR EACH ROW
EXECUTE FUNCTION send_notification_after_reviewing_property();


