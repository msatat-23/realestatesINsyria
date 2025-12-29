CREATE OR REPLACE FUNCTION send_notification_after_property_completed()
RETURNS TRIGGER AS $$
BEGIN 
  INSERT INTO "Notification"
  ("userId","title","description") VALUES
  (NEW."userId",'إضافة عقار','عزيزي المستخدم العقار الذي أضفته '|| NEW."title" || ' هو قيد المراجعة في مدة أقصاها ساعتان سيتم إشعارك بالنتيجة.');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER send_under_review_notification_after_property_completed
AFTER UPDATE ON "Property"
FOR EACH ROW 
WHEN (NEW.completed = true) 
EXECUTE FUNCTION send_adding_property_notification();